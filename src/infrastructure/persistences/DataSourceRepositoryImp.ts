import { DataSourceRepository } from "@domain/repository/DataSourceRepository";
import { FastifyInstance } from "fastify";
import { Repository } from "../Repository";
import { DataSourceEntity } from "@domain/entity/data_source/DataSourceEntity";
import { DataSourceRaw } from "@domain/entity/data_source/DataSourceRaw";

export class DataSourceRepositoryImp extends Repository implements DataSourceRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public insert = async (data: DataSourceEntity): Promise<number> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO data_sources (id_thumbnail, name, description, domain, url_base, created_at, updated_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING id_data_source;
            `;
            
            const values = [
                data.id_thumbnail,
                data.name,
                data.description,
                data.domain,
                data.url_base,
                data.created_at ?? new Date(),
                data.updated_at ?? new Date()
            ];
            
            const res = await client.query(sql, values);

            if (!res.rows || res.rows.length === 0) {
                throw new Error("Error al insertar la fuente de datos: No se recibió un ID.");
            }

            return res.rows[0].id_data_source;
        });
    }

    public update = async (data: DataSourceEntity): Promise<void> => {
        return await this.dbScope(async (client) => {
            if(!data.id_data_source){
                throw new Error("Falta el ID de la fuente de datos");
            }

            const sql = `
                UPDATE data_sources
                SET name = $1, description = $2, domain = $3, url_base = $4, updated_at = $5
                WHERE id_data_source = $6;
            `;

            const values = [
                data.name,
                data.description,
                data.domain,
                data.url_base,
                data.updated_at ?? new Date(),
                data.id_data_source.toString()
            ];
            
            await client.query(sql, values);
        });
    }

    public find = async (id: number): Promise<DataSourceRaw> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT thumbnails.id_thumbnail, thumbnails.url as thumbnail_url, 
                    data_sources.id_data_source, data_sources.name, data_sources.description, data_sources.url_base,
                    data_sources.domain, data_sources.created_at, data_sources.updated_at 
                FROM data_sources
                JOIN thumbnails ON data_sources.id_thumbnail = thumbnails.id_thumbnail
                WHERE id_data_source = $1
            `;

            const res = await client.query(sql, [id]);

            if(!res.rows.length){
                throw new Error("No existe esta fuente de datos");
            }

            return res.rows[0];
        });
    }
    
    public findAll = async (): Promise<DataSourceRaw[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT thumbnails.id_thumbnail, thumbnails.url as thumbnail_url, 
                    data_sources.id_data_source, data_sources.name, data_sources.description, data_sources.url_base,
                    data_sources.domain, data_sources.created_at, data_sources.updated_at 
                FROM data_sources
                JOIN thumbnails ON data_sources.id_thumbnail = thumbnails.id_thumbnail
                WHERE data_sources.deleted_at IS NULL
                ORDER BY id_data_source DESC
            `;

            const res = await client.query(sql);
            return res.rows;
        });
    }

    public delete = async (id: number): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE data_sources
                SET deleted_at = $1
                WHERE id_data_source = $2
            `;
            await client.query(sql, [new Date(), id.toString()]);
        });
    }

    public existDomain = async (domain: string, name: string): Promise<boolean> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT EXISTS (
                    SELECT 1
                    FROM data_sources
                    WHERE (domain = $1 OR name = $2) AND deleted_at IS NULL
                )
            `;

            const res = await client.query(sql, [domain, name]);
            return res.rows[0].exists; // Devuelve true o false directamente
        });
    }
}
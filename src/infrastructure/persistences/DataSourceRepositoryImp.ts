import { DataSource } from "@domain/model/data_source/DataSource";
import { DataSourceRepository } from "@domain/repository/DataSourceRepository";
import { FastifyInstance } from "fastify";
import { Repository } from "../Repository";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";

export class DataSourceRepositoryImp extends Repository implements DataSourceRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public insert = async (data: DataSource): Promise<bigint> => {
        return this.dbScope(async (client) => {
            const sql = `
                INSERT INTO data_sources (id_thumbnail, name, description, domain, url_base, created_at, updated_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING id_data_source;
            `;
            
            const values = [
                data.thumbnail.id,
                data.name,
                data.description,
                data.domain,
                data.url_base,
                new Date,
                new Date
            ];
            
            const res = await client.query(sql, values);
            return res.rows[0].id_data_source;
        });
    }

    public update = async (data: DataSource): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                UPDATE data_sources
                SET name = $1, description = $2, domain = $3, url_base = $4, updated_at = $5
                WHERE id_thumbnail = $6;
            `;
        
            const values = [
                data.name,
                data.description,
                data.domain,
                data.url_base,
                new Date(),
                data.id
            ];
            
            await client.query(sql, values);
        });
    }

    private mapper = (row: any): DataSource => {
        let thumbnail: Thumbnail = {
            id: row.id_thumbnail,
            url: row.url
        };

        let dataSource: DataSource = {
            id: row.id_data_source,
            thumbnail: thumbnail,
            name: row.name,
            description: row.description,
            url_base: row.url_base,
            domain: row.domain,
            created_at: row.created_at,
            updated_at: row.deleted_at
        }

        return dataSource;
    }

    public find = async (id: bigint): Promise<DataSource | null> => {
        return this.dbScope(async (client) => {
            const sql = `
                SELECT thumbnails.id_thumbnail, thumbnail.url, 
                    data_sources.id_data_source, data_sources.name, data_sources.description, data_sources.url_base, data_sources.domain, data_sources.created_at, data_sources.deleted_at, 
                FROM data_sources
                JOIN thumbnails ON data_source.id_thumbnail = thumbnail.id_thumbnail
                WHERE id_data_source = $1
            `;
            const res = await client.query(sql, [id.toString()]);
            const row = res.rows[0];
            
            const response = this.mapper(row);
            return response;
        });
    }
    
    public findAll = async (): Promise<DataSource[]> => {
        return this.dbScope(async (client) => {
            const sql = `
                SELECT *
                FROM data_sources
                ORDER BY id_data_source DESC
            `;

            const res = await client.query(sql);
            return res.rows.map(row => this.mapper(row));
        });
    }

    public delete = async (id: bigint): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                DELETE FROM data_sources
                WHERE id_data_source = $1
            `;
            await client.query(sql, [id.toString()]);
        });
    }

    public existDomain = async (domain: string): Promise<boolean> => {
        return this.dbScope(async (client) => {
            const sql = `
                SELECT EXISTS (
                    SELECT 1
                    FROM data_sources
                    WHERE domain = $1
                )
            `;

            const res = await client.query(sql, [domain]);
            return res.rows[0].exists; // Devuelve true o false directamente
        });
    }
}
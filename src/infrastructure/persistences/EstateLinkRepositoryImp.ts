import { Repository } from "@infrastructure/Repository.ts";
import { EstateLinkRepository } from "@domain/repository/EstateLinkRepository.ts";
import {FastifyInstance} from "fastify";
import {EstateLinkEntity} from "@domain/entity/estate_link/EstateLinkEntity.ts";
import {FilterEstateLink} from "@domain/model/estate_link/FilterEstateLink.ts";

export class EstateLinkRepositoryImp extends Repository implements  EstateLinkRepository{
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public insert = async (data: EstateLinkEntity): Promise<BigInt> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO estate_links (id_data_source, url_path, added_at) 
                VALUES ($1, $2, $3) 
                RETURNING id_estate_link;
            `;

            const values = [
                data.id_data_source,
                data.url_path,
                data.added_at ?? new Date()
            ];

            const res = await client.query(sql, values);

            if (!res.rows || res.rows.length === 0) {
                throw new Error("Error al insertar el raspador de inmueble: No se recibió un ID.");
            }

            return res.rows[0].id_estate_link;
        });
    }

    public find = async (id: BigInt): Promise<EstateLinkEntity> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_estate_link, id_data_source, url_path, added_at, deleted_at, last_scraped
                FROM estate_links
                WHERE id_estate_link = $1 AND deleted_at IS NULL
            `;

            const res = await client.query(sql, [id.toString()]);

            if (!res.rows || res.rows.length === 0) {
                throw new Error("Error al insertar el link de inmuebles: No se recibió un ID.");
            }
            const row = res.rows[0];
            row.id_estate_link = BigInt(row.id_estate_link);
            return row;
        });
    }

    public findAll = async (filter: FilterEstateLink): Promise<EstateLinkEntity[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_estate_link, id_data_source, url_path, added_at, deleted_at, last_scraped
                FROM estate_links
                WHERE id_data_source = $1 AND deleted_at IS NULL
                ORDER BY last_scraped ASC NULLS FIRST
                LIMIT $2 OFFSET $3
            `;

            const res = await client.query(sql, [
                filter.id_data_source,
                filter.size,
                filter.page * filter.size,
            ]);

            return res.rows.map(row => {
                row.id_estate_link = BigInt(row.id_estate_link);
                return row;
            });
        });
    }

    public delete = async (id: BigInt): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                UPDATE estate_links
                SET deleted_at = $1
                WHERE id_estate_link = $2
            `;
            await client.query(sql, [new Date(), id.toString()]);
        });
    }

    public existUrlPath = async (url_path: string): Promise<boolean> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT EXISTS (
                    SELECT 1
                    FROM estate_links
                    WHERE url_path = $1 AND deleted_at IS NULL
                )
            `;

            const res = await client.query(sql, [url_path]);
            return res.rows[0].exists; // Devuelve true o false directamente
        });
    }

    public findByUrlAndIdDataSource = async (url_path: string, id_data_source: number): Promise<EstateLinkEntity | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_estate_link, id_data_source, url_path, added_at, deleted_at, last_scraped
                FROM estate_links
                WHERE url_path = $1 AND id_data_source = $2 AND deleted_at IS NULL
            `;

            const res = await client.query(sql, [url_path, id_data_source]);
            if(!res.rows || res.rows.length === 0) {
                return null;
            }
            return res.rows[0];
        });
    }

    public updateLastScraper = async (id_estate_link: BigInt): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                UPDATE estate_links
                SET last_scraped = $1
                WHERE id_estate_link = $2
            `;
            await client.query(sql, [new Date(), id_estate_link.toString()]);
        });
    }
}
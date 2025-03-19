import {FastifyInstance} from "fastify";
import {PortalScraperRepository} from "@domain/repository/PortalScraperRepository.ts";
import {Repository} from "@infrastructure/Repository.ts";
import { PortalScraperEntity } from "@domain/entity/portal_scraper/PortalScraperEntity.ts";
export class PortalScraperRepositoryImp extends Repository implements PortalScraperRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public delete = async (id: number): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                UPDATE portal_scrapers
                SET deleted_at = $1
                WHERE id_portal_scraper = $2
            `;
            await client.query(sql, [new Date(), id.toString()]);
        });
    }

    public existUrlPath = async (url_path: string, name: string): Promise<boolean> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT EXISTS (
                    SELECT 1
                    FROM portal_scrapers
                    WHERE (url_path = $1 OR name = $2) AND deleted_at IS NULL
                )
            `;

            const res = await client.query(sql, [url_path, name]);
            return res.rows[0].exists; // Devuelve true o false directamente
        });
    }

    public find = async (id: number): Promise<PortalScraperEntity> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_portal_scraper, id_data_source, name, url_path, user_agent,
                    cron_time, max_attempts, file, created_at, updated_at, last_scraped
                FROM portal_scrapers
                WHERE id_portal_scraper = $1
            `;
            const res = await client.query(sql, [id.toString()]);
            return res.rows[0];
        });
    }

    public findAll = async (id_data_source: number): Promise<PortalScraperEntity[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_portal_scraper, id_data_source, name, url_path, user_agent, 
                       cron_time, max_attempts, file, created_at, updated_at, last_scraped
                FROM portal_scrapers
                WHERE id_data_source = $1 AND deleted_at IS NULL
            `;

            const res = await client.query(sql, [id_data_source]);
            return res.rows;
        });
    }

    public insert = async (data: PortalScraperEntity): Promise<number> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO portal_scrapers (id_data_source, name, url_path, user_agent, cron_time, max_attempts, file, created_at, updated_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING id_portal_scraper;
            `;
            
            const values = [
                data.id_data_source,
                data.name,
                data.url_path,
                data.user_agent,
                data.cron_time,
                data.max_attempts,
                data.file,
                data.created_at ?? new Date(),
                data.updated_at ?? new Date()
            ];
            
            const res = await client.query(sql, values);
            
            if (!res.rows || res.rows.length === 0) {
                throw new Error("Error al insertar el raspador de portal: No se recibió un ID.");
            }

            return res.rows[0].id_portal_scraper;
        });
    }

    public update = async (data: PortalScraperEntity): Promise<void> => {
        return await this.dbScope(async (client) => {
            if(!data.id_portal_scraper){
                throw new Error("Falta el ID de la fuente de datos");
            }

            const sql = `
                UPDATE portal_scrapers
                SET id_data_source = $1, name = $2, url_path = $3, user_agent = $4, cron_time = $5, max_attempts = $6, updated_at = $8
                WHERE id_portal_scraper = $9;
            `;

            const values = [
                data.id_data_source,
                data.name,
                data.url_path,
                data.user_agent,
                data.cron_time,
                data.max_attempts,
                data.updated_at ?? new Date(),
                
                data.id_portal_scraper.toString()
            ];
            
            await client.query(sql, values);
        });
    }

    public saveFile = async (file: string, id_portal_scraper: number): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE portal_scrapers
                SET file = $1
                WHERE id_portal_scraper = $2;
            `;

            await client.query(sql, [ file, id_portal_scraper ]);
        });
    }
}
import {FastifyInstance} from "fastify";
import {PortalScraperRepository} from "@domain/repository/PortalScraperRepository.ts";
import {Repository} from "@infrastructure/Repository.ts";
import {PortalScraper} from "@domain/model/portal_scraper/PortalScraper.ts";
import { DataSource } from "@domain/model/data_source/DataSource";

export class PortalScraperRepositoryImp extends Repository implements PortalScraperRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public delete = async (id: bigint): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                UPDATE portal_scrapers
                SET deleted_at = $1
                WHERE id_portal_scraper = $2
            `;
            await client.query(sql, [new Date, id.toString()]);
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

    private mapper = (row: any, data_source: DataSource): PortalScraper => {
        return {
            data_source: data_source,
            name: row.name,
            url_path: row.url_path,
            created_at: row.created_at,
            updated_at: row.updated_at
        }
    }

    public find = async (id: bigint, data_source: DataSource): Promise<PortalScraper | null> => {
        return this.dbScope(async (client) => {
            const sql = `
                SELECT portal_scrapers.id_portal_scraper, portal_scrapers.name, portal_scrapers.url_path, portal_scrapers.user_agent,
                    portal_scrapers.cron_time, portal_scrapers.max_attempts, portal_scrapers.file, portal_scrapers.created_at, portal_scrapers.updated_at
                FROM portal_scrapers
                WHERE id_portal_scraper = $1
            `;
            const res = await client.query(sql, [id.toString()]);
            const row = res.rows[0];
            
            const response = this.mapper(row, data_source);
            return response;
        });
    }

    public findAll = async (data_source: DataSource): Promise<PortalScraper[]> => {
        return this.dbScope(async (client) => {
            const sql = `
                SELECT portal_scrapers.id_portal_scraper, portal_scrapers.name, portal_scrapers.url_path, portal_scrapers.user_agent,
                    portal_scrapers.cron_time, portal_scrapers.max_attempts, portal_scrapers.file, portal_scrapers.created_at, portal_scrapers.updated_at
                FROM portal_scrapers
                WHERE portal_scrapers.id_data_source = $1
            `;
            const res = await client.query(sql, [data_source.id]);
            return res.rows.map(row => this.mapper(row, data_source));
        });
    }

    public insert = async (data: PortalScraper): Promise<bigint> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO portal_scrapers (id_data_source, name, url_path, user_agent, cron_time, max_attempts, file, created_at, updated_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                RETURNING id_portal_scraper;
            `;
            
            const values = [
                data.data_source.id,
                data.name,
                data.url_path,
                data.user_agent,
                data.cron_time,
                data.max_attempts,
                data.file,
                new Date,
                new Date
            ];
            
            const res = await client.query(sql, values);
            return res.rows[0].id_portal_scraper;
        });
    }

    public update = async (data: PortalScraper): Promise<void> => {
        return await this.dbScope(async (client) => {
            if(!data.id){
                throw new Error("Falta el ID de la fuente de datos");
            }

            const sql = `
                UPDATE portal_scrapers
                SET id_data_source = $1, name = $2, url_path = $3, user_agent = $4, cron_time = $5, max_attempts = $6, file = $7, updated_at = $8
                WHERE id_portal_scraper = $9;
            `;

            const values = [
                data.data_source.id,
                data.name,
                data.url_path,
                data.user_agent,
                data.cron_time,
                data.max_attempts,
                data.file,
                new Date(),
                
                data.id.toString()
            ];
            
            await client.query(sql, values);
        });
    }
}
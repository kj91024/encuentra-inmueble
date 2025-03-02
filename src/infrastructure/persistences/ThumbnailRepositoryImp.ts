import {Thumbnail} from "@domain/model/thumbnail/Thumbnail";
import {ThumbnailRepository} from "@domain/repository/ThumbnailRepository";
import {Repository} from "@infrastructure/Repository";
import {FastifyInstance} from "fastify";

export class ThumbnailRepositoryImp extends Repository implements ThumbnailRepository {
    
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    private mapper = (row:any): Thumbnail => {
        return {
            id: row.id,
            url: row.url,
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }

    public delete = async (id: bigint): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE thumbnails
                SET deleted_at = $1
                WHERE id_thumbnail = $2
            `;
            await client.query(sql, [new Date, id.toString()]);
        });
    }

    public find = async (id: bigint): Promise<Thumbnail | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT *
                FROM thumbnails
                WHERE id_thumbnail = $1
            `;

            const res = await client.query(sql, [id.toString()]);
            const row = res.rows[0];
            return this.mapper(row);
        });
    }
    
    public findAll = async (): Promise<Thumbnail[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT *
                FROM thumbnails
                ORDER BY id_thumbnail DESC
            `;

            const res = await client.query(sql);
            return res.rows.map(row => this.mapper(row));
        });
    }
    public insert = async (data: Thumbnail): Promise<bigint> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO thumbnails (url, created_at, updated_at) 
                VALUES ($1, $2, $3) 
                RETURNING id_thumbnail;
            `;
            
            const values = [
                data.url,
                new Date,
                new Date
            ];
            
            const res = await client.query(sql, values);
            return res.rows[0].id_thumbnail;
        });
    }

    public update = async (data: Thumbnail): Promise<void> => {
        await this.dbScope(async (client) => {
            const sql = `
                UPDATE thumbnails
                SET url = $1, updated_at = $2
                WHERE id_thumbnail = $3;
            `;
        
            const values = [
                data.url,
                new Date(),
                data.id
            ];
            
            await client.query(sql, values);
        });
    };
    
}
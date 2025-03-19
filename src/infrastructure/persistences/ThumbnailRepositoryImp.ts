import { ThumbnailEntity } from "@domain/entity/thumbnail/ThumbnailEntity";
import { ThumbnailRaw } from "@domain/entity/thumbnail/ThumbnailRaw";
import {Thumbnail} from "@domain/model/thumbnail/Thumbnail";
import {ThumbnailRepository} from "@domain/repository/ThumbnailRepository";
import {Repository} from "@infrastructure/Repository";
import {FastifyInstance} from "fastify";

export class ThumbnailRepositoryImp extends Repository implements ThumbnailRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    private convertToBigInt = row => {
        row.id_thumbnail = BigInt(row.id_thumbnail);
        return row;
    }

    public delete = async (id: BigInt): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE thumbnails
                SET deleted_at = $1
                WHERE id_thumbnail = $2
            `;
            await client.query(sql, [new Date(), id.toString()]);
        });
    }

    public find = async (id: BigInt): Promise<ThumbnailRaw> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT *
                FROM thumbnails
                WHERE id_thumbnail = $1
            `;

            const res = await client.query(sql, [id.toString()]);

            if(!res.rows.length){
                throw new Error("No existe este thumbnail");
            }
            
            return this.convertToBigInt(res.rows[0]);
        });
    }

    public findByUrl = async (url: string): Promise<ThumbnailRaw | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT *
                FROM thumbnails
                WHERE url = $1
            `;

            const res = await client.query(sql, [url]);
            const rows = res.rows;

            if(!rows?.length){
                return null;
            }

            return this.convertToBigInt(rows[0]);
        });
    }

    public findAll = async (): Promise<ThumbnailRaw[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT *
                FROM thumbnails
                ORDER BY id_thumbnail DESC
            `;

            const res = await client.query(sql);
            return res.rows.map(row => {
                row.id_thumbnail = BigInt(row.id_thumbnail);
                return row;
            });
        });
    }

    public insert = async (data: ThumbnailEntity): Promise<BigInt> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO thumbnails (url, created_at, updated_at) 
                VALUES ($1, $2, $3) 
                RETURNING id_thumbnail;
            `;
            
            const values = [
                data.url,
                data.created_at ?? new Date(),
                data.updated_at ?? new Date()
            ];
            
            const res = await client.query(sql, values);

            if (!res.rows || res.rows.length === 0) {
                throw new Error("Error al insertar la miniatura: No se recibió un ID.");
            }
                
            return BigInt(res.rows[0].id_thumbnail);
        });
    }

    public update = async (data: ThumbnailEntity): Promise<void> => {
        await this.dbScope(async (client) => {
            const sql = `
                UPDATE thumbnails
                SET url = $1, updated_at = $2
                WHERE id_thumbnail = $3;
            `;
        
            const values = [
                data.url,
                data.updated_at ?? new Date(),
                data.id_thumbnail
            ];
            
            await client.query(sql, values);
        });
    };

    public findAllByEstate = async (id_estate: BigInt): Promise<ThumbnailRaw[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT thumbnails.*
                FROM thumbnails
                JOIN relation_thumbnail_estates ON thumbnails.id_thumbnail = relation_thumbnail_estates.id_thumbnail
                WHERE relation_thumbnail_estates.id_estate = $1
                ORDER BY thumbnails.id_thumbnail DESC
                LIMIT 10
            `;

            const res = await client.query(sql, [id_estate]);
            return res.rows.map(row => this.convertToBigInt(row));
        });
    }
    
}
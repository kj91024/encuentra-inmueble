import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";
import { ThumbnailRepository } from "@domain/repository/ThumbnailRepository";
import { Repository } from "@infrastructure/Repository";
import { FastifyInstance } from "fastify";
import { PoolClient } from "pg";

export class ThumbnailRepositoryImp extends Repository implements ThumbnailRepository {
    
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public delete = async (id: bigint): Promise<void> => {
        return this.dbScope(async (client) => {
            const sql = `
                DELETE FROM thumbnails
                WHERE id_thumbnail = $1
            `;
            await client.query(sql, [id.toString()]);
        });
    }
    public find = async (id: bigint): Promise<Thumbnail | null> => {
        return null;
    }
    public findAll = async (): Promise<Thumbnail[]> => {
        return ;
    }
    public insert = async (data: Thumbnail): Promise<bigint> => {
        const client = await this.fastify.pg.connect();

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
        
        try {
            const res = await client.query(sql, values);
            return res.rows[0].id_thumbnail;
        } catch (err) {
            console.error("Error insertando thumbnail:", err);
            throw new Error("Error al insertar en la base de datos");
        } finally {
            client.release();
        }
    }

    public update = async (data: Thumbnail): Promise<void> => {
        const client = await this.fastify.pg.connect();
    
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
    
        try {
            await client.query(sql, values);
        } catch (err) {
            console.error("Error actualizando thumbnail:", err);
            throw new Error("Error al actualizar el thumbnail");
        } finally {
            client.release();
        }
    };
    
}
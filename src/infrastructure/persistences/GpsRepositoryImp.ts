import {Repository} from "@infrastructure/Repository.ts";
import {GpsRepository} from "@domain/repository/GpsRepository.ts";
import {Gps} from "@domain/model/gps/Gps.ts";
import {CreateGps} from "@domain/model/gps/CreateGps.ts";
import {FastifyInstance} from "fastify";
import {GpsEntity} from "@domain/entity/GpsEntity.ts";

export class GpsRepositoryImp extends Repository implements GpsRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: BigInt): Promise<Gps> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_gps as id, latitude as lat, longitue as lng, address 
                FROM gps
                WHERE id_gps = $1
            `;

            const res = await client.query(sql, [id.toString()]);
            return res.rows[0];
        });
    }

    public findAll = async (ids: BigInt[]): Promise<Gps[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_gps as id, latitude as lat, longitue as lng, address 
                FROM gps
                WHERE id_gps = ANY($1)
            `;

            const res = await client.query(sql, [ids.map(id => id.toString())]);
            return res.rows;
        });
    }

    public insert = async (data: GpsEntity): Promise<BigInt> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO gps (latitude, longitude, address) 
                VALUES ($1, $2, $3) 
                RETURNING id_gps;
            `;

            const values = [
                data.latitude,
                data.longitude,
                data.address
            ];

            const res = await client.query(sql, values);
            const rows = res.rows;
            if (!rows?.length) {
                throw new Error("Error al insertar gps: No se recibió un ID.");
            }

            return BigInt(rows[0].id_gps);
        });
    }

    public update = async (data: GpsEntity): Promise<void> => {
        return await this.dbScope(async (client) => {
            if(!data.id_gps){
                throw new Error("Falta el ID del gps");
            }

            const sql = `
                UPDATE gps
                SET latitude = $1, longitude = $2, address = $3
                WHERE id_gps = $4;
            `;

            const values = [
                data.latitude,
                data.longitude,
                data.address,
                data.id_gps
            ];

            await client.query(sql, values);
        });
    }

}
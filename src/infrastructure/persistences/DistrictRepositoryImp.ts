import {Repository} from "@infrastructure/Repository.ts";
import {DistrictRepository} from "@domain/repository/DistrictRepository.ts";
import {District} from "@domain/model/District.ts";
import {FastifyInstance} from "fastify";
import {IdsLocation} from "@domain/entity/IdsLocation.ts";

export class DistrictRepositoryImp extends Repository implements DistrictRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: number): Promise<District> => {
        return await this.dbScope( async (client) => {
            const sql = `
                SELECT id_district as id, name
                FROM districts
                WHERE id_district = $1
            `;

            const res = await client.query(sql, [id]);
            return res.rows[0];
        });
    }

    public findAll = async (id_departament: number, id_province: number): Promise<District[]> => {
        return await this.dbScope( async (client) => {
            const sql = `
                SELECT id_district as id, name
                FROM districts
                where id_departament = $1 AND id_province = $2 
            `;

            const res = await client.query(sql, [id_departament, id_province]);
            return res.rows;
        });
    }

    public findByLonLat = async (lon: number, lat: number): Promise<IdsLocation | null> => {
        return await this.dbScope( async (client) => {
            const sql = `
                SELECT id_departament, id_province, id_district
                FROM districts
                WHERE ST_Contains(area, ST_SetSRID(ST_Point($1, $2), 4326));
            `;

            const res = await client.query(sql, [lon, lat]);
            return res.rows[0];
        });
    }

    public findByUbigeo = async (ubigeo: number): Promise<IdsLocation | null> => {
        return await this.dbScope( async (client) => {
            const sql = `
                SELECT id_departament, id_province, id_district
                FROM districts
                WHERE districts.ubigeo = $1
            `;

            const res = await client.query(sql, [ubigeo]);
            return res.rows[0];
        });
    }
}
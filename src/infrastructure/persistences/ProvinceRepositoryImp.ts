import { ProvinceRepository } from "@domain/repository/ProvinceRepository.ts";
import { Repository } from "@infrastructure/Repository.ts";
import { Province } from "@domain/model/Province.ts";
import { FastifyInstance } from "fastify";

export class ProvinceRepositoryImp extends Repository implements ProvinceRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: number): Promise<Province> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_province as id, name
                FROM provinces
                WHERE id_province = $1
            `;

            const res = await client.query(sql, [id]);
            return res.rows[0];
        });
    }

    public findAll = async (id_departament: number): Promise<Province[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_province as id, name
                FROM provinces
                WHERE id_departament = $1
            `;

            const res = await client.query(sql, [id_departament]);
            return res.rows;
        });
    }

}
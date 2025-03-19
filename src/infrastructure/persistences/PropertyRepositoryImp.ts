import {Repository} from "@infrastructure/Repository.ts";
import {PropertyRepository} from "@domain/repository/PropertyRepository.ts";
import {Property} from "@domain/model/Property.ts";
import {FastifyInstance} from "fastify";

export class PropertyRepositoryImp extends Repository implements PropertyRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: number): Promise<Property> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_property as id, name, description
                FROM properties
                WHERE id_property = $1
            `;

            const res = await client.query(sql, [id]);
            return res.rows[0];
        })
    }

    public findAll = async (): Promise<Property[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_property as id, name, description
                FROM properties
            `;

            const res = await client.query(sql);
            return res.rows;
        })
    }
}
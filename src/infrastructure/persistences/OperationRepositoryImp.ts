import {Repository} from "@infrastructure/Repository.ts";
import {OperationRepository} from "@domain/repository/OperationRepository.ts";
import {FastifyInstance} from "fastify";
import {Operation} from "@domain/model/Operation.ts";

export class OperationRepositoryImp extends Repository implements OperationRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: number): Promise<Operation> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_operation as id, name, description
                FROM operations
                WHERE id = $1 
            `;

            const res = await client.query(sql, [id]);
            return res.rows[0];
        })
    }

    public findAll = async (): Promise<Operation[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_operation as id, name, description
                FROM operations
            `;

            const res = await client.query(sql);
            return res.rows;
        });
    }
}
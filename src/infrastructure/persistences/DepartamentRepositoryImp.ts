import {DepartamentRepository} from "@domain/repository/DepartamentRepository.ts";
import {Repository} from "@infrastructure/Repository.ts";
import {Departament} from "@domain/model/Departament.ts";
import {FastifyInstance} from "fastify";

export class DepartamentRepositoryImp extends Repository implements DepartamentRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: number): Promise<Departament> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_departament as id, name 
                FROM departaments
                WHERE id_departament = ${id}
            `;

            const res = await client.query(sql, [id])

            if(!res.rows.length){
                throw new Error("No existe este departamento");
            }

            return res.rows[0];
        });
    }

    public findAll = async (): Promise<Departament[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_departament as id, name 
                FROM departaments
            `;

            const res = await client.query(sql)
            return res.rows;
        });
    }

}
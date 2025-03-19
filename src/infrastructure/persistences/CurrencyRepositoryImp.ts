import { CurrencyRepository } from "@domain/repository/CurrencyRepository.ts";
import { Repository } from "@infrastructure/Repository.ts";
import { FastifyInstance } from "fastify";
import { Currency } from "@domain/model/Currency.ts";

export class CurrencyRepositoryImp extends Repository implements CurrencyRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public find = async (id: number): Promise<Currency> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_currency as id, name, description, iso, symbol
                FROM currencies
                WHERE id_currency = $1
            `;

            const res = await client.query(sql, [id]);

            if(!res.rows.length){
                throw new Error("No existe este currency");
            }

            return res.rows[0];
        });
    }

    public findAll = async (): Promise<Currency[]> =>  {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_currency as id, name, description, iso, symbol
                FROM currencies
            `;

            const res = await client.query(sql);
            return res.rows;
        });
    }


}
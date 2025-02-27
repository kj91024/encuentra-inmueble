import { FastifyInstance } from "fastify";
import { PoolClient } from "pg";

export class Repository {
    fastify: FastifyInstance;

    constructor (fastify: FastifyInstance){
        this.fastify = fastify;
    }

    protected async dbScope<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.fastify.pg.connect();
        try {
            return await callback(client); // Ejecuta la consulta con el cliente
        } finally {
            client.release(); // Libera automáticamente el cliente
        }
    }
}
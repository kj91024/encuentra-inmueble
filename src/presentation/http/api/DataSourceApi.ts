import { DataSourceUseCase } from "@application/usecases/DataSourceUseCase";
import { CreateDataSource } from "@domain/model/data_source/CreateDataSource";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class DataSourceApi {
    dataSourceUseCase: DataSourceUseCase;

    constructor(fastify: FastifyInstance){
        fastify.get('/api/data-source/find/:id',       this.find);
        fastify.delete('/api/data-source/delete/:id',  this.delete);
        fastify.post('/api/data-source/save',          this.save);
        fastify.get('/api/data-source/list',           this.list);

        this.dataSourceUseCase = new DataSourceUseCase(fastify);
    }

    private find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: bigint };
        const response = await this.dataSourceUseCase.find(id);
        return reply.success('Fuente de datos encontrado', response);
    }

    private save = async (request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as string;
        const data = JSON.parse(body) as CreateDataSource;
        await this.dataSourceUseCase.save(data);
        return reply.success('Fuente de datos agregado');
    }

    private list = async (request: FastifyRequest, reply: FastifyReply) => {
        const response = await this.dataSourceUseCase.list();
        return reply.success('Listado de fuentes de datos', response);
    }

    private delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: bigint};
        await this.dataSourceUseCase.remove(id);
        return reply.success('Fuente de datos eliminado');
    }
}
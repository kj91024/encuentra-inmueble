import { DataSourceUseCase } from "@application/usecases/DataSourceUseCase";
import { CreateDataSource } from "@domain/model/data_source/CreateDataSource";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {DataSourceMapper} from "@domain/mappers/DataSourceMapper.ts";

export class DataSourceApi {
    dataSourceUseCase: DataSourceUseCase;

    constructor(fastify: FastifyInstance){
        fastify.get('/api/data-source/find/:id',        this.find);
        fastify.delete('/api/data-source/delete/:id',   this.delete);
        fastify.post('/api/data-source/insert',         this.insert);
        fastify.put('/api/data-source/update',          this.update);
        fastify.get('/api/data-source/list',            this.list);

        this.dataSourceUseCase = new DataSourceUseCase(fastify);
    }

    private find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: number };
        const response = await this.dataSourceUseCase.find(id);
        const obj = DataSourceMapper.modelToObject(response);
        return reply.success('Fuente de datos encontrado', obj);
    }

    private insert = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreateDataSource;
        await this.dataSourceUseCase.insert(data);
        return reply.success('Fuente de datos agregado');
    }

    private update = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreateDataSource;

        if(!data.id){
            throw new Error("Debes definir el id");
        }

        await this.dataSourceUseCase.update(data);
        return reply.success('Fuente de datos agregado');
    }

    private list = async (request: FastifyRequest, reply: FastifyReply) => {
        const response = await this.dataSourceUseCase.list();
        const objs = response.map(model => DataSourceMapper.modelToObject(model));
        return reply.success('Listado de fuentes de datos', objs);
    }

    private delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: number};
        await this.dataSourceUseCase.remove(id);
        return reply.success('Fuente de datos eliminado');
    }
}
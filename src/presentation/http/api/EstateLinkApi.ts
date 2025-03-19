import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EstateLinkUseCase } from "@usecases/EstateLinkUseCase.ts";
import { FilterEstateLink } from "@domain/model/estate_link/FilterEstateLink.ts";
import {EstateScraperMapper} from "@domain/mappers/EstateScraperMapper.ts";
import {EstateLinkMapper} from "@domain/mappers/EstateLinkMapper.ts";

export class EstateLinkApi {
    estateLinkUseCase: EstateLinkUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.post('/api/estate-link/list', this.list);
        fastify.delete('/api/estate-link/delete/:id', this.delete);

        this.estateLinkUseCase = new EstateLinkUseCase(fastify);
    }

    public delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as {id: BigInt};
        await this.estateLinkUseCase.delete(id);
        return reply.success('Link de inmueble eliminado');
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        const filter = request.body as FilterEstateLink;
        const response = await this.estateLinkUseCase.findAll(filter);
        const objs = response.map(model => EstateLinkMapper.modelToObject(model));
        console.error(objs);
        return reply.success('Listado de links de inmuebles', objs);
    }
}
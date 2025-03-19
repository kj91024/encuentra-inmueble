import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {PropertyUseCase} from "@usecases/PropertyUseCase.ts";

export class PropertyApi {
    propertyUseCase: PropertyUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.get('/api/property/list', this.list);

        this.propertyUseCase = new PropertyUseCase(fastify);
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        const models = await this.propertyUseCase.findAll();
        return reply.success("list", models);
    }
}
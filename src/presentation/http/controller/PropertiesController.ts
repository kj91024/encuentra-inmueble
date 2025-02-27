import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class PropertiesController {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/properties', this.index);
    }

    private async index(request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Propiedades'
        };

        return reply.view('pages/properties.html', data);
    }
}
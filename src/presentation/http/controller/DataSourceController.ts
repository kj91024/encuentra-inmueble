import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class DataSourceController {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/data-sources', this.index);
        this.fastify.get('/data-source/:num', this.single);
    }

    private async index(request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Fuentes de datos'
        };

        return reply.view('pages/data-sources.html', data);
    }

    private async single(request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Fuente de datos'
        };

        return reply.view('pages/data-source.html', data);
    }
}
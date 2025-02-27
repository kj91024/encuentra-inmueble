import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class DivisesController {
    fastify: FastifyInstance;

    constructor (fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/divises', this.index);
    }

    private async index (request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Divisa'
        };
        return reply.view('pages/divises.html', data);
    }
}
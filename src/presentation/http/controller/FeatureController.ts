import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class FeatureController {
    fastify: FastifyInstance;

    constructor (fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/feature', this.index);
    }

    private async index (request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Características'
        };
        return reply.view('pages/feature.html', data);
    }
}
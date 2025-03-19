import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class EstatesController {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/estates', this.index);
        this.fastify.get('/estate/:id_estate', this.estate);
    }

    private async index (request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Inmuebles'
        };

        return reply.view('pages/estates.html', data);
    }

    private async estate (request: FastifyRequest, reply: FastifyReply) {
        const { id_estate } = request.params as {id_estate: BigInt};
        const data = {
            page_title: 'Inmueble',
            id_estate: id_estate
        };
        return reply.view('pages/estate.html', data);
    }
}
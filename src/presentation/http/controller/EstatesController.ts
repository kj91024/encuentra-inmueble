import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class EstatesController {
    fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/estates', this.index);
        this.fastify.get('/estate/:id', this.estate);
    }

    private async index (request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Inmuebles'
        };

        return reply.view('pages/estates.html', data);
    }

    private async estate (request: FastifyRequest, reply: FastifyReply) {
        const {id} = request.params as {id: bigint};
        const data = {
            page_title: 'Inmueble'
        };

        console.log(id);

        return reply.view('pages/estate.html', data);
    }
}
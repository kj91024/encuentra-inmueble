import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class MapController {
    fastify: FastifyInstance;
    
    constructor(fastify: FastifyInstance){
        this.fastify = fastify;
        this.fastify.get('/map', this.index);
    }

    private async index (request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Mapa'
        };

        return reply.view('pages/map.html', data);
    }
} 
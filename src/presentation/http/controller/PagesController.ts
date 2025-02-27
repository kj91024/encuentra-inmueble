import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class PagesController {
    fastify: FastifyInstance;

    constructor(fastify:FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/about', this.about);
    }

    private async about(request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Sobre nosotros'
        };

        return reply.view('pages/about.html', data);
    }
}
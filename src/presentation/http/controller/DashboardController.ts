import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class DashboardController {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify
        this.fastify.get('/', this.index);
    }

    private async index(request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Dashboard'
        };
        return reply.view('pages/dashboard.html', data);
    }
}
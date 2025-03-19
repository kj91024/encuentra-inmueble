import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class DashboardController {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify
        this.fastify.get('/', this.index);
    }

    private async index(request: FastifyRequest, reply: FastifyReply) {
        const cookies = request.cookies;

        console.error("ASD");
        console.error(cookies);

        if(cookies.user){
            const data = {
                page_title: 'Dashboard'
            };
            return reply.view('pages/dashboard.html', data);
        } else {
            const data = {
                page_title: 'Login'
            };
            return reply.view('login.html', data);
        }
    }
}
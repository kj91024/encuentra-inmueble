import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class SessionController {
    fastify: FastifyInstance;

    constructor (fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/login', this.login);
    }

    private async login(request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Iniciar sesión'
        };
        return reply.view("login.html", data);
    }
}
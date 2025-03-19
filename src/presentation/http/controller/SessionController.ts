import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class SessionController {
    fastify: FastifyInstance;

    constructor (fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/logout', this.logout);
    }

    private async logout(request: FastifyRequest, reply: FastifyReply) {
        return reply
            .clearCookie("user", { path: '/' })
            .redirect('/');
    }
}
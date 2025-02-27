import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class UsersController{
    fastify: FastifyInstance;

    constructor (fastify: FastifyInstance){
        this.fastify = fastify;
        this.fastify.get('/users', this.index);
    }

    private async index (request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Usuarios'
        };
        
        return reply.view('pages/users.html', data);
    }
}
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class OperationsController {
    fastify: FastifyInstance;
    
    constructor(fastify: FastifyInstance){
        this.fastify = fastify;
        this.fastify.get('/operations', this.index);
    }

    private async index (request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Operaciones'
        };

        return reply.view('pages/operations.html', data);
    }
}
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class ProjectsController {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance){
        this.fastify = fastify;
        this.fastify.get('/projects', this.index);
    }

    private async index (request: FastifyRequest, reply: FastifyReply) {
        const data = {
            page_title: 'Proyectos'
        };

        return reply.view('pages/projects.html', data);
    }
}
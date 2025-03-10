import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class EstateScraperApi {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance){
        this.fastify = fastify;

        this.fastify.get('/api/scraper/estate/find/:id',        this.find);
        this.fastify.delete('/api/scraper/estate/delete/:id',   this.delete);
        this.fastify.post('/api/scraper/estate/save',           this.save);
        this.fastify.get('/api/scraper/estate/list',            this.list);
    }
    
    private async find(request: FastifyRequest, reply: FastifyReply){
        console.log('find');

        return reply;
    }
    
    private async save(request: FastifyRequest, reply: FastifyReply){
        console.log('save');

        return reply;
    }

    private async list(request: FastifyRequest, reply: FastifyReply){
        console.log('list');

        return reply;
    }

    private async delete(request: FastifyRequest, reply: FastifyReply){
        console.log('delete');
        
        return reply;
    }
}
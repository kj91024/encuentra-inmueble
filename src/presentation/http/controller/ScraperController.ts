import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class ScraperController {
    fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.fastify.get('/scrapers', this.index);
        this.fastify.get('/scraper/:num', this.scraper);
    }

    private async index(request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Scrapers'
        };

        return reply.view('pages/scrapers.html', data);
    }

    private async scraper(request: FastifyRequest, reply: FastifyReply){
        const data = {
            page_title: 'Scraper'
        };

        return reply.view('pages/scraper.html', data);
    }
}
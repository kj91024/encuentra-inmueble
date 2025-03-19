import { EstateScraperUseCase } from "@application/usecases/EstateScraperUseCase";
import { CreateEstateScraper } from "@domain/model/estate_scraper/CreateEstateScraper";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {TestEstateScraper} from "@domain/model/estate_scraper/TestEstateScraper.ts";

export class EstateScraperApi {
    private estateScraperUseCase: EstateScraperUseCase;
    private estateScrapeSaveSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['id_data_source', 'file', 'user_agent'],
                properties: {
                    id_data_source: { type: 'number' },
                    file: { type: 'string' },
                    user_agent: { type: 'string' }
                }
            }
        }
    };

    private estateScraperTestSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['id_data_source', 'link'],
                properties: {
                    id_data_source: { type: 'number' },
                    link: { type: 'string' },
                }
            }
        }
    };

    constructor(fastify: FastifyInstance){
        fastify.get('/api/estate-scraper/find/:id_data_source', this.find);
        fastify.delete('/api/estate-scraper/delete/:id', this.delete);
        fastify.post('/api/estate-scraper/save', this.estateScrapeSaveSchema, this.save);
        fastify.get('/api/estate-scraper/process/:id_data_source', this.process);
        fastify.post('/api/estate-scraper/test', this.estateScraperTestSchema, this.test);

        this.estateScraperUseCase = new EstateScraperUseCase(fastify);
    }
    
    private find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_data_source } = request.params as { id_data_source: number};
        const response = await this.estateScraperUseCase.findByDataSource(id_data_source);
        return reply.success('Raspador de inmuebles encontrado', response);
    }

    private delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: number};
        await this.estateScraperUseCase.remove(id);
        return reply.success('Raspador de inmuebles eliminado');
    }

    private save = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreateEstateScraper;
        await this.estateScraperUseCase.save(data);
        return reply.success('Raspador de inmuebles guardado');
    }

    private test = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as TestEstateScraper;
        const response = await this.estateScraperUseCase.test(data);
        return reply.success('Raspador de inmuebles probado', response);
    }

    private process = async (request: FastifyRequest, reply: FastifyReply) => {
        const {id_data_source} = request.params as {id_data_source: number};
        const response = await this.estateScraperUseCase.process(id_data_source);
        return reply.success('Raspador de inmueble procesado', response);
    }
}
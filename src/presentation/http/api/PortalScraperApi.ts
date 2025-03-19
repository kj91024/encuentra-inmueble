import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PortalScraperUseCase } from "@usecases/PortalScraperUseCase.ts";
import {CreatePortalScraper} from "@domain/model/portal_scraper/CreatePortalScraper.ts";
import {DataSourceMapper} from "@domain/mappers/DataSourceMapper.ts";
import {PortalScraperMapper} from "@domain/mappers/PortalScraperMapper.ts";
import {SavePortalScraper} from "@domain/model/portal_scraper/SavePortalScraper.ts";
import {TestPortalScraper} from "@domain/model/portal_scraper/TestPortalScraper.ts";
import {ProcessPortalScraper} from "@domain/model/portal_scraper/ProcessPortalScraper.ts";

export class PortalScraperApi {
    private portalScraperUseCase: PortalScraperUseCase;

    private createPortalScraperSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['id_data_source', 'name', 'url_path'],
                properties: {
                    id_portal_scraper: {type: 'number'},
                    id_data_source: { type: 'number' },
                    name: { type: 'string' },
                    url_path: { type: 'string' }
                }
            }
        }
    };

    private portalScraperTestSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['id_data_source', 'id_portal_scraper', 'link'],
                properties: {
                    id_portal_scraper: { type: 'number' },
                    id_data_source: { type: 'number' },
                    link: { type: 'string' },
                }
            }
        }
    };


    private portalScraperProcessSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['id_data_source', 'id_portal_scraper'],
                properties: {
                    id_portal_scraper: { type: 'number' },
                    id_data_source: { type: 'number' }
                }
            }
        }
    };

    private portalScraperSaveScraperSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['id_portal_scraper', 'file'],
                properties: {
                    id_portal_scraper: { type: 'number' },
                    file: { type: 'string' },
                }
            }
        }
    };

    constructor(fastify: FastifyInstance){
        fastify.get('/api/portal-scraper/find/:id_portal_scraper', this.find);
        fastify.delete('/api/portal-scraper/delete/:id', this.delete);
        fastify.post('/api/portal-scraper/insert', this.createPortalScraperSchema, this.insert);
        fastify.put('/api/portal-scraper/update', this.createPortalScraperSchema, this.update);
        fastify.get('/api/portal-scraper/list/:id_data_source', this.list);
        fastify.post('/api/portal-scraper/process', this.portalScraperProcessSchema, this.process);
        fastify.post('/api/portal-scraper/test', this.portalScraperTestSchema, this.test);
        fastify.post('/api/portal-scraper/save-scraper', this.portalScraperSaveScraperSchema, this.saveScraper);

        this.portalScraperUseCase = new PortalScraperUseCase(fastify);
    }

    private find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_portal_scraper } = request.params as { id_portal_scraper: number };
        const response = await this.portalScraperUseCase.find(id_portal_scraper);
        return reply.success('Raspador de Portal encontrado', response);
    }

    private insert = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreatePortalScraper;
        await this.portalScraperUseCase.insert(data);
        return reply.success('Raspador de Portal agregado');
    }

    private update = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreatePortalScraper;
        console.error(data);

        if(!data.id_portal_scraper){
            throw new Error("Debes definir el id");
        }

        await this.portalScraperUseCase.update(data);
        return reply.success('Raspador de Portal actualizado');
    }

    private list = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_data_source } = request.params as {
            id_data_source: number
        };
        const response = await this.portalScraperUseCase.listByDataSource(id_data_source);
        return reply.success('Listado de Raspadores de Portales', response);
    }

    private delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: number};
        await this.portalScraperUseCase.remove(id);
        return reply.success('Raspador de Portal eliminado');
    }

    private saveScraper = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as SavePortalScraper;
        const response = await this.portalScraperUseCase.saveFile(data);
        return reply.success('Raspador de inmuebles probado', response);
    }

    private test = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as TestPortalScraper;
        const response = await this.portalScraperUseCase.test(data);
        return reply.success('Raspador de inmuebles probado', response);
    }

    private process = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as ProcessPortalScraper;
        const response = await this.portalScraperUseCase.process(data);
        return reply.success('Raspador de Portal eliminado', response);
    }
}
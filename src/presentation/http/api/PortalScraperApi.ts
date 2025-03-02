import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PortalScraperUseCase } from "@usecases/PortalScraperUseCase.ts";
import {CreatePortalScraper} from "@domain/model/portal_scraper/CreatePortalScraper.ts";

export class PortalScraperApi {
    portalScraperUseCase: PortalScraperUseCase;

    constructor(fastify: FastifyInstance){
        fastify.get('/api/scraper/portal/find/:id',             this.find);
        fastify.delete('/api/scraper/portal/delete/:id',        this.delete);
        fastify.post('/api/scraper/portal/save',                this.save);
        fastify.get('/api/scraper/portal/list/:id_data_source', this.list);

        this.portalScraperUseCase = new PortalScraperUseCase(fastify);
    }

    private find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id, id_data_source } = request.params as { id: bigint, id_data_source: bigint };
        const response = await this.portalScraperUseCase.findWithDataSource(id, id_data_source);
        return reply.success('Portal encontrado', response);
    }

    private save = async (request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as string;
        const data = JSON.parse(body) as CreatePortalScraper;
        await this.portalScraperUseCase.save(data);
        return reply.success('Portal agregado');
    }

    private list = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_data_source } = request.params as { id_data_source: bigint};
        const response = await this.portalScraperUseCase.listByDataSource(id_data_source);
        return reply.success('Listado de portales', response);
    }

    private delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: bigint};
        await this.portalScraperUseCase.remove(id);
        return reply.success('Portal eliminado');
    }
}
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EstateUseCase } from "@usecases/EstateUseCase.ts";
import { FilterEstate } from "@domain/model/estate/FilterEstate.ts";
import {EstateMapper} from "@domain/mappers/EstateMapper.ts";
import {DataSourceUseCase} from "@usecases/DataSourceUseCase.ts";

export class EstateApi {
    private estateUseCase: EstateUseCase;
    private dataSourceUseCase: DataSourceUseCase;
    private estateLink

    private estateSaveSchema = {
        schema: {
            body: {
                type: 'object',
                required: ['order', 'page', 'size'],
                properties: {
                    id_departament: {type: 'number'},
                    id_province: {type: 'number'},
                    id_district: {type: 'number'},

                    id_operation: {type: 'number'},
                    id_property: {type: 'number'},

                    id_currency: {type: 'number'},
                    min_price: {type: 'number'},
                    max_price: {type: 'number'},

                    min_floors: {type: 'number'},
                    max_floors: {type: 'number'},

                    min_bathrooms: {type: 'number'},
                    max_bathrooms: {type: 'number'},

                    min_area: {type: 'number'},
                    max_area: {type: 'number'}
                }
            }
        }
    };

    constructor (fastify: FastifyInstance) {
        fastify.post('/api/estate/list', this.estateSaveSchema, this.list);
        fastify.post('/api/estate/find-link', this.findLink);
        fastify.get('/api/estate/find/:id_estate', this.find);

        this.estateUseCase = new EstateUseCase(fastify);
        this.dataSourceUseCase = new DataSourceUseCase(fastify);
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        const filter = request.body as FilterEstate;
        const estates = await this.estateUseCase.findAll(filter);
        const list = estates.map(estate => EstateMapper.modelToObject(estate));
        return reply.success("list", list);
    }

    public find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_estate } = request.params;
        const estate = await this.estateUseCase.find(BigInt(id_estate));
        return reply.success("list", EstateMapper.modelToObject(estate));
    }

    public findLink = async (request: FastifyRequest, reply: FastifyReply) => {
        let { link } = request.body as { link: string };
        const data_sources = await this.dataSourceUseCase.list();
        data_sources.map(data_source => {
            link = link.replace(data_source.url_base, '');
        });

        const id_estate = await this.estateUseCase.findUrlPath(link);
        return reply.success("list", id_estate?.toString());
    }
}
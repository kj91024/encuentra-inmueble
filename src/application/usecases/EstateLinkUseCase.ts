import { FastifyInstance } from "fastify";
import { CreateEstateLink } from "@domain/model/estate_link/CreateEstateLink.ts";
import { FilterEstateLink } from "@domain/model/estate_link/FilterEstateLink.ts";
import {EstateLinkRepository} from "@domain/repository/EstateLinkRepository.ts";
import {EstateLinkRepositoryImp} from "@infrastructure/persistences/EstateLinkRepositoryImp.ts";
import {EstateLink} from "@domain/model/estate_link/EstateLink.ts";
import {EstateLinkEntity} from "@domain/entity/estate_link/EstateLinkEntity.ts";
import {EstateLinkMapper} from "@domain/mappers/EstateLinkMapper.ts";
import {DataSourceUseCase} from "@usecases/DataSourceUseCase.ts";

export class EstateLinkUseCase {
    private estateLinkRepository: EstateLinkRepository;
    private dataSourceUseCase:DataSourceUseCase;

    constructor(fastify: FastifyInstance) {
        this.estateLinkRepository = new EstateLinkRepositoryImp(fastify);
        this.dataSourceUseCase = new DataSourceUseCase(fastify);
    }

    public findByUrlAndIdDataSource = async (url_path: string, id_data_source: number): Promise<EstateLink | null> => {
        const entity = await this.estateLinkRepository.findByUrlAndIdDataSource(url_path, id_data_source);
        if(entity) {
            const dataSource = await this.dataSourceUseCase.find(entity.id_data_source);
            return EstateLinkMapper.entityToModel(entity, dataSource);
        }
        return null;
    };

    public insert = async (data: CreateEstateLink): Promise<BigInt> => {
        const model = await this.findByUrlAndIdDataSource(data.url_path, data.id_data_source);

        if(model){
            return model.id;
        } else {
            const entity: EstateLinkEntity = {
                id_data_source: data.id_data_source,
                url_path: data.url_path
            }
            return await this.estateLinkRepository.insert(entity);
        }
    }

    public delete = async (id: BigInt) => {
        await this.estateLinkRepository.delete(id);
    }

    public find = async (id: BigInt): Promise<EstateLink> => {
        const entity = await this.estateLinkRepository.find(id);
        const dataSource = await this.dataSourceUseCase.find(entity.id_data_source);
        return EstateLinkMapper.entityToModel(entity, dataSource);
    }

    public findAll = async (filter: FilterEstateLink): Promise<EstateLink[]> => {
        const dataSource = await this.dataSourceUseCase.find(filter.id_data_source);
        const entities = await this.estateLinkRepository.findAll(filter);
        return entities.map(entity => EstateLinkMapper.entityToModel(entity, dataSource));
    }

    public updateLastScraper = async (id_estate_link: BigInt): Promise<void> => {
        await this.estateLinkRepository.updateLastScraper(id_estate_link);
    }
}
import {FastifyInstance} from "fastify";
import {PortalScraper} from "@domain/model/portal_scraper/PortalScraper.ts";
import {CreatePortalScraper} from "@domain/model/portal_scraper/CreatePortalScraper.ts";
import {PortalScraperRepository} from "@domain/repository/PortalScraperRepository.ts";
import {PortalScraperRepositoryImp} from "@infrastructure/persistences/PortalScraperRepositoryImp.ts";
import { DataSourceUseCase } from "./DataSourceUseCase";

export class PortalScraperUseCase {
    portalScraperRepository: PortalScraperRepository;
    dataSourceUseCase: DataSourceUseCase;

    constructor (fastify: FastifyInstance) {
        this.portalScraperRepository = new PortalScraperRepositoryImp(fastify);
        this.dataSourceUseCase = new DataSourceUseCase(fastify);
    }

    public save = async (data: CreatePortalScraper): Promise<PortalScraper | void> => {
        return data.id ? this.update(data) : this.insert(data);
    }

    public insert = async (data: CreatePortalScraper): Promise<PortalScraper> => {
        let dataSource = await this.dataSourceUseCase.find(data.id_data_source);

        if(!dataSource){
            throw new Error("No existe la fuente de datos a la que quieres agregar el portal");
        }

        let portalScraper: PortalScraper = {
            data_source: dataSource,
            name: data.name,
            url_path: data.url_path
        };

        let id: bigint = await this.portalScraperRepository.insert(portalScraper);
        portalScraper.id = id;

        return portalScraper;
    }

    public update = async (data: CreatePortalScraper): Promise<void> => {
        let dataSource = await this.dataSourceUseCase.find(data.id_data_source);

        if(!dataSource){
            throw new Error("No existe la fuente de datos a la que quieres agregar el portal");
        }

        let portalScraper: PortalScraper = {
            id: data.id,
            data_source: dataSource,
            name: data.name,
            url_path: data.url_path
        };

        await this.portalScraperRepository.update(portalScraper);
    }

    public findWithDataSource = async (id: bigint, id_data_source: bigint): Promise<PortalScraper | null> => {
        const dataSource = await this.dataSourceUseCase.find(id_data_source);
        
        if(!dataSource){
            throw new Error("No existe la fuente de datos");
        }

        return await this.portalScraperRepository.find(id, dataSource);
    }
    public listByDataSource = async (id_data_source: bigint): Promise<PortalScraper[]> => {
        const dataSource = await this.dataSourceUseCase.find(id_data_source);
        
        if(!dataSource){
            throw new Error("No existe la fuente de datos");
        }

        return await this.portalScraperRepository.findAll(dataSource);
    }
    public remove = async (id: bigint): Promise<void> => {
        await this.portalScraperRepository.delete(id);
    }
}
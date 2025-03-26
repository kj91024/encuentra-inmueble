import { FastifyInstance } from "fastify";
import { PortalScraper } from "@domain/model/portal_scraper/PortalScraper.ts";
import { CreatePortalScraper } from "@domain/model/portal_scraper/CreatePortalScraper.ts";
import { PortalScraperRepository } from "@domain/repository/PortalScraperRepository.ts";
import { PortalScraperRepositoryImp } from "@infrastructure/persistences/PortalScraperRepositoryImp.ts";
import { DataSourceUseCase } from "./DataSourceUseCase";
import { PortalScraperEntity } from "@domain/entity/portal_scraper/PortalScraperEntity.ts";
import { PortalScraperMapper } from "@domain/mappers/PortalScraperMapper.ts";
import {EstateScraperResponse} from "@domain/model/estate_scraper/EstateScraperResponse.ts";
import {FilterEstateLink} from "@domain/model/estate_link/FilterEstateLink.ts";
import {EstateLinkUseCase} from "@usecases/EstateLinkUseCase.ts";
import {CreateEstateLink} from "@domain/model/estate_link/CreateEstateLink.ts";
import {SavePortalScraper} from "@domain/model/portal_scraper/SavePortalScraper.ts";
import {TestPortalScraper} from "@domain/model/portal_scraper/TestPortalScraper.ts";
import {RestService} from "@services/RestService.ts";
import {ProcessPortalScraper} from "@domain/model/portal_scraper/ProcessPortalScraper.ts";

export class PortalScraperUseCase {
    private portalScraperRepository: PortalScraperRepository;
    private estateLinkUseCase: EstateLinkUseCase;
    private dataSourceUseCase: DataSourceUseCase;
    private expandFunctions: string = `
        const fetchAll = async (endpoints) => {
            const responses = await Promise.all(endpoints.map(url => fetch(url)));
            return await Promise.all(responses.map(res => res.text()));
        }
        
        const unique = (array) => {
            return [...new Set(array)]
        }
        
        const separate = (texto, inicio, final) => {
            let temp = texto.split(inicio)[1];
            if (!temp) return ""; // Si no encuentra el inicio, retorna una cadena vacía
            return temp.split(final)[0];
        }
        
        const compress = (html) => {
            html = html.replace(/[\\n\\t]+/g, ' ').replace(/\\s{2,}/g, ' ');
            html = html.replaceAll('> <','><');
            return html;
        }
        
        globalThis.main = `;

    constructor (fastify: FastifyInstance) {
        this.portalScraperRepository = new PortalScraperRepositoryImp(fastify);
        this.dataSourceUseCase = new DataSourceUseCase(fastify);
        this.estateLinkUseCase = new EstateLinkUseCase(fastify);
    }

    public save = async (data: CreatePortalScraper): Promise<number | void> => {
        return data.id ? await this.update(data) : await this.insert(data);
    }

    public insert = async (data: CreatePortalScraper): Promise<number> => {
        if(await this.portalScraperRepository.existUrlPath(data.url_path, data.name)){
            throw new Error("Ya existe este raspador de portal");
        }

        let entity: PortalScraperEntity = {
            id_data_source: data.id_data_source,
            name: data.name,
            url_path: data.url_path
        };

        return await this.portalScraperRepository.insert(entity);
    }

    public update = async (data: CreatePortalScraper): Promise<void> => {
        if(await this.portalScraperRepository.existUrlPath(data.url_path, data.name)){
            throw new Error("Ya existe este raspador de portal");
        }

        let entity: PortalScraperEntity = {
            id_portal_scraper: data.id_portal_scraper,
            id_data_source: data.id_data_source,
            name: data.name,
            url_path: data.url_path
        };

        await this.portalScraperRepository.update(entity);
    }

    public find = async (id_portal_scraper: number): Promise<PortalScraper> => {
        const entity = await this.portalScraperRepository.find(id_portal_scraper);
        return PortalScraperMapper.entityToModel(entity);
    }

    public listByDataSource = async (id_data_source: number): Promise<PortalScraper[]> => {
        const entities = await this.portalScraperRepository.findAll(id_data_source);
        return entities.map(entity => PortalScraperMapper.entityToModel(entity));
    }

    public remove = async (id_portal_scraper: number): Promise<void> => {
        await this.portalScraperRepository.delete(id_portal_scraper);
    }

    public saveFile = async (data: SavePortalScraper) : Promise<void> => {
        await this.portalScraperRepository.saveFile(data.file, data.id_portal_scraper);
    }

    public test = async (data: TestPortalScraper): Promise<EstateScraperResponse> => {
        let output = '';

        const start = performance.now();

        let response = [];

        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            output += args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ") + "\n";
        };
        console.error = (...args) => {
            output += args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ") + "\n";
        };

        try {
            const entity = await this.portalScraperRepository.find(data.id_portal_scraper);
            const file = entity.file!.replace('const main = ', this.expandFunctions);
            eval(file ?? '');
            response = await main(data.link);
        } catch (error) {
            output += `Error: ${error.message} \n`
        }

        console.log = originalLog;
        console.error = originalError;

        const end = performance.now();
        const process_time = end - start;

        return {
            response: response,
            output: output.trim(),
            process_time: process_time
        };
    }

    public process = async (data: ProcessPortalScraper): Promise<EstateScraperResponse> => {
        const response = [];
        const data_source = await this.dataSourceUseCase.find(data.id_data_source);
        const models = await this.listByDataSource(data.id_data_source);

        // const start_process = performance.now();
        for (const model of models) {
            const start_scraper = performance.now();
            if(!model.file || model.file === '') {
                throw new Error(`Aún no tiene un scraper definido para ${model.name} en ${data_source.name}`);
            }

            let links = [];
            let link = `${data_source.url_base}${model.url_path}`;
            try {
                const file = model.file.replace('const main = ', this.expandFunctions);
                eval(file ?? '');
                links = await main(link);
            } catch (error) {
                throw new Error(`Algo ha ido mal en la ejecución del scraper ${model.name} en ${data_source.name} \n ${error.message}`);
            }

            const end_scraper = performance.now();
            const scraper_time = end_scraper - start_scraper;

            await Promise.all(links.map(link => {
                const create: CreateEstateLink = {
                    id_data_source: data_source.id!,
                    url_path: String(link).replace(data_source.url_base, '')
                };
                return this.estateLinkUseCase.insert(create);
            }));

            response.push({
                quantity_links: links.length,
                scraper_time: scraper_time
            });
        }
        // const end_process = performance.now();
        // const process_time = end_process - start_process;


        console.error(response);
        //return response;

    }
}
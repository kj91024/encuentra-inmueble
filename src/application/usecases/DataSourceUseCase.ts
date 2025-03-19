import { CreateDataSource } from "@domain/model/data_source/CreateDataSource";
import { DataSource } from "@domain/model/data_source/DataSource";
import { CreateThumbnail } from "@domain/model/thumbnail/CreateThumbnail";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";
import { DataSourceRepository } from "@domain/repository/DataSourceRepository";
import { DataSourceRepositoryImp } from "@infrastructure/persistences/DataSourceRepositoryImp";
import { FastifyInstance } from "fastify";
import { ThumbnailUseCase } from "./ThumbnailUseCase";
import { DataSourceEntity } from "@domain/entity/data_source/DataSourceEntity";
import { DataSourceRaw } from "@domain/entity/data_source/DataSourceRaw";
import { DataSourceMapper } from "@domain/mappers/DataSourceMapper";

export class DataSourceUseCase {
    private dataSourceRepository: DataSourceRepository;
    private thumbnailUseCase: ThumbnailUseCase;

    constructor(fastify: FastifyInstance) {
        this.dataSourceRepository = new DataSourceRepositoryImp(fastify);
        this.thumbnailUseCase = new ThumbnailUseCase(fastify);
    }

    public getDomain = (url: string): string => {
        try {
            return new URL(url).hostname;
        } catch (error) {
            throw new Error(`URL inválida: ${url}`);
        }
    }

    private existDomain = async (domain: string, name: string): Promise<boolean> => {
        return await this.dataSourceRepository.existDomain(domain, name);
    }

    public insert = async (data: CreateDataSource): Promise<number> => {
        const domain = this.getDomain(data.url_base);
        const url_base = `https://${domain}/`;

        if(await this.existDomain(domain, data.name)){
            throw new Error('Ya existe esta fuente de datos');
        }

        const createThumbnail: CreateThumbnail = {
            url: `https://external-content.duckduckgo.com/ip3/${domain}.ico`
        };

        const id_thumbnail = await this.thumbnailUseCase.insert(createThumbnail);

        const entity: DataSourceEntity = {
            id_thumbnail: id_thumbnail,
            name: data.name,
            description: data.description,
            domain: domain,
            url_base: url_base
        };
        
        return await this.dataSourceRepository.insert(entity);
    }

    public update = async (data: CreateDataSource): Promise<void> => {
        if(!data.id) {
            throw new Error("Falta el ID de la fuente de datos");
        }

        const domain = this.getDomain(data.url_base);
        const url_base = `https://${domain}/`;
        
        if(!await this.existDomain(domain, data.name)){
            throw new Error('No existe esta fuente de datos');
        }

        let raw = await this.dataSourceRepository.find(data.id);
        
        let createThumbnail: CreateThumbnail = {
            id: raw.id_thumbnail,
            url: `https://external-content.duckduckgo.com/ip3/${domain}.ico`
        }
        
        await this.thumbnailUseCase.update(createThumbnail);

        let entity: DataSourceEntity = {
            id_data_source: raw.id_data_source,
            id_thumbnail: raw.id_thumbnail,
            name: data.name,
            description: data.description,
            domain: domain,
            url_base: url_base
        }
        
        await this.dataSourceRepository.update(entity);
    }

    public remove = async (id: number): Promise<void> => {
        await this.dataSourceRepository.delete(id);
    }

    public list = async (): Promise<DataSource[]> => {
        let raws = await this.dataSourceRepository.findAll();
        return raws.map(raw => DataSourceMapper.rawToModel(raw));
        
    }

    public find = async (id: number): Promise<DataSource> => {
        let raw = await this.dataSourceRepository.find(id);
        return DataSourceMapper.rawToModel(raw);
    }
}
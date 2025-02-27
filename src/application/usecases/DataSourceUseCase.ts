import { CreateDataSource } from "@domain/model/data_source/CreateDataSource";
import { DataSource } from "@domain/model/data_source/DataSource";
import { CreateThumbnail } from "@domain/model/thumbnail/CreateThumbnail";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";
import { DataSourceRepository } from "@domain/repository/DataSourceRepository";
import { DataSourceRepositoryImp } from "@infrastructure/persistences/DataSourceRepositoryImp";
import { FastifyInstance } from "fastify";
import { ThumbnailUseCase } from "./ThumbnailUseCase";

export class DataSourceUseCase {
    fastify: FastifyInstance;
    dataSourceRepository: DataSourceRepository;
    thumbnailUseCase: ThumbnailUseCase;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.dataSourceRepository = new DataSourceRepositoryImp(this.fastify);
        this.thumbnailUseCase = new ThumbnailUseCase(this.fastify);
        
    }

    public find = async (id: bigint) => {
        const result = this.dataSourceRepository.find(id);
        return result;
    }

    public getDomain = (url: string): string => {
        try {
            const domain = new URL(url).hostname;
            return domain;
        } catch (error) {
            throw new Error(`URL inválida: ${url}`);
        }
    }

    public save = async (data: CreateDataSource): Promise<DataSource | void> => {
        data.id ? await this.update(data) : await this.insert(data);
    }

    private existDomain = async (domain: string): Promise<boolean> => {
        return this.dataSourceRepository.existDomain(domain);
    }

    public insert = async (data: CreateDataSource): Promise<DataSource> => {
        const domain = this.getDomain(data.url_base);
        
        if(await this.existDomain(domain)){
            throw new Error('Ya existe esta fuente de datos');
        }

        let createThumbnail: CreateThumbnail = {
            url: `https://${domain}/favicon.ico`
        };

        let thumbnail: Thumbnail = await this.thumbnailUseCase.insert(createThumbnail);

        let dataSource: DataSource = {
            thumbnail: thumbnail,
            name: data.name,
            description: data.description,
            domain: domain,
            url_base: data.url_base
        };
        
        let id = await this.dataSourceRepository.insert(dataSource);
        dataSource.id = id;

        return dataSource;
    }

    public update = async (data: CreateDataSource): Promise<void> => {
        if(!data.id){
            throw new Error("Falta el ID de la fuente de datos");
        }

        const domain = this.getDomain(data.url_base);

        let dataSource = await this.dataSourceRepository.find(data.id);
        
        if(!dataSource){
            throw new Error("Esta fuente de datos no existe");
        }
        
        dataSource.description = data.description;
        dataSource.domain = domain;
        dataSource.name = data.name;
        dataSource.url_base = data.url_base;

        let createThumbnail: CreateThumbnail = {
            id: dataSource.thumbnail.id,
            url: `https://${domain}/favicon.ico`
        }

        dataSource.thumbnail.url = createThumbnail.url;
        
        this.thumbnailUseCase.update(createThumbnail);
        this.dataSourceRepository.update(dataSource);
    }

    public remove = async (id: bigint): Promise<void> => {
        this.dataSourceRepository.delete(id);
    }

    public list = async (): Promise<DataSource[]> => {
        return await this.dataSourceRepository.findAll();
    }
}
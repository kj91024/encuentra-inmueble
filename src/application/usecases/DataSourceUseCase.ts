import { CreateDataSource } from "@domain/model/data_source/CreateDataSource";
import { DataSource } from "@domain/model/data_source/DataSource";
import { CreateThumbnail } from "@domain/model/thumbnail/CreateThumbnail";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";
import { DataSourceRepository } from "@domain/repository/DataSourceRepository";
import { DataSourceRepositoryImp } from "@infrastructure/persistences/DataSourceRepositoryImp";
import { FastifyInstance } from "fastify";
import { ThumbnailUseCase } from "./ThumbnailUseCase";

export class DataSourceUseCase {
    dataSourceRepository: DataSourceRepository;
    thumbnailUseCase: ThumbnailUseCase;

    constructor(fastify: FastifyInstance) {
        this.dataSourceRepository = new DataSourceRepositoryImp(fastify);
        this.thumbnailUseCase = new ThumbnailUseCase(fastify);
    }

    public find = async (id: bigint) => {
        return this.dataSourceRepository.find(id);
    }

    public getDomain = (url: string): string => {
        try {
            return new URL(url).hostname;
        } catch (error) {
            throw new Error(`URL inválida: ${url}`);
        }
    }

    public save = async (data: CreateDataSource): Promise<DataSource | void> => {
        return data.id ? await this.update(data) : await this.insert(data);
    }

    private existDomain = async (domain: string, name: string): Promise<boolean> => {
        return await this.dataSourceRepository.existDomain(domain, name);
    }

    public insert = async (data: CreateDataSource): Promise<DataSource> => {
        const domain = this.getDomain(data.url_base);
        const url_base = `https://${domain}/`;

        if(await this.existDomain(domain, data.name)){
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
            url_base: url_base
        };
        
        dataSource.id = await this.dataSourceRepository.insert(dataSource);

        return dataSource;
    }

    public update = async (data: CreateDataSource): Promise<void> => {
        if(!data.id){
            throw new Error("Falta el ID de la fuente de datos");
        }

        const domain = this.getDomain(data.url_base);
        const url_base = `https://${domain}/`;
        
        if(await this.existDomain(domain, data.name)){
            throw new Error('Ya existe esta fuente de datos');
        }

        let dataSource = await this.dataSourceRepository.find(data.id);
        
        if(!dataSource){
            throw new Error("Esta fuente de datos no existe");
        }
        
        dataSource.description = data.description;
        dataSource.domain = domain;
        dataSource.name = data.name;
        dataSource.url_base = url_base;

        let createThumbnail: CreateThumbnail = {
            id: dataSource.thumbnail.id,
            url: `https://${domain}/favicon.ico`
        }

        dataSource.thumbnail.url = createThumbnail.url;
        
        await this.thumbnailUseCase.update(createThumbnail);
        await this.dataSourceRepository.update(dataSource);
    }

    public remove = async (id: bigint): Promise<void> => {
        await this.dataSourceRepository.delete(id);
    }

    public list = async (): Promise<DataSource[]> => {
        return await this.dataSourceRepository.findAll();
    }
}
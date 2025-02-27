import { CreateThumbnail } from "@domain/model/thumbnail/CreateThumbnail";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";
import { ThumbnailRepository } from "@domain/repository/ThumbnailRepository";
import { ThumbnailRepositoryImp } from "@infrastructure/persistences/ThumbnailRepositoryImp";
import { FastifyInstance } from "fastify";

export class ThumbnailUseCase {
    fastify: FastifyInstance;
    thumbnailRepository: ThumbnailRepository; 

    constructor(fastify: FastifyInstance){
        this.fastify = fastify;
        this.thumbnailRepository = new ThumbnailRepositoryImp(this.fastify);
    }

    public save = async (data: CreateThumbnail): Promise<Thumbnail | void> => {
        return data.id ? this.update(data) : this.insert(data);
    }

    public insert = async (data: CreateThumbnail): Promise<Thumbnail> => {
        let thumbnail: Thumbnail = {
            url: data.url
        };
        
        let id: bigint = await this.thumbnailRepository.insert(thumbnail);
        thumbnail.id = id;

        return thumbnail;
    }

    public update = async (data: CreateThumbnail): Promise<void> => {
        let thumbnail: Thumbnail = {
            id: data.id,
            url: data.url
        };

        this.thumbnailRepository.update(thumbnail);
    }

    public find = async (id: bigint): Promise<Thumbnail | null> => {
        return null;
    }
}
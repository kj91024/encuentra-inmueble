import { ThumbnailEntity } from "@domain/entity/thumbnail/ThumbnailEntity";
import { ThumbnailMapper } from "@domain/mappers/ThumbnailMapper";
import { CreateThumbnail } from "@domain/model/thumbnail/CreateThumbnail";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";
import { ThumbnailRepository } from "@domain/repository/ThumbnailRepository";
import { ThumbnailRepositoryImp } from "@infrastructure/persistences/ThumbnailRepositoryImp";
import { FastifyInstance } from "fastify";
import {RelationThumbnailEstateUseCase} from "@usecases/RelationThumbnailEstateUseCase.ts";

export class ThumbnailUseCase {
    private thumbnailRepository: ThumbnailRepository;
    private relationThumbnailEstateUseCase: RelationThumbnailEstateUseCase;

    constructor(fastify: FastifyInstance){
        this.thumbnailRepository = new ThumbnailRepositoryImp(fastify);
        this.relationThumbnailEstateUseCase = new RelationThumbnailEstateUseCase(fastify);
    }

    public findByUrl = async (url: String): Promise<Thumbnail | null> => {
        const raw = await this.thumbnailRepository.findByUrl(url);
        return raw !== null ? ThumbnailMapper.rawToModel(raw) : null;
    }

    public save = async (data: CreateThumbnail): Promise<BigInt> => {
        const model = await this.findByUrl(data.url);
        return model ? model.id : this.insert(data);
    }

    private insert = async (data: CreateThumbnail): Promise<BigInt> => {
        const entity: ThumbnailEntity = {
            url: data.url
        };
        
        return await this.thumbnailRepository.insert(entity);
    }

    public insertGalleryEstate = async (id_estate: BigInt, data: CreateThumbnail): Promise<BigInt> => {
        const id = await this.save(data);

        const createRelationThumbnailEstate = {
            id_thumbnail: id,
            id_estate: id_estate
        }

        return await this.relationThumbnailEstateUseCase.insert(createRelationThumbnailEstate);
    }

    public update = async (data: CreateThumbnail): Promise<void> => {
        let entity: ThumbnailEntity = {
            id_thumbnail: data.id,
            url: data.url
        };

        await this.thumbnailRepository.update(entity);
    }

    public find = async (id_thumbnail: BigInt): Promise<Thumbnail> => {
        const raw = await this.thumbnailRepository.find(id_thumbnail);
        return ThumbnailMapper.rawToModel(raw);
    }

    public findAllByEstate = async (id_estate: BigInt): Promise<Thumbnail[]> => {
        const raws = await this.thumbnailRepository.findAllByEstate(id_estate);
        return raws.map(raw => ThumbnailMapper.rawToModel(raw));
    }
}
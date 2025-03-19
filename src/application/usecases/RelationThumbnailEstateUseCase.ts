import { FastifyInstance } from "fastify";
import { RelationThumbnailEstateRepositoryImp } from "@infrastructure/persistences/RelationThumbnailEstateRepositoryImp.ts";
import { RelationThumbnailEstateRepository } from "@domain/repository/RelationThumbnailEstateRepository.ts";
import {CreateRelationThumbnailEstate} from "@domain/model/relation_thumbnail_estate/CreateRelationThumbnailEstate.ts";
import {RelationThumbnailEstateEntity} from "@domain/entity/RelationThumbnailEstateEntity.ts";

export class RelationThumbnailEstateUseCase {
    private relationThumbnailEstateRepository: RelationThumbnailEstateRepository;

    constructor(fastify: FastifyInstance) {
        this.relationThumbnailEstateRepository = new RelationThumbnailEstateRepositoryImp(fastify);
    }
    public insert = async (data: CreateRelationThumbnailEstate): Promise<BigInt> => {
        const entity: RelationThumbnailEstateEntity = {
            id_thumbnail: data.id_thumbnail,
            id_estate: data.id_estate
        }

        return await this.relationThumbnailEstateRepository.insert(entity);
    }
}
import {RelationThumbnailEstateEntity} from "@domain/entity/RelationThumbnailEstateEntity.ts";

export interface RelationThumbnailEstateRepository {
    insert(data: RelationThumbnailEstateEntity): Promise<BigInt>;
}
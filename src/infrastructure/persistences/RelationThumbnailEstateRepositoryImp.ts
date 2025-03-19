import {Repository} from "@infrastructure/Repository.ts";
import {RelationThumbnailEstateRepository} from "@domain/repository/RelationThumbnailEstateRepository.ts";
import {RelationThumbnailEstateEntity} from "@domain/entity/RelationThumbnailEstateEntity.ts";
import {FastifyInstance} from "fastify";

export class RelationThumbnailEstateRepositoryImp extends Repository implements RelationThumbnailEstateRepository{
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public insert = async (data: RelationThumbnailEstateEntity): Promise<BigInt> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO relation_thumbnail_estates (id_thumbnail, id_estate, added_at)
                VALUES($1, $2, $3)
                RETURNING id_relation_thumbnail_estate
            `;

            const res = await client.query(sql, [
                data.id_thumbnail.toString(),
                data.id_estate.toString(),
                data.added_at ?? new Date
            ]);

            return BigInt(res.rows[0].id_relation_thumbnail_estate);
        });
    }

}
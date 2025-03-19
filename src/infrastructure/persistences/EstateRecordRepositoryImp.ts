import { Repository } from "@infrastructure/Repository.ts";
import { EstateRecordRepository } from "@domain/repository/EstateRecordRepository.ts";
import {EstateRecordRaw} from "@domain/entity/estate_record/EstateRecordRaw.ts";
import {EstateRecordEntity} from "@domain/entity/estate_record/EstateRecordEntity.ts";
import {FastifyInstance} from "fastify";

export class EstateRecordRepositoryImp extends Repository implements EstateRecordRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public insert = async (data: EstateRecordEntity): Promise<BigInt> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO estate_records (id_operation, id_property, id_currency, id_data_source, description, floors, bathrooms, rooms, price, area, extracted_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id_estate_record
            `;

            const res = await client.query(sql, [
                data.id_operation,
                data.id_property,
                data.id_currency,
                data.id_data_source,
                data.description,
                data.floors,
                data.bathrooms,
                data.rooms,
                data.price,
                data.area,
                data.extracted_at ?? new Date()
            ]);
            return BigInt(res.rows[0].id_estate_record);
        });
    }

    public updateEstate = async (id: BigInt, id_estate: BigInt): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE estate_records
                SET id_estate = $1
                WHERE id_estate_record = $2
            `;

            await client.query(sql, [id_estate, id]);
        });
    }

    public findAllByEstate = async (id_estate: BigInt): Promise<EstateRecordRaw[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT estate_records.id_estate_record, estate_records.description, estate_records.floors, estate_records.bathrooms, estate_records.rooms, estate_records.price, estate_records.area, estate_records.extracted_at,
                    operations.id_operation, operations.name AS operation_name, operations.description AS operation_description,
                    properties.id_property, properties.name AS property_name, properties.description AS property_description,
                    currencies.id_currency, currencies.name AS currency_name, currencies.description AS currency_description, currencies.iso, currencies.symbol,
                    data_sources.id_data_source, data_sources.name AS data_source_name, data_sources.description AS data_source_description, data_sources.url_base, data_sources.domain,
                    thumbnails.id_thumbnail, thumbnails.url AS thumbnail_url
                FROM estate_records
                JOIN operations ON estate_records.id_operation = operations.id_operation
                JOIN properties ON estate_records.id_property = properties.id_property
                JOIN currencies ON estate_records.id_currency = currencies.id_currency
                JOIN data_sources ON estate_records.id_data_source = data_sources.id_data_source
                JOIN thumbnails ON data_sources.id_thumbnail = thumbnails.id_thumbnail
                WHERE id_estate = $1
            `;

            const res = await client.query(sql, [id_estate]);
            return res.rows;
        });
    }
}
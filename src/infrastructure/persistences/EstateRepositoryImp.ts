import { EstateRepository } from "@domain/repository/EstateRepository.ts";
import { Repository } from "@infrastructure/Repository.ts";
import { EstateRaw } from "@domain/entity/estate/EstateRaw.ts";
import { FilterEstate } from "@domain/model/estate/FilterEstate.ts";
import { EstateEntity } from "@domain/entity/estate/EstateEntity.ts";
import { FastifyInstance } from "fastify";

export class EstateRepositoryImp extends Repository implements EstateRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    private convertToBigInt = (raw) => {
        raw.id_estate = BigInt(raw.id_estate);
        raw.id_estate_link = BigInt(raw.id_estate_link);
        raw.data_source_id_thumbnail = BigInt(raw.data_source_id_thumbnail);
        raw.owner_id_thumbnail = BigInt(raw.owner_id_thumbnail);
        raw.estate_id_thumbnail = BigInt(raw.estate_id_thumbnail);
        raw.id_gps = BigInt(raw.id_gps);
        raw.id_estate_record = BigInt(raw.id_estate_record);
        return raw;
    }

    public find = async (id: BigInt): Promise<EstateRaw> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT estates.id_estate, estates.id_estate_record, estates.address, estates.created_at, estates.updated_at,
                    estates.description, estates.floors, estates.bathrooms, estates.rooms, estates.price, estates.area, estates.extracted_at,
                    estates.operation_name, estates.operation_description,
                    estates.property_name, estates.property_description,
                    estates.currency_name, estates.currency_description, estates.iso, estates.symbol,
                       
                    data_sources.id_data_source, data_sources.name AS data_source_name, data_sources.description AS data_source_description, data_sources.domain, data_sources.url_base,
                    estate_links.id_estate_link, estate_links.url_path,
                    owners.id_owner, owners.name AS owner_name, owners.cellphone, owners.url_source,
                    departaments.id_departament, departaments.name AS departament_name,
                    provinces.id_province, provinces.name AS province_name,
                    districts.id_district, districts.name AS district_name,
                    gps.id_gps, gps.latitude, gps.longitude, gps.address as gps_address,  
                    thumbnail_data_source.id_thumbnail AS data_source_id_thumbnail, thumbnail_data_source.url AS data_source_url_thumbnail,
                    thumbnail_owner.id_thumbnail AS owner_id_thumbnail, thumbnail_owner.url AS owner_url_thumbnail,
                    thumbnail_estate.id_thumbnail AS estate_id_thumbnail, thumbnail_estate.url AS estate_url_thumbnail
                FROM (
                    SELECT estates.id_estate, estates.id_estate_record, estates.id_thumbnail, estates.id_data_source, estates.id_owner, estates.id_estate_link, estates.id_departament, estates.id_province, estates.id_district, estates.id_gps,
                        estates.address, estates.created_at, estates.updated_at,
                        
                        estate_records.description, estate_records.floors, estate_records.bathrooms, estate_records.rooms, estate_records.price, estate_records.area, estate_records.extracted_at,
                        operations.name AS operation_name, operations.description AS operation_description, 
                        properties.name AS property_name, properties.description AS property_description,
                        currencies.name AS currency_name, currencies.description AS currency_description, currencies.iso, currencies.symbol
                    FROM (
                        SELECT estates.id_estate, estates.id_thumbnail, estates.id_estate_record, estates.id_data_source, estates.id_owner, estates.id_estate_link, estates.id_departament, estates.id_province, estates.id_district, estates.id_gps,
                            estates.address, estates.created_at, estates.updated_at
                        FROM estates
                        WHERE estates.id_estate = $1
                    ) AS estates
                    JOIN estate_records ON estates.id_estate_record = estate_records.id_estate_record
                    JOIN operations ON operations.id_operation = estate_records.id_operation
                    JOIN properties ON properties.id_property = estate_records.id_property
                    JOIN currencies ON currencies.id_currency = estate_records.id_currency
                ) as estates
                JOIN data_sources ON data_sources.id_data_source = estates.id_data_source
                JOIN owners ON owners.id_owner = estates.id_owner
                JOIN estate_links ON estate_links.id_estate_link = estates.id_estate_link
                JOIN departaments ON departaments.id_departament = estates.id_departament
                JOIN provinces ON provinces.id_province = estates.id_province
                JOIN districts ON districts.id_district = estates.id_district
                JOIN gps ON gps.id_gps = estates.id_gps
                JOIN thumbnails AS thumbnail_estate ON thumbnail_estate.id_thumbnail = estates.id_thumbnail
                JOIN thumbnails AS thumbnail_data_source ON thumbnail_data_source.id_thumbnail = data_sources.id_thumbnail
                JOIN thumbnails AS thumbnail_owner ON thumbnail_owner.id_thumbnail = owners.id_thumbnail
            `;

            const res = await client.query(sql, [id]);
            const raw = res.rows[0];
            return this.convertToBigInt(raw);
        });
    }

    public findAll = async (filter: FilterEstate): Promise<EstateRaw[]> => {
        return await this.dbScope(async (client) => {
            let pos = 1;
            let params = [];
            let conditions = [];
            let ranges = [];

            // Función para agregar filtros de igualdad
            const addFilterCondition = (field, value, st = true) => {
                if (value !== undefined && value !== 0) {
                    st ? conditions.push(`${field} = $${pos++}`) : ranges.push(`${field} = $${pos++}`);
                    params.push(value);
                }
            };

            // Agregar filtros de ubicación
            addFilterCondition("id_departament", filter.id_departament);
            addFilterCondition("id_province", filter.id_province);
            addFilterCondition("id_district", filter.id_district);

            // Agregar filtros de tipo de propiedad/operación
            addFilterCondition("operations.id_operation", filter.id_operation, false);
            addFilterCondition("properties.id_property", filter.id_property, false);
            addFilterCondition("currencies.id_currency", filter.id_currency, false);

            // Agregar filtros tipo BETWEEN (rango de valores)
            const addRangeCondition = (field, min, max) => {
                if (min !== undefined && max !== undefined) {
                    ranges.push(`${field} BETWEEN $${pos++} AND $${pos++}`);
                    params.push(min, max);
                } else if (min !== undefined) {
                    ranges.push(`${field} <= $${pos++}`);
                    params.push(min);
                } else if (max !== undefined) {
                    ranges.push(`${field} >= $${pos++}`);
                    params.push(max);
                }
            };

            addRangeCondition("estate_records.price", filter.min_price, filter.max_price);
            addRangeCondition("estate_records.floors", filter.min_floors, filter.max_floors);
            addRangeCondition("estate_records.bathrooms", filter.min_bathrooms, filter.max_bathrooms);
            addRangeCondition("estate_records.rooms", filter.min_rooms, filter.max_rooms);
            addRangeCondition("estate_records.area", filter.min_area, filter.max_area);

            // Construcción del WHERE dinámico
            const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
            // Construcción del WHERE dinámico
            const whereRange = ranges.length > 0 ? "WHERE " + ranges.join(" AND ") : "";

            // Opciones de ordenamiento
            const orderOptions = {
                1: "ORDER BY estates.price DESC",
                2: "ORDER BY estates.price ASC",
                3: "ORDER BY estates.extracted_at DESC",
                4: "ORDER BY estates.extracted_at ASC"
            };
            const order = orderOptions[filter.order] || "";

            // Paginación
            const pagination = `LIMIT ${filter.size} OFFSET ${filter.page * filter.size}`;

            // Consulta SQL final
            const sql = `
                SELECT estates.id_estate, estates.id_estate_record, estates.address, estates.created_at, estates.updated_at,
                       estates.description, estates.floors, estates.bathrooms, estates.rooms, estates.price, estates.area, estates.extracted_at,
                       estates.operation_name, estates.operation_description,
                       estates.property_name, estates.property_description,
                       estates.currency_name, estates.currency_description, estates.iso, estates.symbol,
                       data_sources.id_data_source, data_sources.name AS data_source_name, data_sources.description AS data_source_description, 
                       data_sources.domain, data_sources.url_base,
                       estate_links.id_estate_link, estate_links.url_path,
                       owners.id_owner, owners.name AS owner_name, owners.cellphone, owners.url_source,
                       departaments.id_departament, departaments.name AS departament_name,
                       provinces.id_province, provinces.name AS province_name,
                       districts.id_district, districts.name AS district_name,
                       gps.id_gps, gps.latitude, gps.longitude, gps.address as gps_address,
                       thumbnail_data_source.id_thumbnail AS data_source_id_thumbnail, thumbnail_data_source.url AS data_source_url_thumbnail,
                       thumbnail_owner.id_thumbnail AS owner_id_thumbnail, thumbnail_owner.url AS owner_url_thumbnail,
                       thumbnail_estate.id_thumbnail AS estate_id_thumbnail, thumbnail_estate.url AS estate_url_thumbnail
                FROM (
                    SELECT estates.id_estate, estates.id_estate_record, estates.id_thumbnail, estates.id_data_source, estates.id_owner, estates.id_estate_link, 
                           estates.id_departament, estates.id_province, estates.id_district, estates.id_gps,
                           estates.address, estates.created_at, estates.updated_at,
                           estate_records.description, estate_records.floors, estate_records.bathrooms, estate_records.rooms, 
                           estate_records.price, estate_records.area, estate_records.extracted_at,
                           operations.name AS operation_name, operations.description AS operation_description,
                           properties.name AS property_name, properties.description AS property_description,
                           currencies.name AS currency_name, currencies.description AS currency_description, currencies.iso, currencies.symbol
                    FROM (
                        SELECT estates.id_estate, estates.id_thumbnail, estates.id_estate_record, estates.id_data_source, estates.id_gps,
                               estates.id_owner, estates.id_estate_link, estates.id_departament, estates.id_province, estates.id_district,
                               estates.address, estates.created_at, estates.updated_at
                        FROM estates
                        ${whereClause}
                    ) AS estates
                    JOIN estate_records ON estates.id_estate_record = estate_records.id_estate_record
                    JOIN operations ON operations.id_operation = estate_records.id_operation
                    JOIN properties ON properties.id_property = estate_records.id_property
                    JOIN currencies ON currencies.id_currency = estate_records.id_currency
                    ${whereRange}
                ) as estates
                JOIN data_sources ON data_sources.id_data_source = estates.id_data_source
                JOIN owners ON owners.id_owner = estates.id_owner
                JOIN estate_links ON estate_links.id_estate_link = estates.id_estate_link
                JOIN departaments ON departaments.id_departament = estates.id_departament
                JOIN provinces ON provinces.id_province = estates.id_province
                JOIN districts ON districts.id_district = estates.id_district
                JOIN gps ON estates.id_gps = gps.id_gps
                JOIN thumbnails AS thumbnail_estate ON thumbnail_estate.id_thumbnail = estates.id_thumbnail
                JOIN thumbnails AS thumbnail_data_source ON thumbnail_data_source.id_thumbnail = data_sources.id_thumbnail
                JOIN thumbnails AS thumbnail_owner ON thumbnail_owner.id_thumbnail = owners.id_thumbnail
                ${order}
                ${pagination}
            `;

            // Ejecutar consulta
            const res = await client.query(sql, params);
            const raws = res.rows;

            // Convertir IDs grandes a BigInt
            raws.forEach(raw => this.convertToBigInt(raw));

            return raws;
        });
    }

    public insert = async (data: EstateEntity): Promise<BigInt> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO estates (id_data_source, id_estate_record, id_thumbnail, id_estate_link, id_owner, id_departament, id_province, id_district, id_gps, address, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id_estate
            `;

            const params = [
                data.id_data_source,
                data.id_estate_record.toString(),
                data.id_thumbnail.toString(),
                data.id_estate_link.toString(),
                data.id_owner,
                data.id_departament,
                data.id_province,
                data.id_district,
                data.id_gps,
                data.address,
                data.created_at ?? new Date(),
                data.updated_at ?? new Date(),
            ];

            const res = await client.query(sql, params);

            return BigInt(res.rows[0].id_estate);
        });
    }

    public update = async (data: EstateEntity): Promise<void> => {
        return await this.dbScope(async (client) => {
            if(!data.id_estate){
                throw new Error('No id for estate found.');
            }

            const sql = `
                UPDATE estates
                SET id_data_source = $1, id_estate_record = $2, id_thumbnail = $3, id_estate_link = $4, id_owner = $5, id_departament = $6, id_province = $7, id_district = $8, id_gps = $9, title = $10, address = $11, updated_at = $12
                WHERE id_estate = $13
            `
            await client.query(sql, [
                data.id_data_source,
                data.id_estate_record.toString(),
                data.id_thumbnail.toString(),
                data.id_estate_link.toString(),
                data.id_owner,
                data.id_departament,
                data.id_province,
                data.id_district,
                data.id_gps,
                data.title,
                data.address,
                data.created_at ?? new Date(),
                data.id_estate.toString(),
            ]);
        });
    }

    public findByIdEstateLink = async (id_estate_link: BigInt): Promise<BigInt | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT estates.id_estate
                FROM estates
                WHERE estates.id_estate_link = $1
            `;

            const res = await client.query(sql, [id_estate_link]);

            if (!res.rows || res.rows.length === 0) {
                return null;
            }

            return BigInt(res.rows[0].id_estate);
        });
    }

    public findUrlPath = async (url_path: string): Promise<BigInt | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT estates.id_estate
                FROM estates
                JOIN estate_links ON estates.id_estate_link = estate_links.id_estate_link
                WHERE estate_links.url_path = $1
            `;

            const res = await client.query(sql, [ url_path ]);

            if (!res.rows || res.rows.length === 0) {
                return null;
            }
            return BigInt(res.rows[0].id_estate);
        });
    }
}
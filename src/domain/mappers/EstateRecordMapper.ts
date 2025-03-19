import {EstateRecordRaw} from "@domain/entity/estate_record/EstateRecordRaw.ts";
import {EstateRecord} from "@domain/model/estate_record/EstateRecord.ts";
import {DataSource} from "@domain/model/data_source/DataSource.ts";
import {Currency} from "@domain/model/Currency.ts";
import {Property} from "@domain/model/Property.ts";
import {Operation} from "@domain/model/Operation.ts";
import {Thumbnail} from "@domain/model/thumbnail/Thumbnail.ts";
import {DataSourceMapper} from "@domain/mappers/DataSourceMapper.ts";

export class EstateRecordMapper {
    public static rawToModel = (raw: EstateRecordRaw): EstateRecord => {
        const operation: Operation = {
            id: raw.id_operation,
            name: raw.operation_name,
            description: raw.operation_description
        };

        const property: Property = {
            id: raw.id_property,
            name: raw.property_name,
            description: raw.property_description
        };

        const currency: Currency = {
            id: raw.id_currency,
            name: raw.currency_name,
            description: raw.currency_description,
            iso: raw.iso,
            symbol: raw.symbol
        };

        const thumbnail: Thumbnail = {
            id: BigInt(raw.id_thumbnail),
            url: raw.thumbnail_url
        }

        const data_source: DataSource = {
            id: raw.id_data_source,
            thumbnail: thumbnail,
            name: raw.data_source_name,
            description: raw.data_source_description,
            url_base: raw.url_base,
            domain: raw.domain
        };

        return {
            id: BigInt(raw.id_estate_record),
            operation: operation,
            property: property,
            currency: currency,
            data_source: data_source,
            description: raw.description,
            floors: raw.floors,
            bathrooms: raw.bathrooms,
            rooms: raw.rooms,
            price: raw.price,
            area: raw.area,
            extracted_at: raw.extracted_at
        }
    }

    public static modelToObject = (model: EstateRecord): Object => {
        return {
            ...model,
            id: model.id.toString(),
            data_source: DataSourceMapper.modelToObject(model.data_source),
        };
    };
}
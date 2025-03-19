import {EstateRaw} from "@domain/entity/estate/EstateRaw.ts";
import {Estate} from "@domain/model/estate/Estate.ts";
import {DataSource} from "@domain/model/data_source/DataSource.ts";
import {Thumbnail} from "@domain/model/thumbnail/Thumbnail.ts";
import {Owner} from "@domain/model/owner/Owner.ts";
import {Departament} from "@domain/model/Departament.ts";
import {Province} from "@domain/model/Province.ts";
import {District} from "@domain/model/District.ts";
import {EstateRecord} from "@domain/model/estate_record/EstateRecord.ts";
import {Gps} from "@domain/model/gps/Gps.ts";
import {Property} from "@domain/model/Property.ts";
import {Currency} from "@domain/model/Currency.ts";
import {Operation} from "@domain/model/Operation.ts";
import {ThumbnailMapper} from "@domain/mappers/ThumbnailMapper.ts";
import {DataSourceMapper} from "@domain/mappers/DataSourceMapper.ts";
import {EstateRecordMapper} from "@domain/mappers/EstateRecordMapper.ts";
import {GpsMapper} from "@domain/mappers/GpsMapper.ts";
import {OwnerMapper} from "@domain/mappers/OwnerMapper.ts";

export class EstateMapper {
    public static rawToModel = (raw: EstateRaw): Estate => {
        const data_source_thumbnail: Thumbnail = {
            id: raw.data_source_id_thumbnail,
            url: raw.data_source_url_thumbnail
        };

        const data_source: DataSource = {
            id: raw.id_data_source,
            thumbnail: data_source_thumbnail,
            name: raw.data_source_name,
            description: raw.data_source_description,
            url_base: raw.url_base,
            domain: raw.domain
        }

        const owner_thumbnail = {
            id: raw.owner_id_thumbnail,
            url: raw.owner_url_thumbnail
        }

        const owner: Owner = {
            id_owner: raw.id_owner,
            thumbnail: owner_thumbnail,
            name: raw.owner_name,
            cellphone: raw.cellphone,
            url_source: raw.url_source
        }

         const departament: Departament = {
             id: raw.id_departament,
             name: raw.departament_name,
        }

        const province: Province = {
            id: raw.id_province,
            name: raw.province_name,
        }

        const district: District = {
            id: raw.id_district,
            name: raw.district_name,
        }

        const operation: Operation = {
            id: raw.id_operation,
            name: raw.operation_name,
            description: raw.operation_description
        }

        const property: Property = {
            id: raw.id_property,
            name: raw.property_name,
            description: raw.property_description
        }

        const currency: Currency = {
            id: raw.id_currency,
            name: raw.currency_name,
            description: raw.currency_description,
            iso: raw.iso,
            symbol: raw.symbol
        }

        const estateRecord: EstateRecord = {
            id: raw.id_estate_record,
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

        const gps: Gps = {
            id: raw.id_gps,
            lat: raw.latitude,
            lng: raw.longitude,
            address: raw.gps_address,
        }

        const thumbnail: Thumbnail = {
            id: raw.estate_id_thumbnail,
            url: raw.estate_url_thumbnail,
        }

        return {
            id: raw.id_estate,
            data_source: data_source,

            thumbnails: [thumbnail],

            owner: owner,

            departament: departament,
            province: province,
            district: district,

            info: estateRecord,

            gps: gps,

            url_source: raw.url_source,
            address: raw.address,

            created_at: raw.created_at
        }
    }


    public static modelToObject = (model: Estate): Object => {
        return {
            ...model,
            id: model.id.toString(),
            owner: OwnerMapper.modelToObject(model.owner),
            data_source: DataSourceMapper.modelToObject(model.data_source),
            thumbnails: model.thumbnails.map(thumbnail => ThumbnailMapper.modelToObject(thumbnail)),
            info: EstateRecordMapper.modelToObject(model.info),
            gps: GpsMapper.modelToObject(model.gps),
        };
    };
}
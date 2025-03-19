import {Departament} from "@domain/model/Departament.ts";

export interface EstateRaw {
    id_estate: BigInt,
    id_estate_record: BigInt,
    created_at: Date,
    updated_at: Date,
    description: string,
    floors: number,
    bathrooms: number,
    rooms: number,
    price: number,
    area: number,
    extracted_at: Date,
    id_operation: number,
    operation_name: string,
    operation_description: string,
    id_property: number,
    property_name: string,
    property_description: string,
    id_currency: number,
    currency_name: string,
    currency_description: string,
    iso: string,
    symbol: string,
    address: string,

    estate_id_thumbnail: BigInt,
    estate_url_thumbnail: string,

    id_data_source: number,
    data_source_name: string,
    data_source_description: string,
    domain: string,
    url_base: string,

    id_estate_link: BigInt,
    url_path: string,

    id_owner: number,
    owner_name: string,
    cellphone: string,
    url_source: string,

    id_gps: BigInt,
    latitude: number,
    longitude: number,
    gps_address: string,

    id_departament: number,
    departament_name: string,

    id_province: number,
    province_name: string,

    id_district: number,
    district_name: string,

    data_source_id_thumbnail: BigInt,
    data_source_url_thumbnail: string,

    owner_id_thumbnail: BigInt,
    owner_url_thumbnail: string
}
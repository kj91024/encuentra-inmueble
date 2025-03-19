export interface EstateRecordRaw {
    id_estate_record: BigInt,
    description: string,
    floors: number,
    bathrooms: number,
    rooms: number,
    price: number,
    area: number,

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

    id_thumbnail: BigInt;
    thumbnail_url: string;

    id_data_source: number;
    data_source_name: string;
    data_source_description: string;
    url_base: string;
    domain: string;

    extracted_at: Date
}
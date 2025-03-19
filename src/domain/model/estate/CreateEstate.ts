export interface CreateEstate {
    id_estate?: BigInt;
    id_departament: number,
    id_province: number,
    id_district: number,
    id_data_source: number,
    id_estate_link: BigInt,
    url_source: string,
    address: string,

    latitude: number,
    longitude: number,
    gps_address: string

    thumbnail_url: string,
    gallery: string[],

    id_operation: number,
    id_property: number,
    id_currency: number,
    description: string,
    floors: number,
    bathrooms: number,
    rooms: number,
    price: number,
    area: number,

    owner_name: string,
    owner_cellphone: string,
    owner_url_source: string,
    owner_url_thumbnail: string
}
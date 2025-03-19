export class ProcessEstateScraper {
    id_data_source: number;

    address: string;
    latitude: number;
    longitude: number;
    gps_address: string;
    ubigeo: number;

    thumbnail_url: string;
    gallery: string[];

    id_operation: number;
    id_currency: number;
    id_property: number;

    description: string;
    bathrooms: number;
    rooms: number;
    floors: number;
    price: number;
    area: number;
    source: string;

    owner_name: string;
    owner_cellphone: string;
    owner_url_source: string;
    owner_url_thumbnail: string;
}
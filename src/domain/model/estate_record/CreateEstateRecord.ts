export interface CreateEstateRecord {
    id?: BigInt;
    id_operation: number;
    id_property: number;
    id_currency: number;
    id_data_source: number;
    description: string;
    floors: number;
    bathrooms: number;
    rooms: number;
    price: number;
    area: number;

}
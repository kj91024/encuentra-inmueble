export interface EstateEntity {
    id_estate?: BigInt;
    id_estate_record: BigInt;
    id_thumbnail: BigInt;
    id_data_source: number;
    id_estate_link: BigInt;

    id_owner: number;

    id_departament: number;
    id_province: number;
    id_district: number;

    id_gps: BigInt;

    url_source: string;
    address: string;

    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
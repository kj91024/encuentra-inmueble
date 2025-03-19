export interface EstateLinkEntity {
    id_estate_link?: BigInt;
    id_data_source: number;
    url_path: string;
    added_at?: Date;
    deleted_at?: Date;
    last_scraped?: Date;
}
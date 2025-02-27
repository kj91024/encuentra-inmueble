export interface DataSourceEntity {
    id_data_source?: bigint;
    id_thumbnail: bigint;
    name: string;
    description: string;
    url_base: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
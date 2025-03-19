import { DataSource } from "@domain/model/data_source/DataSource.ts";

export interface EstateLink {
    id: BigInt;
    data_source: DataSource;
    url_path: string;
    added_at?: Date;
    deleted_at?: Date;
    last_scraper?: Date;
}
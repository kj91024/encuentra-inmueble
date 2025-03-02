import { DataSource } from "@domain/model/data_source/DataSource.ts";

export interface PortalScraper {
    id?: bigint;
    data_source: DataSource;
    name: string;
    url_path: string;
    user_agent?: string;
    cron_time?: number;
    max_attempts?: number;
    file?: string;
    created_at?: Date;
    updated_at?: Date;
}
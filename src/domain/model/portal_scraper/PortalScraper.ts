import { DataSource } from "@domain/model/data_source/DataSource.ts";

export interface PortalScraper {
    id?: number;
    name: string;
    url_path: string;
    user_agent?: string;
    cron_time?: number;
    max_attempts?: number;
    file?: string;
    created_at?: Date;
    updated_at?: Date;
    last_scraped?: Date;
}
import { DataSource } from "@domain/model/data_source/DataSource";
import {PortalScraper} from "@domain/model/portal_scraper/PortalScraper.ts";

export interface PortalScraperRepository {
    insert(data: PortalScraper): Promise<bigint>;
    update(data: PortalScraper): Promise<void>;
    find(id: bigint, data_source: DataSource): Promise<PortalScraper | null>;
    findAll(data_source: DataSource): Promise<PortalScraper[]>;
    delete(id: bigint): Promise<void>;
    existUrlPath(url_path: string, name: string): Promise<boolean>;
}
import { PortalScraperEntity } from "@domain/entity/portal_scraper/PortalScraperEntity.ts";
import { DataSource } from "@domain/model/data_source/DataSource";
import { PortalScraper } from "@domain/model/portal_scraper/PortalScraper.ts";
import {PortalScraperRaw} from "@domain/entity/portal_scraper/PortalScraperRaw.ts";

export interface PortalScraperRepository {
    insert(data: PortalScraperEntity): Promise<number>;
    update(data: PortalScraperEntity): Promise<void>;

    find(id_data_source: number): Promise<PortalScraperEntity>;
    findAll(id_data_source: number): Promise<PortalScraperEntity[]>;
    delete(id: number): Promise<void>;
    existUrlPath(url_path: string, name: string): Promise<boolean>;
    saveFile(file: string, id_portal_scraper: number): Promise<void>;
}
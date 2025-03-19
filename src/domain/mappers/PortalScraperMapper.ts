import { DataSource } from "@domain/model/data_source/DataSource.ts";
import { PortalScraperEntity } from "@domain/entity/portal_scraper/PortalScraperEntity.ts";
import { PortalScraper } from "@domain/model/portal_scraper/PortalScraper.ts";
import {ThumbnailMapper} from "@domain/mappers/ThumbnailMapper.ts";
import {DataSourceMapper} from "@domain/mappers/DataSourceMapper.ts";

export class PortalScraperMapper {
    public static entityToModel = (entity: PortalScraperEntity): PortalScraper => {
        return {
            id: entity.id_portal_scraper!,
            name: entity.name,
            url_path: entity.url_path,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            file: entity.file,
            last_scraped: entity.last_scraped
        };
    }
}
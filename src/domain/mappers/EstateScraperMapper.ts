import {DataSource} from "@domain/model/data_source/DataSource.ts";
import {EstateScraperEntity} from "@domain/entity/estate_scraper/EstateScraperEntity.ts";
import {EstateScraper} from "@domain/model/estate_scraper/EstateScraper.ts";
import {PortalScraper} from "@domain/model/portal_scraper/PortalScraper.ts";
import {DataSourceMapper} from "@domain/mappers/DataSourceMapper.ts";

export class EstateScraperMapper {
    public static entityToModel = (entity: EstateScraperEntity): EstateScraper => {
        return {
            id: entity.id_estate_scraper!,
            user_agent: entity.user_agent,
            file: entity.file,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
            last_scraped: entity.last_scraped
        }
    }
}
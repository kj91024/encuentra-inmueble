import { DataSource } from "@domain/model/data_source/DataSource.ts";
import { EstateLinkEntity } from "@domain/entity/estate_link/EstateLinkEntity.ts";
import { EstateLink } from "@domain/model/estate_link/EstateLink.ts";
import { DataSourceMapper } from "@domain/mappers/DataSourceMapper.ts";

export class EstateLinkMapper {
    public static entityToModel = (entity: EstateLinkEntity, data_source: DataSource): EstateLink => {
        return {
            id: BigInt(entity.id_estate_link!),
            data_source: data_source,
            url_path: entity.url_path,
            added_at: entity.added_at,
            deleted_at: entity.deleted_at,
            last_scraper: entity.last_scraped,
        }
    }

    public static modelToObject = (model: EstateLink): Object => {
        return {
            ...model,
            id: model.id.toString(),
            data_source: DataSourceMapper.modelToObject(model.data_source),
        };
    };
}
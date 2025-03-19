import {EstateLinkEntity} from "@domain/entity/estate_link/EstateLinkEntity.ts";
import {FilterEstateLink} from "@domain/model/estate_link/FilterEstateLink.ts";

export interface EstateLinkRepository {
    insert(data: EstateLinkEntity): Promise<BigInt>;
    find(id: BigInt): Promise<EstateLinkEntity>;
    findAll(filter: FilterEstateLink): Promise<EstateLinkEntity[]>;
    delete(id: BigInt): Promise<void>;
    existUrlPath(url_path: string): Promise<boolean>;
    findByUrlAndIdDataSource(url_path: string, id_data_source: number): Promise<EstateLinkEntity | null>;
    updateLastScraper(id_estate_link: BigInt): Promise<void>;
}
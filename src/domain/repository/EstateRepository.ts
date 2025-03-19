import {FilterEstate} from "@domain/model/estate/FilterEstate.ts";
import {EstateRaw} from "@domain/entity/estate/EstateRaw.ts";
import {EstateEntity} from "@domain/entity/estate/EstateEntity.ts";

export interface EstateRepository {
    insert(data: EstateEntity): Promise<BigInt>;
    update(data: EstateEntity): Promise<void>;

    find(id: BigInt): Promise<EstateRaw>;
    findAll(filter: FilterEstate): Promise<EstateRaw[]>;
    findByIdEstateLink(id_estate_link: BigInt): Promise<BigInt | null>;
    findUrlPath(url_path: string): Promise<BigInt | null>;
}
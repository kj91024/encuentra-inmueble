import {Owner} from "@domain/model/owner/Owner.ts";
import {OwnerEntity} from "@domain/entity/owner/OwnerEntity.ts";
import {OwnerRaw} from "@domain/entity/owner/OwnerRaw.ts";

export interface OwnerRepository {
    insert(data: OwnerEntity): Promise<number>;
    update(data: OwnerEntity): Promise<void>;
    find(id: number): Promise<OwnerRaw>;
    findByUrlSource(url_source: string): Promise<OwnerRaw | null>;
}
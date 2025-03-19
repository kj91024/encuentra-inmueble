import { ThumbnailEntity } from "@domain/entity/thumbnail/ThumbnailEntity";
import { ThumbnailRaw } from "@domain/entity/thumbnail/ThumbnailRaw";

export interface ThumbnailRepository {
    insert(data: ThumbnailEntity): Promise<BigInt>;
    update(data: ThumbnailEntity): Promise<void>;

    find(id: BigInt): Promise<ThumbnailRaw>;
    findByUrl(url: string): Promise<ThumbnailRaw | null>;
    findAll(): Promise<ThumbnailRaw[]>;
    findAllByEstate(id_estate: BigInt): Promise<ThumbnailRaw[]>;
    delete(id: BigInt): Promise<void>;
}
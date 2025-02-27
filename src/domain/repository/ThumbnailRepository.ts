import { Thumbnail } from "@domain/model/thumbnail/Thumbnail";

export interface ThumbnailRepository {
    insert(data: Thumbnail): Promise<bigint>;
    update(data: Thumbnail): Promise<void>;
    find(id: bigint): Promise<Thumbnail | null>;
    findAll(): Promise<Thumbnail[]>;
    delete(id: bigint): Promise<void>;
}
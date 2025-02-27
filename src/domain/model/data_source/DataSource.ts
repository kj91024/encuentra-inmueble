import { Thumbnail } from "../thumbnail/Thumbnail";

export interface DataSource {
    id?: bigint;
    thumbnail: Thumbnail;
    name: string;
    description: string;
    url_base: string;
    domain: string;
    created_at?: Date;
    updated_at?: Date;
}
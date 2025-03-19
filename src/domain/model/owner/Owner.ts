import {Thumbnail} from "@domain/model/thumbnail/Thumbnail.ts";

export interface Owner {
    id_owner: number;
    thumbnail: Thumbnail;
    name: string;
    cellphone: string;
    url_source: string;
}
import {OwnerRaw} from "@domain/entity/owner/OwnerRaw.ts";
import {Owner} from "@domain/model/owner/Owner.ts";
import {Thumbnail} from "@domain/model/thumbnail/Thumbnail.ts";
import {Gps} from "@domain/model/gps/Gps.ts";
import {ThumbnailMapper} from "@domain/mappers/ThumbnailMapper.ts";

export class OwnerMapper {
    public static rawToModel = (raw: OwnerRaw): Owner => {
        const thumbnail: Thumbnail = {
            id: raw.id_thumbnail,
            url: raw.thumbnail_url
        };

        return {
            id_owner: raw.id_owner,
            thumbnail: thumbnail,
            name: raw.name,
            cellphone: raw.cellphone,
            url_source: raw.url_source
        }
    }

    public static modelToObject = (model: Owner) => {
        return {
            ...model,
            thumbnail: ThumbnailMapper.modelToObject(model.thumbnail),
        };
    }
}
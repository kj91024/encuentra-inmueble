import {Gps} from "@domain/model/gps/Gps.ts";

export class GpsMapper {
    public static modelToObject = (model: Gps) => {
        return {
            ...model,
            id: model.id.toString(),
        };
    }
}
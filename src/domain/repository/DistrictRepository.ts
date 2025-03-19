import {District} from "@domain/model/District.ts";
import {IdsLocation} from "@domain/entity/IdsLocation.ts";

export interface DistrictRepository {
    find(id: number): Promise<District>;
    findAll(id_departament: number, id_province: number): Promise<District[]>;
    findByLonLat(lon: number, lat: number): Promise<IdsLocation | null>;
    findByUbigeo(ubigeo: number): Promise<IdsLocation | null>;
}
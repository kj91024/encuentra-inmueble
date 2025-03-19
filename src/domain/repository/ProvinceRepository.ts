import {Province} from "@domain/model/Province.ts";

export interface ProvinceRepository {
    find(id: number): Promise<Province>
    findAll(id_departament: number): Promise<Province[]>
}
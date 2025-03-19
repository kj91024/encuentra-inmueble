import {Departament} from "@domain/model/Departament.ts";

export interface DepartamentRepository {
    find(id: number): Promise<Departament>
    findAll(): Promise<Departament[]>
}
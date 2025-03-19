import {Property} from "@domain/model/Property.ts";

export interface PropertyRepository {
    findAll(): Promise<Property[]>;
    find(id: number): Promise<Property>;
}
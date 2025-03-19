import { Operation } from "@domain/model/Operation.ts";

export interface OperationRepository {
    find(id: number):Promise<Operation>;
    findAll(): Promise<Operation[]>;
}
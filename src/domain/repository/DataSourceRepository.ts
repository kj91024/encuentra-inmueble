import { DataSourceEntity } from "@domain/entity/data_source/DataSourceEntity";
import { DataSourceRaw } from "@domain/entity/data_source/DataSourceRaw";

export interface DataSourceRepository {
    insert(data: DataSourceEntity): Promise<number>;
    update(data: DataSourceEntity): Promise<void>;

    find(id: number): Promise<DataSourceRaw>;
    findAll(): Promise<DataSourceRaw[]>;
    delete(id: number): Promise<void>;
    existDomain(domain: string, name: string): Promise<boolean>;
}
import { CreateDataSource } from "@domain/model/data_source/CreateDataSource";
import { DataSource } from "@domain/model/data_source/DataSource";

export interface DataSourceRepository {
    insert(data: DataSource): Promise<bigint>;
    update(data: DataSource): Promise<void>;
    find(id: bigint): Promise<DataSource | null>;
    findAll(): Promise<DataSource[]>;
    delete(id: bigint): Promise<void>;
    existDomain(domain: string): Promise<boolean>;
}
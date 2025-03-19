import {Gps} from "@domain/model/gps/Gps.ts";
import {GpsEntity} from "@domain/entity/GpsEntity.ts";

export interface GpsRepository {
    insert(data: GpsEntity): Promise<BigInt>;
    update(data: GpsEntity): Promise<void>;

    find(id: BigInt): Promise<Gps>;
    findAll(ids: BigInt[]): Promise<Gps[]>;
}
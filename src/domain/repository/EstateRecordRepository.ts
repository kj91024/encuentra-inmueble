import {EstateRecord} from "@domain/model/estate_record/EstateRecord.ts";
import {EstateRecordEntity} from "@domain/entity/estate_record/EstateRecordEntity.ts";
import {EstateRecordRaw} from "@domain/entity/estate_record/EstateRecordRaw.ts";

export interface EstateRecordRepository {
    insert(data: EstateRecordEntity): Promise<BigInt>;
    updateEstate(id: BigInt, id_estate: BigInt): Promise<void>;
    findAllByEstate(id_estate: BigInt): Promise<EstateRecordRaw[]>;
}
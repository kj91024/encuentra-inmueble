import { DataSource } from "@domain/model/data_source/DataSource.ts";
import { Gps } from "@domain/model/gps/Gps.ts";
import { Owner } from "@domain/model/owner/Owner.ts";
import { Departament } from "@domain/model/Departament.ts";
import { Province } from "@domain/model/Province.ts";
import { District } from "@domain/model/District.ts";
import { Thumbnail } from "@domain/model/thumbnail/Thumbnail.ts";
import { EstateRecord } from "@domain/model/estate_record/EstateRecord.ts";

export interface Estate {
    id: BigInt;
    data_source: DataSource;

    thumbnails: Thumbnail[];

    owner: Owner;

    departament: Departament;
    province: Province;
    district: District;

    info: EstateRecord;

    gps: Gps;

    url_source: string;
    address: string;

    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
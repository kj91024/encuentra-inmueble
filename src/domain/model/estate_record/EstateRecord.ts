import { Operation } from "@domain/model/Operation.ts";
import { Property } from "@domain/model/Property.ts";
import { Currency } from "@domain/model/Currency.ts";
import {DataSource} from "@domain/model/data_source/DataSource.ts";

export interface EstateRecord {
    id: BigInt;
    operation: Operation;
    property: Property;
    currency: Currency;
    data_source: DataSource;
    description: string;

    floors: number;
    bathrooms: number;
    rooms: number;
    price: number;
    area: number;

    extracted_at: Date;
}
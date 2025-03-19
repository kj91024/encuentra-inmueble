import { Currency } from "@domain/model/Currency.ts";

export interface CurrencyRepository {
    find(id: number): Promise<Currency>;
    findAll(): Promise<Currency[]>;
}
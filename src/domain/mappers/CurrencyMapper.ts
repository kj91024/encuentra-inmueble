import { CurrencyEntity } from "@domain/entity/CurrencyEntity.ts";
import { Currency } from "@domain/model/Currency.ts";

export class CurrencyMapper {
    public static modelToObject = (model: Currency): Object => {
        return {
            ...model,
            id: model.id.toString(),
        };
    };
}
import {FastifyInstance} from "fastify";
import {Currency} from "@domain/model/Currency.ts";
import {CurrencyRepository} from "@domain/repository/CurrencyRepository.ts";
import {CurrencyRepositoryImp} from "@infrastructure/persistences/CurrencyRepositoryImp.ts";

export class CurrencyUseCase {
    private currencyRepository: CurrencyRepository;

    constructor(fastify: FastifyInstance) {
        this.currencyRepository = new CurrencyRepositoryImp(fastify);
    }

    public find = async (id: number): Promise<Currency> => {
        return await this.currencyRepository.find(id);
    }

    public findAll = async (): Promise<Currency[]> => {
        return await this.currencyRepository.findAll();
    }
}
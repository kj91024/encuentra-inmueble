import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {CurrencyUseCase} from "@usecases/CurrencyUseCase.ts";

export class CurrencyApi {
    private currencyUseCase: CurrencyUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.get('/api/currency/list', this.list);

        this.currencyUseCase = new CurrencyUseCase(fastify);
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        const currencies = await this.currencyUseCase.findAll();
        return reply.success("list", currencies);
    }
}
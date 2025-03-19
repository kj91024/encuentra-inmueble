import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {OperationUseCase} from "@usecases/OperationUseCase.ts";

export class OperationApi {
    operationUseCase: OperationUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.get('/api/operation/list', this.list);

        this.operationUseCase = new OperationUseCase(fastify);
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        const operations = await this.operationUseCase.findAll();
        return reply.success("list", operations);
    }
}
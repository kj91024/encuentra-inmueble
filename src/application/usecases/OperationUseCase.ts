import {FastifyInstance} from "fastify";
import {OperationRepository} from "@domain/repository/OperationRepository.ts";
import {OperationRepositoryImp} from "@infrastructure/persistences/OperationRepositoryImp.ts";
import {Operation} from "@domain/model/Operation.ts";

export class OperationUseCase {
    private operationRepository: OperationRepository;

    constructor(fastify: FastifyInstance) {
        this.operationRepository = new OperationRepositoryImp(fastify);
    }

    public find = async (id: number): Promise<Operation> => {
        return await this.operationRepository.find(id);
    }

    public findAll = async (): Promise<Operation[]> => {
        return await this.operationRepository.findAll();
    }
}
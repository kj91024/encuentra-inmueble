import {DepartamentRepository} from "@domain/repository/DepartamentRepository.ts";
import {DepartamentRepositoryImp} from "@infrastructure/persistences/DepartamentRepositoryImp.ts";
import {FastifyInstance} from "fastify";
import {Departament} from "@domain/model/Departament.ts";

export class DepartamentUseCase {
    private departamentRepository: DepartamentRepository;

    constructor (fastify: FastifyInstance) {
        this.departamentRepository = new DepartamentRepositoryImp(fastify);
    }

    public find = async (id: number): Promise<Departament> => {
        return await this.departamentRepository.find(id);
    }

    public findAll = async (): Promise<Departament[]> => {
        return await this.departamentRepository.findAll();
    }
}
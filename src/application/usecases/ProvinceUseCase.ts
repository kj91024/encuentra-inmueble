import {FastifyInstance} from "fastify";
import {ProvinceRepository} from "@domain/repository/ProvinceRepository.ts";
import {ProvinceRepositoryImp} from "@infrastructure/persistences/ProvinceRepositoryImp.ts";
import {Province} from "@domain/model/Province.ts";

export class ProvinceUseCase {
    private provinceRepository: ProvinceRepository;

    constructor(fastify: FastifyInstance) {
        this.provinceRepository = new ProvinceRepositoryImp(fastify);
    }

    public find = async (id: number): Promise<Province> => {
        return await this.provinceRepository.find(id);
    }

    public findAll = async (id_departament: number): Promise<Province[]> => {
        return await this.provinceRepository.findAll(id_departament);
    }
}
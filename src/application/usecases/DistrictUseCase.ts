import {District} from "@domain/model/District.ts";
import {DistrictRepository} from "@domain/repository/DistrictRepository.ts";
import {FastifyInstance} from "fastify";
import {DistrictRepositoryImp} from "@infrastructure/persistences/DistrictRepositoryImp.ts";
import {IdsLocation} from "@domain/entity/IdsLocation.ts";

export class DistrictUseCase {
    private districtRepository: DistrictRepository;

    constructor(fastify: FastifyInstance) {
        this.districtRepository = new DistrictRepositoryImp(fastify);
    }

    public find = async (id: number): Promise<District> => {
        return this.districtRepository.find(id);
    }

    public findAll = async (id_departament: number, id_province: number): Promise<District[]> => {
        return this.districtRepository.findAll(id_departament, id_province);
    }

    public findByLonLat = async (lon: number, lat: number): Promise<IdsLocation | null> => {
        return this.districtRepository.findByLonLat(lon, lat);
    }

    public findByUbigeo = async (ubigeo: number): Promise<IdsLocation | null> => {
        return this.districtRepository.findByUbigeo(ubigeo);
    }
}
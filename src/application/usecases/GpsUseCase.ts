import {FastifyInstance} from "fastify";
import {CreateGps} from "@domain/model/gps/CreateGps.ts";
import {Gps} from "@domain/model/gps/Gps.ts";
import {GpsRepository} from "@domain/repository/GpsRepository.ts";
import {GpsRepositoryImp} from "@infrastructure/persistences/GpsRepositoryImp.ts";
import {GpsEntity} from "@domain/entity/GpsEntity.ts";

export class GpsUseCase {
    private gpsRepository: GpsRepository;

    constructor(fastify: FastifyInstance) {
        this.gpsRepository = new GpsRepositoryImp(fastify);
    }

    public insert = async (data: CreateGps): Promise<BigInt> => {
        let entity: GpsEntity = {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address
        };

        return await this.gpsRepository.insert(entity);
    }

    public update = async (data: CreateGps): Promise<void> => {
        if(!data.id){
            throw new Error("Debes definir el id");
        }

        let entity: GpsEntity = {
            id_gps: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address
        };

        await this.gpsRepository.update(entity);
    }

    public find = async (id: BigInt): Promise<Gps> => {
        return this.gpsRepository.find(id);
    }

    public findAll = async (ids: BigInt[]): Promise<Gps[]> => {
        return this.gpsRepository.findAll(ids);
    }
}
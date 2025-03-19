import { FastifyInstance } from "fastify";
import { CreateEstateRecord } from "@domain/model/estate_record/CreateEstateRecord.ts";
import { EstateRecordRepositoryImp } from "@infrastructure/persistences/EstateRecordRepositoryImp.ts";
import { EstateRecordRepository } from "@domain/repository/EstateRecordRepository.ts";
import { EstateRecord} from "@domain/model/estate_record/EstateRecord.ts";
import { EstateRecordMapper } from "@domain/mappers/EstateRecordMapper.ts";

export class EstateRecordUseCase {
    private estateRecordRepository: EstateRecordRepository;

    constructor(fastify: FastifyInstance) {
        this.estateRecordRepository = new EstateRecordRepositoryImp(fastify);
    }

    public insert = async (data: CreateEstateRecord): Promise<BigInt> => {
        let entity = {
            id_operation: data.id_operation,
            id_property: data.id_property,
            id_currency: data.id_currency,
            id_data_source: data.id_data_source,

            description: data.description,
            floors: data.floors,
            bathrooms: data.bathrooms,
            rooms: data.rooms,
            price: data.price,
            area: data.area
        };

        return await this.estateRecordRepository.insert(entity);
    }

    public updateEstate = async (id_estate_record: BigInt, id_estate: BigInt) => {
        await this.estateRecordRepository.updateEstate(id_estate_record, id_estate);
    }

    public findAll = async (id_estate: BigInt): Promise<EstateRecord[]> => {
        const raws = await this.estateRecordRepository.findAllByEstate(id_estate);
        return raws.map(raw => EstateRecordMapper.rawToModel(raw));
    }
}
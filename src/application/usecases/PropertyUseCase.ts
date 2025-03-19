import {FastifyInstance} from "fastify";
import {Property} from "@domain/model/Property.ts";
import {PropertyRepository} from "@domain/repository/PropertyRepository.ts";
import {PropertyRepositoryImp} from "@infrastructure/persistences/PropertyRepositoryImp.ts";

export class PropertyUseCase {
    private propertyRepository: PropertyRepository;
    constructor(fastify: FastifyInstance) {
        this.propertyRepository = new PropertyRepositoryImp(fastify);
    }

    public find = async (id: number): Promise<Property> => {
        return await this.propertyRepository.find(id);
    }

    public findAll = async (): Promise<Property[]> => {
        return await this.propertyRepository.findAll();
    }
}
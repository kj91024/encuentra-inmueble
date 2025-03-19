import { FastifyInstance } from "fastify";
import { OwnerRepository } from "@domain/repository/OwnerRepository.ts";
import { CreateOwner } from "@domain/model/owner/CreateOwner.ts";
import { Owner } from "@domain/model/owner/Owner.ts";
import { OwnerMapper } from "@domain/mappers/OwnerMapper.ts";
import { OwnerRepositoryImp } from "@infrastructure/persistences/OwnerRepositoryImp.ts";
import { ThumbnailUseCase } from "@usecases/ThumbnailUseCase.ts";

export class OwnerUseCase {
    private ownerRepository: OwnerRepository;
    private thumbnailUseCase: ThumbnailUseCase;

    constructor(fastify: FastifyInstance) {
        this.ownerRepository = new OwnerRepositoryImp(fastify);
        this.thumbnailUseCase = new ThumbnailUseCase(fastify);
    }

    public save = async (data: CreateOwner): Promise<number> => {
        const raw = await this.ownerRepository.findByUrlSource(data.url_source);
        return raw ? raw.id_owner : await this.insert(data);
    }

    private insert = async (data: CreateOwner): Promise<number> => {
        const thumbnailEntity = {
            url: data.url_thumbnail ?? `https://www.svgrepo.com/show/529284/user-id.svg?temp=${data.name}`
        };

        const id_thumbnail =  await this.thumbnailUseCase.save(thumbnailEntity);

        const entity = {
            id_thumbnail: id_thumbnail,
            name: data.name,
            cellphone: data.cellphone ?? '',
            url_source: data.url_source
        };
        return await this.ownerRepository.insert(entity);
    }

    public update = async (data: CreateOwner): Promise<void> => {
        if (!data.id) {
            throw new Error("Falta definir el id");
        }

        const model = await this.ownerRepository.find(data.id);

        const entity = {
            id_owner: data.id,
            id_thumbnail: model.id_thumbnail,
            name: data.name,
            cellphone: data.cellphone ?? '',
            url_source: data.url_source
        }
        await this.ownerRepository.update(entity);
    }

    public find = async (id: number): Promise<Owner> => {
        const raw = await this.ownerRepository.find(id);
        return OwnerMapper.rawToModel(raw);
    }
}
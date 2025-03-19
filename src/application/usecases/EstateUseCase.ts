import { Estate } from "@domain/model/estate/Estate.ts";
import { FilterEstate } from "@domain/model/estate/FilterEstate.ts";
import { CreateEstate } from "@domain/model/estate/CreateEstate.ts";
import { EstateRepository } from "@domain/repository/EstateRepository.ts";
import { EstateRepositoryImp } from "@infrastructure/persistences/EstateRepositoryImp.ts";
import { FastifyInstance } from "fastify";
import { EstateEntity } from "@domain/entity/estate/EstateEntity.ts";
import { GpsUseCase } from "@usecases/GpsUseCase.ts";
import { ThumbnailUseCase } from "@usecases/ThumbnailUseCase.ts";
import { EstateRecordUseCase } from "@usecases/EstateRecordUseCase.ts";
import { CreateEstateRecord } from "@domain/model/estate_record/CreateEstateRecord.ts";
import { CreateThumbnail } from "@domain/model/thumbnail/CreateThumbnail.ts";
import { CreateGps } from "@domain/model/gps/CreateGps.ts";
import { CreateOwner } from "@domain/model/owner/CreateOwner.ts";
import { OwnerUseCase } from "@usecases/OwnerUseCase.ts";
import {EstateMapper} from "@domain/mappers/EstateMapper.ts";

export class EstateUseCase {
    private estateRepository: EstateRepository;
    private estateRecordUseCase: EstateRecordUseCase;
    private gpsUseCase: GpsUseCase;
    private thumbnailUseCase: ThumbnailUseCase;
    private ownerUseCase: OwnerUseCase;

    constructor(fastify: FastifyInstance) {
        this.estateRepository = new EstateRepositoryImp(fastify);
        this.estateRecordUseCase = new EstateRecordUseCase(fastify);
        this.gpsUseCase = new GpsUseCase(fastify);
        this.thumbnailUseCase = new ThumbnailUseCase(fastify);
        this.ownerUseCase = new OwnerUseCase(fastify);
    }

    public save = async (data: CreateEstate): Promise<BigInt> => {
        const id_estate = await this.estateRepository.findByIdEstateLink(data.id_estate_link);

        if(!id_estate){
            return await this.insert(data);
        }

        const create_estate_record: CreateEstateRecord = {
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
        }
        const id_estate_record = await this.estateRecordUseCase.insert(create_estate_record);
        await this.estateRecordUseCase.updateEstate(id_estate_record, id_estate);
        return id_estate;
    }

    private insert = async (data: CreateEstate): Promise<BigInt> => {
        const create_estate_record: CreateEstateRecord = {
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
        }
        const id_estate_record = await this.estateRecordUseCase.insert(create_estate_record);
        const create_owner: CreateOwner = {
            name: data.owner_name,
            cellphone: data.owner_cellphone,
            url_source: data.owner_url_source,
            url_thumbnail: data.owner_url_thumbnail
        }
        const id_owner = await this.ownerUseCase.save(create_owner);

        const create_thumbnail: CreateThumbnail = {
            url: data.thumbnail_url
        }
        const id_thumbnail = await this.thumbnailUseCase.save(create_thumbnail);

        const create_gps: CreateGps = {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.gps_address
        }
        let id_gps = await this.gpsUseCase.insert(create_gps);

        let entity: EstateEntity = {
            id_estate_record: id_estate_record,
            id_thumbnail: id_thumbnail,
            id_data_source: data.id_data_source,
            id_estate_link: data.id_estate_link,

            id_owner: id_owner,

            id_departament: data.id_departament,
            id_province: data.id_province,
            id_district: data.id_district,

            id_gps: id_gps,

            url_source: data.url_source,
            address: data.address
        };

        let id_estate = await this.estateRepository.insert(entity);

        await Promise.all(
            data.gallery.map(url => {
                this.thumbnailUseCase.insertGalleryEstate(id_estate, { url });
            })
        );

        await this.estateRecordUseCase.updateEstate(id_estate_record, id_estate);

        return id_estate;
    }

    public find = async (id: BigInt): Promise<Estate> => {
        const raw = await this.estateRepository.find(id);
        const model = EstateMapper.rawToModel(raw);
        model.thumbnails = await this.thumbnailUseCase.findAllByEstate(model.id);
        return model;
    }

    public findAll = async (filter: FilterEstate): Promise<Estate[]> => {
        const raws = await this.estateRepository.findAll(filter);
        return raws.map(raw => EstateMapper.rawToModel(raw));
    }

    public findUrlPath = async (url_path: string): Promise<BigInt | null> => {
        return await this.estateRepository.findUrlPath(url_path);
    }
}
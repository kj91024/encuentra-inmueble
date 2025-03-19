import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {ProvinceUseCase} from "@usecases/ProvinceUseCase.ts";

export class ProvinceApi {
    private provinceUseCase: ProvinceUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.get('/api/province/list/:id_departament', this.list);

        this.provinceUseCase = new ProvinceUseCase(fastify);
    }

    private list = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_departament } = request.params as { id_departament: number };
        const models = await this.provinceUseCase.findAll(id_departament);
        return reply.success("Provincias", models);
    }
}
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DistrictUseCase} from "@usecases/DistrictUseCase.ts";

export class DistrictApi {
    private districtUseCase: DistrictUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.get('/api/district/list/:id_departament/:id_province', this.list);

        this.districtUseCase = new DistrictUseCase(fastify);
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        const {id_departament, id_province} = request.params as {id_departament: number, id_province: number};
        const models = await this.districtUseCase.findAll(id_departament, id_province);
        return reply.success("Distritos", models);
    }
}
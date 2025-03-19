import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {DepartamentUseCase} from "@usecases/DepartamentUseCase.ts";

export class DepartamentApi {
    private departamentUseCase: DepartamentUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.get('/api/departament/list', this.list);

        this.departamentUseCase = new DepartamentUseCase(fastify);
    }

    private list = async (request: FastifyRequest, reply: FastifyReply) => {
        const departaments = await this.departamentUseCase.findAll();
        return reply.success("Departamentos", departaments);
    }


}
import {UserUseCase} from "@usecases/UserUseCase.ts";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {CreateUser} from "@domain/model/user/CreateUser.ts";

export class UserApi {
    private userUseCase: UserUseCase;

    constructor(fastify: FastifyInstance) {
        fastify.post('/api/user/insert', this.insert);
        fastify.post('/api/user/session', this.session);
        fastify.put('/api/user/update', this.update);
        fastify.delete('/api/user/delete/:id_user', this.delete);
        fastify.get('/api/user/updateLastLogin/:id_user', this.updateLastLogin);
        fastify.get('/api/user/find/:id_user', this.find);
        fastify.get('/api/user/list', this.list);

        this.userUseCase = new UserUseCase(fastify);
    }

    public insert = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreateUser;
        await this.userUseCase.insert(data)
        return reply.success("Insert");
    }

    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        const data = request.body as CreateUser;
        await this.userUseCase.update(data);
        return reply.success("Update");
    }

    public delete = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_user } = request.params as { id_user: number };
        await this.userUseCase.delete(id_user);
        return reply.success("Delete");
    }

    public updateLastLogin = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_user } = request.params as { id_user: number };
        await this.userUseCase.delete(id_user);
        return reply.success("Delete Last Login");
    }

    public find = async (request: FastifyRequest, reply: FastifyReply) => {
        const { id_user } = request.params as { id_user: number };
        let user = await this.userUseCase.find(id_user);
        return reply.success("Find", user);
    }

    public list = async (request: FastifyRequest, reply: FastifyReply) => {
        let users = await this.userUseCase.findAll();
        return reply.success("List", users);
    }

    public session = async (request: FastifyRequest, reply: FastifyReply) => {
        const { username, password} = request.body as { username: string, password: string };
        let user = await this.userUseCase.findSession(username, password);

        if(user){
            await this.userUseCase.updateLogin(user.id);

            let cookieConfig = {
                path: "/",
                httpOnly: false, // Se puede acceder con document.cookie
                maxAge: 60 * 60 * 24
            };

            return reply
                .setCookie("user", JSON.stringify(user), cookieConfig)
                .success("Session", user);
        }

        return reply.success("Session", null);
    }
}
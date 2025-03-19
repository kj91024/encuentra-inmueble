import { CreateUser } from "@domain/model/user/CreateUser.ts";
import { FastifyInstance } from "fastify";
import { UserRepository } from "@domain/repository/UserRepository.ts";
import { UserRepositoryImp } from "@infrastructure/persistences/UserRepositoryImp.ts";
import {User} from "@domain/model/user/User.ts";
import {UserEntity} from "@domain/entity/user/UserEntity.ts";

export class UserUseCase {
    private userRepository: UserRepository;

    constructor(fastify: FastifyInstance) {
        this.userRepository = new UserRepositoryImp(fastify);
    }

    public insert = async (data: CreateUser): Promise<number> => {
        const entity: UserEntity = {
            names: data.names,
            last_names: data.last_names,
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role
        };

        return await this.userRepository.insert(entity);
    }

    public update = async (data: CreateUser): Promise<void>=> {
        if(!data.id){
            throw new Error("Debes definir el id primero");
        }

        const entity: UserEntity = {
            id_user: data.id,
            names: data.names,
            last_names: data.last_names,
            email: data.email,
            username: data.username,
            password: data.password,
            role: data.role
        };

        await this.userRepository.update(entity);
    }

    public find = async (id_user: number): Promise<User> => {
        return await this.userRepository.find(id_user);
    }

    public findAll = async (): Promise<User[]> => {
        return await this.userRepository.findAll();
    }

    public delete = async (id_user: number): Promise<void> => {
        await this.userRepository.delete(id_user);
    }

    public findSession = async (username: string, password: string): Promise<User | null> => {
        return await this.userRepository.findSession(username, password);
    }

    public updateLogin = async (id_user: number): Promise<void> => {
        await this.userRepository.updateLogin(id_user);
    }
}
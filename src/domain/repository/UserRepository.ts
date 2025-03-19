import { User } from "@domain/model/user/User.ts";
import {UserEntity} from "@domain/entity/user/UserEntity.ts";

export interface UserRepository {
    insert(data: UserEntity): Promise<number>;
    update(data: UserEntity): Promise<void>;
    delete(id_user: number): Promise<void>;
    find(id_user: number): Promise<User>;
    findAll(): Promise<User[]>;
    updateLogin(id_user: number): Promise<void>
    findSession(username: string, password: string): Promise<User | null>;
}
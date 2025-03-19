import {Repository} from "@infrastructure/Repository.ts";
import {UserRepository} from "@domain/repository/UserRepository.ts";
import {User} from "@domain/model/user/User.ts";
import {CreateUser} from "@domain/model/user/CreateUser.ts";
import {FastifyInstance} from "fastify";
import {UserEntity} from "@domain/entity/user/UserEntity.ts";

export class UserRepositoryImp extends Repository implements UserRepository {
    constructor(fastify: FastifyInstance) {
        super(fastify);
    }

    public delete = async (id_user: number): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                DELETE FROM users
                WHERE id_user=$1
            `;
            await client.query(sql, [id_user]);
        });
    }

    public find = async (id_user: number): Promise<User> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_user as id, names, last_names, email, username, role, last_login_at, created_at, updated_at, deleted_at
                FROM users
                WHERE id_user=$1
            `;
            const res = await client.query(sql, [id_user]);
            const rows = res.rows;
            return rows[0];
        });
    }

    public findSession = async (username: string, password: string): Promise<User | null> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_user as id, names, last_names, email, username, role, last_login_at, created_at, updated_at, deleted_at
                FROM users
                WHERE username = $1 AND password = $2
            `;
            const res = await client.query(sql, [username, password]);
            const rows = res.rows;
            if(!rows || rows.length === 0) {
                return null;
            }
            return rows[0];
        });
    }

    public findAll = async (): Promise<User[]> => {
        return await this.dbScope(async (client) => {
            const sql = `
                SELECT id_user as id, names, last_names, email, username, role, last_login_at, created_at, updated_at, deleted_at
                FROM users
            `;
            const res = await client.query(sql);
            return res.rows;
        });
    }

    public updateLogin = async (id_user: number): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE users
                SET last_login_at = $1
                WHERE id_user = $2 AND deleted_at IS NULL
            `;

            const params = [ new Date(), id_user ];
            await client.query(sql, params);
        });
    }

    public insert = async (data: UserEntity): Promise<number> => {
        return await this.dbScope(async (client) => {
            const sql = `
                INSERT INTO users (names, last_names, email, role, username, password, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id_user
            `;

            console.log(data);

            const params = [
                data.names,
                data.last_names,
                data.email,
                data.role,
                data.username,
                data.password,
                data.created_at ?? new Date(),
                data.updated_at ?? new Date()
            ];

            const res = await client.query(sql, params);
            return res.rows[0].id_user;
        });
    }

    public update = async (data: UserEntity): Promise<void> => {
        return await this.dbScope(async (client) => {
            const sql = `
                UPDATE users
                SET names = $1, last_names = $2, role= $3, email = $4, username = $5, password = $6, updated_at = $7
                WHERE id_user = $8
            `;

            const params = [
                data.names,
                data.last_names,
                data.role,
                data.email,
                data.username,
                data.password,
                data.updated_at ?? new Date(),
                data.id_user
            ];

            await client.query(sql, params);
        });
    }

}
export interface UserEntity {
    id_user?: number;
    names: string;
    last_names: string;
    email: string;
    username: string;
    password: string;
    role: string;
    last_login_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
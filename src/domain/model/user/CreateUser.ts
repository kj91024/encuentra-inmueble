export interface CreateUser {
    id?: number;
    names: string;
    last_names: string;
    email: string;
    username: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}
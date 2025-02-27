declare module 'fastify' {
    interface FastifyReply {
        error(message: string, internal_message: string, data?: any): void;
        success(message: String, data?: any): void;
    }
}
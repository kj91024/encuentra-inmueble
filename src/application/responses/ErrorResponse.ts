export interface ErrorResponse {
    status: String;
    error: {
        message: String;
        internal_message: String;
        data: any;
    }
}
export class ApiError extends Error {
    status: number = 0;
    errors: any[] = [];

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorized() {
        return new ApiError(401, "User is not authorized");
    }

    static badRequest(message: string, errors: any[] = []) {
        return new ApiError(400, message, errors);
    }
}
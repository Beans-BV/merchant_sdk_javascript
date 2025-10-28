export class ApiException extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly response: Response,
        message: string
    ) {
        super(message);
        this.name = 'ApiException';
        Object.setPrototypeOf(this, ApiException.prototype);
    }

    toString(): string {
        return `ApiException: ${this.message} (Status code: ${this.statusCode})`;
    }
}


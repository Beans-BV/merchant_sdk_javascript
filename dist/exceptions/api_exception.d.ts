export declare class ApiException extends Error {
    readonly statusCode: number;
    readonly response: Response;
    constructor(statusCode: number, response: Response, message: string);
    toString(): string;
}
//# sourceMappingURL=api_exception.d.ts.map
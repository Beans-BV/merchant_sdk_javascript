export interface PaymentRequestResponse {
    id: string;
}
export interface DeeplinkResponse extends PaymentRequestResponse {
    deeplink: string;
}
export interface SvgQrCodeResponse extends DeeplinkResponse {
    id: string;
    svgQrCode: string;
}
export interface PngQrCodeResponse extends DeeplinkResponse {
    pngQrCodeBase64String: string;
}
//# sourceMappingURL=qr_code_response.d.ts.map
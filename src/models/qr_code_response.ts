export interface SvgQrCodeResponse {
  id: string;
  deeplink: string;
  svgQrCode: string;
}

export interface PngQrCodeResponse {
  id: string;
  deeplink: string;
  pngQrCodeBase64String: string;
}

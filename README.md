# Beans Merchant SDK

[![npm version](https://badge.fury.io/js/beans-merchant.svg)](https://www.npmjs.com/package/beans-merchant-sdk)

Beans Merchant SDK is a JavaScript library for interacting with the Beans Merchant API. It provides a convenient way to integrate Beans Merchant functionality into your JavaScript applications.

## Introduction

The Beans Merchant SDK offers a comprehensive toolkit for integrating the advanced payment capabilities of the Beans platform directly into your JavaScript applications. This SDK is designed to simplify the integration process, allowing you to leverage the Beans Merchant API's full potential without needing to manage the intricacies of direct API calls. By incorporating the Beans Merchant SDK, developers can unlock a wide range of use cases:

- **Build an In-Person Merchant POS:** Facilitate in-person point of sale at stores or restaurants by generating payment requests through QR codes. This combines the convenience of online transactions with the traditional in-store shopping experience.

- **Shopify App for Currency Flexibility:** Develop a Shopify application that empowers merchants to request payments in their preferred currency while offering customers the flexibility to pay in theirs. This functionality enhances the shopping experience, catering to a global customer base.

- **Integrate Beans as Your On/Off Ramp Partner:** Streamline your application's payment infrastructure by using Beans as your central on/off ramp partner. This integration saves significant development time and resources by eliminating the need to individually integrate multiple on/off ramp solutions.

- **Monetize Your GPT Applications:** For applications utilizing Generative Pre-trained Transformers (GPT), integrating Beans enables a monetization strategy where services can be accessed for free up to a certain limit, after which users are prompted to pay for additional usage or to purchase credits. This model is perfect for applications offering premium content or services on a per-use basis.

For detailed information on how to integrate our services or to start the onboarding process, please contact us at [merchants@beansapp.com](mailto:merchants@beansapp.com). The Beans Merchant SDK is your gateway to simplifying payments, enhancing customer experiences, and unlocking new business opportunities.

## Installation

You can install the package using npm:

```bash
npm install beans-merchant-sdk
```

## Usage

```ts
import {BeansMerchantSdk, BeansMerchantSdkEnvironment}  from '../node_modules/beans-merchant-sdk/dist/sdk.js';

// Create an instance of BeansMerchantSdk
const sdk = new BeansMerchantSdk(BeansMerchantSdkEnvironment.STAGING, 'your-api-key');

// Fetch currencies
sdk.fetchCurrencies('stellarAccountId')
  .then((response: FetchStellarCurrenciesResponse) => {
    console.log('Available currencies:', response.stellarCurrencies);
  });

// Generate deeplink
sdk.generateDeeplink('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook')
  .then((response: DeeplinkResponse) => {
    console.log('Generated deeplink:', response.deeplink);
  });

// Generate SVG QR code
sdk.generateSvgQRCode('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook', 250)
  .then((response: SvgQrCodeResponse) => {
    console.log('Generated deeplink:', response.deeplink);
    console.log('Generated SVG QR code:', response.svgQrCode);
  });

// Generate PNG QR code
merchant.generatePngQRCode('stellarAccountId', 'stellarCurrencyId', 100, 'memo', 1, 'https://your-domain.com/webhook', 250)
  .then((response: PngQrCodeResponse) => {
    console.log('Generated deeplink:', response.deeplink);
    console.log('Generated PNG QR code:', response.pngQrCodeBase64String);
  });
```

## API Reference

### BeansMerchantSdk

The BeansMerchantSdk class provides methods for interacting with the Beans Merchant API.

#### `BeansMerchantSdk(environment, apiKey)`

Constructor for creating a new instance of the BeansMerchantSdk class.

Input:
- `environment`: The API environment (`BeansMerchantSdkEnvironment.STAGING` or `BeansMerchantSdkEnvironment.PRODUCTION`).
- `apiKey`: Your Beans Merchant API key.

### Methods:

#### `fetchStellarCurrencies(stellarAccountId)`

Retrieves the list of Stellar currencies accessible for the specified Stellar Account. Should the desired currency not appear in the response, it may be due to the absence of a trustline for that currency, or the currency is not supported by Beans App.

Input:
- `stellarAccountId`: Your Stellar account ID.

Output:
Returns a Promise that resolves to a `FetchStellarCurrenciesResponse` object.

#### `generateDeeplink(stellarAccountId, currencyId, amount, memo, maxAllowedPayments, webhookUrl)`

Generates a deeplink for a payment request.

Input:
- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `maxAllowedPayments`: (Optional) Maximum number of payments allowed for the payment request. Unlimited is -1. Default is 1.
- `webhookUrl`: (Optional) Webhook URL for payment received notification.

Output:
Returns a Promise that resolves to a `DeeplinkResponse` object.

#### `generatePngQrCode(stellarAccountId, currencyId, amount, memo, maxAllowedPayments, webhookUrl, preferredSize)`

Generates a PNG QR code for a payment request.

Input:
- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `maxAllowedPayments`: (Optional) Maximum number of payments allowed for the payment request. Unlimited is -1. Default is 1.
- `webhookUrl`: (Optional) Webhook URL for payment received notification.
- `preferredSize`: (Optional) Preferred size of the QR code. We will try to generate a QR code with a size as close as possible to the preferred size provided.

Output:
Returns a Promise that resolves to a `PngQrCodeResponse` object.

#### `generateSvgQrCode(stellarAccountId, currencyId, amount, memo, maxAllowedPayments, webhookUrl, size)`

Generates an SVG QR code for a payment request.

Input:
- `stellarAccountId`: Your Stellar account ID.
- `currencyId`: Stellar currency ID.
- `amount`: Amount for the payment request.
- `memo`: Memo for the payment request.
- `maxAllowedPayments`: (Optional) Maximum number of payments allowed for the payment request. Unlimited is -1. Default is 1.
- `webhookUrl`: (Optional) Webhook URL for payment received notification.
- `size`: (Optional) Size of the QR code.

Output:
Returns a Promise that resolves to a `SvgQrCodeResponse` object.

### `FetchStellarCurrenciesResponse`

The response object returned by the `fetchStellarCurrencies` method.

Properties:
- `stellarCurrencies`: An array of Stellar currencies accessible for the specified Stellar Account.

### `DeeplinkResponse`

The response object returned by the `generateDeeplink` method.

Properties:
- `id`: The ID of the payment request.
- `deeplink`: The Beans App deeplink for the payment request.

### `PngQrCodeResponse`

The response object returned by the `generatePngQrCode` method.

Properties:
- `id`: The ID of the payment request.
- `deeplink`: The Beans App deeplink for the payment request.
- `pngQrCodeBase64String`: The base64 encoded PNG QR code containing the deeplink.

### `SvgQrCodeResponse`

The response object returned by the `generateSvgQrCode` method.

Properties:
- `id`: The ID of the payment request.
- `deeplink`: The Beans App deeplink for the payment request.
- `svgQrCode`: The SVG QR code containing the deeplink.

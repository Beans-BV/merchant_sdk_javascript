var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BeansMerchantSdk {
    constructor(apiBaseUrl, apiKey) {
        this.apiBaseUrl = apiBaseUrl;
        this.apiKey = apiKey;
    }
    static production(apiKey) {
        return new BeansMerchantSdk('https://api.beansapp.com/v3', apiKey);
    }
    static staging(apiKey) {
        return new BeansMerchantSdk('https://api.staging.beansapp.com/v3', apiKey);
    }
    static custom(apiBaseUrl, apiKey) {
        const cleanApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, apiBaseUrl.length - 1) : apiBaseUrl;
        return new BeansMerchantSdk(cleanApiBaseUrl, apiKey);
    }
    fetchStellarCurrencies(stellarAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}/stellar-currencies`;
            const response = yield fetch(url, {
                headers: {
                    'X-Beans-Company-Api-Key': this.apiKey
                }
            });
            const data = yield response.json();
            return data;
        });
    }
    generateDeeplink(stellarAccountId_1, stellarCurrencyId_1, amount_1, memo_1) {
        return __awaiter(this, arguments, void 0, function* (stellarAccountId, stellarCurrencyId, amount, memo, maxAllowedPayments = null, webhookUrl = null) {
            const response = yield this.generatePaymentRequest(stellarAccountId, {
                "stellarCurrencyId": stellarCurrencyId,
                "amount": amount,
                "memo": memo,
                "maxAllowedPayments": maxAllowedPayments,
                "paymentReceivedWebHookUrl": webhookUrl,
                "deeplink": {
                    "include": true
                }
            });
            return response;
        });
    }
    generatePngQrCode(stellarAccountId_1, stellarCurrencyId_1, amount_1, memo_1) {
        return __awaiter(this, arguments, void 0, function* (stellarAccountId, stellarCurrencyId, amount, memo, maxAllowedPayments = null, webhookUrl = null, preferredSize = null) {
            const response = yield this.generatePaymentRequest(stellarAccountId, {
                "stellarCurrencyId": stellarCurrencyId,
                "amount": amount,
                "memo": memo,
                "maxAllowedPayments": maxAllowedPayments,
                "paymentReceivedWebHookUrl": webhookUrl,
                "deeplink": {
                    "include": true
                },
                "pngQrCodeBase64String": {
                    "include": true,
                    "preferredSize": preferredSize
                }
            });
            return response;
        });
    }
    generateSvgQrCode(stellarAccountId_1, stellarCurrencyId_1, amount_1, memo_1) {
        return __awaiter(this, arguments, void 0, function* (stellarAccountId, stellarCurrencyId, amount, memo, maxAllowedPayments = null, webhookUrl = null, size = null) {
            const response = yield this.generatePaymentRequest(stellarAccountId, {
                "stellarCurrencyId": stellarCurrencyId,
                "amount": amount,
                "memo": memo,
                "maxAllowedPayments": maxAllowedPayments,
                "paymentReceivedWebHookUrl": webhookUrl,
                "deeplink": {
                    "include": true
                },
                "svgQrCode": {
                    "include": true,
                    "size": size
                }
            });
            return response;
        });
    }
    generatePaymentRequest(stellarAccountId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}/payment-request`;
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Beans-Company-Api-Key': this.apiKey,
                },
                body: JSON.stringify(body)
            });
            const data = yield response.json();
            return data;
        });
    }
    getPaymentRequestStatus(paymentRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.apiBaseUrl}/companies/me/payment-requests/${paymentRequestId}/status`;
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Beans-Company-Api-Key': this.apiKey
                }
            });
            console.log(response);
            const data = yield response.json();
            return data;
        });
    }
}
//# sourceMappingURL=sdk.js.map
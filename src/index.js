

import BeansMerchantEnvironment from './enums.js';
class BeansMerchantSDK {

    constructor(apiKey, environment) {
        this.apiKey = apiKey;
        this.environment = environment;
    }

    updateEnvironment(environment) {
        this.environment = environment;
    }

    fetchCurrencies(stellarAccountId) {
        const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/stellar-currencies`;

        return fetch(url, {
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                return data['stellarCurrencies'];
            })
            .catch(error => {
                console.error('Error fetching currencies:', error);
            });
    }

    async generateQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '') {
        const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/payment-request`;

        const requestBody = {
            "stellarCurrencyId": currencyId,
            "amount": amount,
            "memo": memo,
            "paymentReceivedWebHookUrl": webhookUrl !== '' ? webhookUrl : null,
            "deeplink": {
                "include": true
            },
            "svgQrCode": {
                "include": true
            },
            "pngQrCodeBase64String": {
                "include": false
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Beans-Company-Api-Key': this.apiKey
                },
                body: JSON.stringify(requestBody)
            });
            return await response.json();
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }

    async generatePngQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '') {
        return this.generateQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl)
            .then(data => {
                return data.svgQrCode || 'QR code not available';
            })
            .catch(error => {
                console.error('Error generating QR code:', error);
            });
    }

    async generateSvgQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl = '') {
        return this.generateQRCode(stellarAccountId, currencyId, amount, memo, webhookUrl)
            .then(data => {
                return data.svgQrCode || 'QR code not available';
            })
            .catch(error => {
                console.error('Error generating QR code:', error);
            });
    }
}

// Exporting the class for use in other files
export { BeansMerchantSDK, BeansMerchantEnvironment };

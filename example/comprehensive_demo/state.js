// Simple state management pattern - similar to Redux but simpler
class StateStore {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Constants (matching Dart version)
const Constants = {
    // Beans company
    beansApiKey: 'QNOB-013X-0F32-LWJA',
    beansStellarAccountId: 'GBN767WEKXOG275FJQMEBK3XQXFOGQQ3FMI7GX7IJRSFMXYTZWQ7Y6Z6',
    
    // UnaSwap company
    unaSwapApiKey: 'QNOB-013X-0F32-LWJB',
    unaSwapStellarAccountId: 'GB5TLWF2UTZSY7QZ7BT6VK4UPT2KGG2TT33ZIK3JS74WVF7FKPWRQ7WN',
    
    // EkoEbooks company
    ekoEbooksApiKey: 'QNOB-013X-0F32-LWJC',
    ekoEbooksStellarAccountId: 'GBYSGYLHPDTMHX33DCITR6DA4CLDDEIPXBZ7ASNVYQPYPKA3ROQUSRHA',
    
    // Currency IDs
    usdStellarCurrencyId: 'f2155597-8629-40fd-ba65-7da8b5f837c3',
    usdStellarCurrencyCode: 'USD',
    xlmStellarCurrencyId: 'a14a2642-d650-4e6f-b72a-6ac86303a492',
    xlmStellarCurrencyCode: 'XLM',
    ngnStellarCurrencyId: '98231a85-c20b-411f-bce9-746bfe92a368',
    ngnStellarCurrencyCode: 'NGNC',
};

// Global state store
const store = new StateStore({
    // SDK Configuration
    config: {
        apiKey: Constants.beansApiKey,
        stellarAccountId: Constants.beansStellarAccountId,
        environment: 'production',
        customBaseUrl: '',
        useCustomSdk: false,
    },
    
    // SDK Instance
    sdk: null,
    
    // Stellar Currencies
    stellarCurrencies: {
        currencies: [],
        isLoading: false,
        error: null,
        selectedCurrencyId: null,
    },
    
    // Company Accounts
    companyAccounts: {
        accounts: [],
        isLoading: false,
        error: null,
        selectedAccount: null,
        isCreatingAccount: false,
        isDeletingAccount: false,
        selectedImageFile: null,
        selectedImagePreview: null,
    },
    
    // Payment
    payment: {
        amount: '10.50',
        memo: 'Demo Payment',
        maxPayments: '1',
        webhookUrl: '',
        isGeneratingPayment: false,
        error: null,
        lastPaymentResponse: null,
    },
});


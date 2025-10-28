// ============================================================================
// SDK - SDK initialization and API actions
// ============================================================================

// SDK Initialization
// Bind fetch to window to avoid "Illegal invocation" errors
const boundFetch = window.fetch.bind(window);

function createSdk(config) {
    if (!config.apiKey || !config.stellarAccountId) return null;

    if (config.useCustomSdk && config.customBaseUrl) {
        return BeansMerchantSdk.custom(config.customBaseUrl, config.apiKey, boundFetch);
    }
    
    return config.environment === 'production'
        ? BeansMerchantSdk.production(config.apiKey, boundFetch)
        : BeansMerchantSdk.staging(config.apiKey, boundFetch);
}

let lastAttemptedConfig = null;

async function updateSdk() {
    const state = store.getState();
    const sdk = createSdk(state.config);
    store.setState({ sdk });
    
    // Auto-load data only when configuration changes and becomes valid
    const currentConfig = `${state.config.apiKey}|${state.config.stellarAccountId}|${state.config.customBaseUrl}|${state.config.useCustomSdk}`;
    const validationError = getConfigValidationError(state.config);
    
    if (sdk && 
        validateConfig(state.config) && 
        validationError === null &&
        !state.stellarCurrencies.isLoading &&
        !state.companyAccounts.isLoading &&
        lastAttemptedConfig !== currentConfig) {
        
        // Clear errors before valid load
        store.setState({
            stellarCurrencies: { ...state.stellarCurrencies, error: null },
            companyAccounts: { ...state.companyAccounts, error: null },
        });
        
        await Promise.all([loadStellarCurrencies(), loadCompanyAccounts()]);
        lastAttemptedConfig = currentConfig;
    }
}

function validateConfig(config) {
    // Check API key format: AAAA-BBBB-CCCC-DDDD
    if (!config.apiKey) return false;
    const apiKeyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!apiKeyPattern.test(config.apiKey)) return false;
    
    // Check Stellar Account ID length
    if (!config.stellarAccountId || config.stellarAccountId.length !== 56) return false;
    
    // Validate custom SDK URL
    if (config.useCustomSdk) {
        if (!config.customBaseUrl) return false;
        try {
            const url = new URL(config.customBaseUrl);
            if (!url.protocol.startsWith('http')) return false;
            if (!url.hostname || url.hostname === '') return false;
            return true;
        } catch {
            return false;
        }
    }
    
    return true;
}

function getConfigValidationError(config) {
    // Check custom SDK URL first
    if (config.useCustomSdk) {
        if (!config.customBaseUrl) return 'Custom Base URL is required when using custom SDK';
        try {
            const url = new URL(config.customBaseUrl);
            if (!url.protocol.startsWith('http')) return 'Custom Base URL must be a valid HTTP/HTTPS URL';
            if (!url.hostname || url.hostname === '') return 'Custom Base URL must include a valid domain';
        } catch {
            return 'Custom Base URL format is invalid';
        }
    }
    
    // Check API key
    if (!config.apiKey) return 'API Key is required';
    
    // Validate API key format: AAAA-BBBB-CCCC-DDDD
    if (config.apiKey) {
        const apiKeyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!apiKeyPattern.test(config.apiKey)) {
            return 'API Key must be in format AAAA-BBBB-CCCC-DDDD';
        }
    }
    
    // Check Stellar Account ID
    if (!config.stellarAccountId) return 'Stellar Account ID is required';
    if (config.stellarAccountId && config.stellarAccountId.length !== 56) {
        return 'Stellar Account ID must be exactly 56 characters long';
    }
    
    return null;
}

// Stellar Currencies Actions
async function loadStellarCurrencies() {
    const state = store.getState();
    if (!state.sdk || !state.config.stellarAccountId) return;

    store.setState({
        stellarCurrencies: { ...state.stellarCurrencies, isLoading: true, error: null },
    });

    try {
        const response = await state.sdk.fetchStellarCurrencies(state.config.stellarAccountId);
        const currencies = response.stellarCurrencies || [];
        
        store.setState({
            stellarCurrencies: {
                currencies,
                isLoading: false,
                error: null,
                selectedCurrencyId: currencies.length > 0 ? currencies[0].id : null,
            },
        });
    } catch (error) {
        store.setState({
            stellarCurrencies: {
                ...state.stellarCurrencies,
                isLoading: false,
                error: error.message || 'Failed to load stellar currencies',
            },
        });
    }
}

function selectCurrency(currencyId) {
    const state = store.getState();
    store.setState({
        stellarCurrencies: { ...state.stellarCurrencies, selectedCurrencyId: currencyId },
    });
}

// Company Accounts Actions
async function loadCompanyAccounts() {
    const state = store.getState();
    if (!state.sdk) return;

    store.setState({
        companyAccounts: { ...state.companyAccounts, isLoading: true, error: null },
    });

    try {
        const response = await state.sdk.getCompanyAccounts();
        const accounts = response.accounts || [];
        
        store.setState({
            companyAccounts: {
                accounts,
                isLoading: false,
                error: null,
                selectedAccount: accounts.length > 0 ? accounts[0] : null,
            },
        });
    } catch (error) {
        store.setState({
            companyAccounts: {
                ...state.companyAccounts,
                isLoading: false,
                error: error.message || 'Failed to load company accounts',
            },
        });
    }
}

async function createCompanyAccount(stellarAccountId, name, imageFile) {
    const state = store.getState();
    if (!state.sdk) return;

    store.setState({
        companyAccounts: { ...state.companyAccounts, isCreatingAccount: true, error: null },
    });

    try {
        await state.sdk.createCompanyAccount(stellarAccountId, name);
        
        if (imageFile) {
            try {
                await state.sdk.uploadCompanyAccountAvatar('me', stellarAccountId, imageFile);
            } catch (avatarError) {
                console.warn('Failed to upload avatar:', avatarError);
            }
        }
        
        // Reload accounts and then only toggle flags without overwriting the reloaded list
        await loadCompanyAccounts();
        const latest = store.getState();
        store.setState({
            companyAccounts: {
                ...latest.companyAccounts,
                isCreatingAccount: false,
                selectedImageFile: null,
                selectedImagePreview: null,
            },
        });
    } catch (error) {
        store.setState({
            companyAccounts: {
                ...state.companyAccounts,
                isCreatingAccount: false,
                error: error.message || 'Failed to create company account',
            },
        });
        throw error;
    }
}

async function deleteCompanyAccount(stellarAccountId) {
    const state = store.getState();
    if (!state.sdk) return;

    store.setState({
        companyAccounts: { ...state.companyAccounts, isDeletingAccount: true, error: null },
    });

    try {
        await state.sdk.deleteCompanyAccount(stellarAccountId);
        await loadCompanyAccounts();
        const latest = store.getState();
        store.setState({
            companyAccounts: { ...latest.companyAccounts, isDeletingAccount: false },
        });
    } catch (error) {
        store.setState({
            companyAccounts: {
                ...state.companyAccounts,
                isDeletingAccount: false,
                error: error.message || 'Failed to delete company account',
            },
        });
        throw error;
    }
}

function selectAccount(account) {
    const state = store.getState();
    store.setState({
        companyAccounts: { ...state.companyAccounts, selectedAccount: account },
    });
}

function setSelectedImage(file, preview) {
    const state = store.getState();
    store.setState({
        companyAccounts: {
            ...state.companyAccounts,
            selectedImageFile: file,
            selectedImagePreview: preview,
        },
    });
}

// Payment Actions
function updatePaymentAmount(amount) {
    const state = store.getState();
    store.setState({ payment: { ...state.payment, amount } });
}

function updatePaymentMemo(memo) {
    const state = store.getState();
    store.setState({ payment: { ...state.payment, memo } });
}

function updatePaymentMaxPayments(maxPayments) {
    const state = store.getState();
    store.setState({ payment: { ...state.payment, maxPayments } });
}

function updatePaymentWebhookUrl(webhookUrl) {
    const state = store.getState();
    store.setState({ payment: { ...state.payment, webhookUrl } });
}

async function generatePayment(type) {
    const state = store.getState();
    if (!state.sdk || !state.config.stellarAccountId) return;
    
    const selectedCurrency = state.stellarCurrencies.currencies.find(
        c => c.id === state.stellarCurrencies.selectedCurrencyId
    );
    
    if (!selectedCurrency) {
        store.setState({ payment: { ...state.payment, error: 'Please select a currency first' } });
        return;
    }

    store.setState({ payment: { ...state.payment, isGeneratingPayment: true, error: null } });

    try {
        const amount = parseFloat(state.payment.amount);
        const memo = state.payment.memo;
        const maxPayments = state.payment.maxPayments && state.payment.maxPayments.trim() !== '' 
            ? parseInt(state.payment.maxPayments) 
            : null;
        const webhookUrl = state.payment.webhookUrl && state.payment.webhookUrl.trim() !== '' 
            ? state.payment.webhookUrl 
            : null;
        
        let response;
        if (type === 'deeplink') {
            response = await state.sdk.generateDeeplink(
                state.config.stellarAccountId,
                selectedCurrency.id,
                amount,
                memo,
                maxPayments,
                webhookUrl
            );
        } else if (type === 'svg') {
            response = await state.sdk.generateSvgQrCode(
                state.config.stellarAccountId,
                selectedCurrency.id,
                amount,
                memo,
                maxPayments,
                webhookUrl,
                256
            );
        } else if (type === 'png') {
            response = await state.sdk.generatePngQrCode(
                state.config.stellarAccountId,
                selectedCurrency.id,
                amount,
                memo,
                maxPayments,
                webhookUrl,
                512
            );
        }

        store.setState({
            payment: {
                ...state.payment,
                isGeneratingPayment: false,
                lastPaymentResponse: response,
            },
        });
    } catch (error) {
        store.setState({
            payment: {
                ...state.payment,
                isGeneratingPayment: false,
                error: error.message || `Failed to generate ${type} payment`,
            },
        });
    }
}

async function generateDeeplink() {
    await generatePayment('deeplink');
}

async function generateSvgQrCode() {
    await generatePayment('svg');
}

async function generatePngQrCode() {
    await generatePayment('png');
}


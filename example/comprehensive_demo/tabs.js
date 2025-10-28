// ============================================================================
// TABS - Tab rendering and event handlers
// ============================================================================

// Setup Tab
function renderSetupTab(state) {
    const container = document.getElementById('setup-tab-content');
    if (!container) return;

    if (!container.innerHTML.trim() || !container.querySelector('#api-key-input')) {
        container.innerHTML = tabTemplates['setup'] || '';
    }

    const elements = {
        useCustomSdk: document.getElementById('use-custom-sdk-checkbox'),
        customBaseUrl: document.getElementById('custom-base-url-input'),
        environment: document.getElementById('environment-select'),
        apiKey: document.getElementById('api-key-input'),
        stellarAccountId: document.getElementById('stellar-account-id-input'),
        customSdkSection: document.getElementById('custom-sdk-section'),
        environmentSection: document.getElementById('environment-section'),
        validationError: document.getElementById('validation-error-container'),
        apiError: document.getElementById('api-error-container'),
    };

    // Update form values
    if (elements.useCustomSdk) elements.useCustomSdk.checked = state.config.useCustomSdk || false;
    if (elements.customBaseUrl) elements.customBaseUrl.value = state.config.customBaseUrl || '';
    if (elements.environment) elements.environment.value = state.config.environment || 'production';
    if (elements.apiKey) elements.apiKey.value = state.config.apiKey || '';
    if (elements.stellarAccountId) elements.stellarAccountId.value = state.config.stellarAccountId || '';

    // Show/hide sections
    if (elements.customSdkSection && elements.environmentSection) {
        elements.customSdkSection.style.display = state.config.useCustomSdk ? 'block' : 'none';
        elements.environmentSection.style.display = state.config.useCustomSdk ? 'none' : 'block';
    }

    // Update error messages
    const validationError = getConfigValidationError(state.config);
    if (elements.validationError) {
        elements.validationError.innerHTML = validationError ? `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> ${validationError}
            </div>
        ` : '';
    }

    const hasErrors = state.stellarCurrencies.error || state.companyAccounts.error;
    if (elements.apiError) {
        elements.apiError.innerHTML = hasErrors ? `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    ${state.stellarCurrencies.error ? `<div>Failed to load currencies: ${state.stellarCurrencies.error}</div>` : ''}
                    ${state.companyAccounts.error ? `<div>Failed to load accounts: ${state.companyAccounts.error}</div>` : ''}
                </div>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="handleRetry()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        ` : '';
    }
}

// Stellar Currencies Tab
function renderStellarCurrenciesTab(state) {
    const container = document.getElementById('stellar-currencies-tab-content');
    if (!container) return;

    if (!container.innerHTML.trim() || !container.querySelector('#currencies-list-container')) {
        container.innerHTML = tabTemplates['stellar-currencies'] || '';
    }

    const elements = {
        error: document.getElementById('currencies-error-container'),
        loading: document.getElementById('currencies-loading-container'),
        list: document.getElementById('currencies-list-container'),
        refreshBtn: document.getElementById('refresh-currencies-btn'),
    };

    if (elements.error) {
        elements.error.innerHTML = state.stellarCurrencies.error ? `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> Error: ${state.stellarCurrencies.error}
            </div>
        ` : '';
    }

    if (elements.loading) {
        elements.loading.innerHTML = state.stellarCurrencies.isLoading ? `
            <div class="text-center py-4">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p class="mt-2">Loading currencies...</p>
            </div>
        ` : '';
    }

    if (elements.list) {
        if (state.stellarCurrencies.currencies.length === 0 && !state.stellarCurrencies.isLoading) {
            elements.list.innerHTML = '<p class="text-muted">No currencies loaded</p>';
        } else if (!state.stellarCurrencies.isLoading) {
            elements.list.innerHTML = `
                <div class="list-group">
                    ${state.stellarCurrencies.currencies.map(currency => `
                        <div class="list-group-item">
                            <div class="d-flex align-items-center">
                                <div class="currency-avatar">
                                    ${currency.code ? currency.code.substring(0, 1).toUpperCase() : '?'}
                                </div>
                                <div class="flex-grow-1 ml-3">
                                    <strong>${currency.name || 'Unknown'}</strong>
                                    <div class="text-muted small">Code: ${currency.code || 'N/A'}</div>
                                </div>
                                <div class="text-muted small text-right">${currency.id || 'N/A'}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            elements.list.innerHTML = '';
        }
    }

    if (elements.refreshBtn) {
        elements.refreshBtn.disabled = state.stellarCurrencies.isLoading;
        elements.refreshBtn.innerHTML = state.stellarCurrencies.isLoading ? 
            '<i class="fas fa-spinner fa-spin"></i> Refresh' : 
            '<i class="fas fa-redo"></i> Refresh';
    }
}

// Accounts Tab
function renderAccountsTab(state) {
    const container = document.getElementById('accounts-tab-content');
    if (!container) return;

    if (!container.innerHTML.trim() || !container.querySelector('#accounts-list-container')) {
        container.innerHTML = tabTemplates['accounts'] || '';
    }

    const elements = {
        error: document.getElementById('accounts-error-container'),
        loading: document.getElementById('accounts-loading-container'),
        list: document.getElementById('accounts-list-container'),
        refreshBtn: document.getElementById('refresh-accounts-btn'),
        avatarPreview: document.getElementById('avatar-preview-container'),
        createBtn: document.getElementById('create-account-btn'),
    };

    if (elements.error) {
        elements.error.innerHTML = state.companyAccounts.error ? `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> Error: ${state.companyAccounts.error}
            </div>
        ` : '';
    }

    if (elements.loading) {
        elements.loading.innerHTML = state.companyAccounts.isLoading ? `
            <div class="text-center py-4">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p class="mt-2">Loading accounts...</p>
            </div>
        ` : '';
    }

    if (elements.list) {
        if (state.companyAccounts.accounts.length === 0 && !state.companyAccounts.isLoading) {
            elements.list.innerHTML = '<p class="text-muted">No accounts found</p>';
        } else if (!state.companyAccounts.isLoading) {
            const accountsHtml = state.companyAccounts.accounts.map((account, index) => {
                const avatarId = `account-avatar-${account.stellarAccountId}-${index}`;
                const placeholderId = `account-avatar-placeholder-${account.stellarAccountId}-${index}`;
                return `
                    <div class="list-group-item">
                        <div class="d-flex align-items-center">
                            ${account.avatarUrl ? `
                                <div id="${avatarId}" class="account-avatar-loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                                <div id="${placeholderId}" class="account-avatar-placeholder" style="display:none;">
                                    <i class="fas fa-user"></i>
                                </div>
                            ` : `
                                <div class="account-avatar-placeholder">
                                    <i class="fas fa-user"></i>
                                </div>
                            `}
                            <div class="flex-grow-1 ml-3">
                                <strong>${account.name?.en || account.name?.vn || 'Unnamed Account'}</strong>
                                <div class="text-muted small">${account.stellarAccountId || 'N/A'}</div>
                            </div>
                            <button class="btn btn-sm btn-outline-danger"
                                    onclick="handleDeleteAccount('${account.stellarAccountId}')"
                                    ${state.companyAccounts.isDeletingAccount ? 'disabled' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            elements.list.innerHTML = `<div class="list-group">${accountsHtml}</div>`;
            
            // Load avatars asynchronously via SDK (requires authentication like Dart)
            if (state.companyAccounts.accounts.length > 0 && state.sdk) {
                state.companyAccounts.accounts.forEach((account, index) => {
                    if (account.avatarUrl) {
                        const avatarId = `account-avatar-${account.stellarAccountId}-${index}`;
                        const placeholderId = `account-avatar-placeholder-${account.stellarAccountId}-${index}`;
                        const avatarElement = document.getElementById(avatarId);
                        const placeholderElement = document.getElementById(placeholderId);
                        
                        if (avatarElement) {
                            state.sdk.getAvatarUrlBytes(account.avatarUrl)
                                .then(arrayBuffer => {
                                    const blob = new Blob([arrayBuffer]);
                                    const url = URL.createObjectURL(blob);
                                    avatarElement.innerHTML = `<img src="${url}" alt="Avatar" class="account-avatar" />`;
                                    avatarElement.className = 'account-avatar-container';
                                })
                                .catch(error => {
                                    console.warn('Failed to load avatar:', error);
                                    if (avatarElement) avatarElement.style.display = 'none';
                                    if (placeholderElement) placeholderElement.style.display = 'flex';
                                });
                        }
                    }
                });
            }
        } else {
            elements.list.innerHTML = '';
        }
    }

    if (elements.avatarPreview) {
        elements.avatarPreview.innerHTML = state.companyAccounts.selectedImagePreview ? `
            <img src="${state.companyAccounts.selectedImagePreview}" alt="Preview" 
                 class="img-thumbnail" style="max-width: 100px; max-height: 100px;" />
        ` : '';
    }

    if (elements.refreshBtn) {
        elements.refreshBtn.disabled = state.companyAccounts.isLoading;
        elements.refreshBtn.innerHTML = state.companyAccounts.isLoading ? 
            '<i class="fas fa-spinner fa-spin"></i> Refresh' : 
            '<i class="fas fa-redo"></i> Refresh';
    }

    if (elements.createBtn) {
        elements.createBtn.disabled = state.companyAccounts.isCreatingAccount;
        elements.createBtn.innerHTML = state.companyAccounts.isCreatingAccount ? 
            '<i class="fas fa-spinner fa-spin"></i> Creating...' : 
            '<i class="fas fa-plus"></i> Create Account';
    }
}

// Payments Tab
function renderPaymentsTab(state) {
    const container = document.getElementById('payments-tab-content');
    if (!container) return;

    if (!container.innerHTML.trim() || !container.querySelector('#payment-currency-select')) {
        container.innerHTML = tabTemplates['payments'] || '';
    }

    const elements = {
        currencySelect: document.getElementById('payment-currency-select'),
        accountSelect: document.getElementById('payment-account-select'),
        amount: document.getElementById('payment-amount'),
        memo: document.getElementById('payment-memo'),
        maxPayments: document.getElementById('payment-max-payments'),
        webhookUrl: document.getElementById('payment-webhook-url'),
        error: document.getElementById('payment-error-container'),
        result: document.getElementById('payment-result-container'),
        deeplinkBtn: document.getElementById('generate-deeplink-btn'),
        svgQrBtn: document.getElementById('generate-svg-qr-btn'),
        pngQrBtn: document.getElementById('generate-png-qr-btn'),
    };

    // Update selects
    if (elements.currencySelect) {
        elements.currencySelect.innerHTML = '<option value="">-- Select Currency --</option>' +
            state.stellarCurrencies.currencies.map(currency => `
                <option value="${currency.id}" 
                        ${currency.id === state.stellarCurrencies.selectedCurrencyId ? 'selected' : ''}>
                    ${currency.name} (${currency.code})
                </option>
            `).join('');
    }

    if (elements.accountSelect) {
        elements.accountSelect.innerHTML = '<option value="">-- Select Account --</option>' +
            state.companyAccounts.accounts.map(account => `
                <option value="${account.stellarAccountId}"
                        ${account.stellarAccountId === state.companyAccounts.selectedAccount?.stellarAccountId ? 'selected' : ''}>
                    ${account.name?.en || account.name?.vn || 'Unnamed'} (${account.stellarAccountId})
                </option>
            `).join('');
    }

    // Update inputs
    if (elements.amount) elements.amount.value = state.payment.amount || '10.50';
    if (elements.memo) elements.memo.value = state.payment.memo || 'Demo Payment';
    if (elements.maxPayments) elements.maxPayments.value = state.payment.maxPayments || '1';
    if (elements.webhookUrl) elements.webhookUrl.value = state.payment.webhookUrl || '';

    // Update error
    if (elements.error) {
        elements.error.innerHTML = state.payment.error ? `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> Error: ${state.payment.error}
            </div>
        ` : '';
    }

    // Update buttons
    const isGenerating = state.payment.isGeneratingPayment;
    if (elements.deeplinkBtn) {
        elements.deeplinkBtn.disabled = isGenerating;
        elements.deeplinkBtn.innerHTML = isGenerating ? 
            '<i class="fas fa-spinner fa-spin"></i> Generating...' : 
            '<i class="fas fa-link"></i> Generate Deeplink';
    }
    if (elements.svgQrBtn) {
        elements.svgQrBtn.disabled = isGenerating;
        elements.svgQrBtn.innerHTML = isGenerating ? 
            '<i class="fas fa-spinner fa-spin"></i> Generating...' : 
            '<i class="fas fa-qrcode"></i> Generate SVG QR Code';
    }
    if (elements.pngQrBtn) {
        elements.pngQrBtn.disabled = isGenerating;
        elements.pngQrBtn.innerHTML = isGenerating ? 
            '<i class="fas fa-spinner fa-spin"></i> Generating...' : 
            '<i class="fas fa-image"></i> Generate PNG QR Code';
    }

    // Update result
    if (elements.result) {
        if (state.payment.lastPaymentResponse) {
            const response = state.payment.lastPaymentResponse;
            elements.result.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3>
                            <i class="fas fa-check-circle text-success"></i>
                            Payment Generated (${getPaymentResponseType(response)})
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <strong>Response Details:</strong>
                            <pre class="bg-light p-3 rounded"><code>${escapeHtml(JSON.stringify(response, null, 2))}</code></pre>
                        </div>
                        ${response.svgQrCode ? `
                            <div class="mb-3">
                                <strong>QR Code Preview:</strong>
                                <div class="qr-code-container bg-white p-3 rounded text-center" id="svg-qr-preview">
                                </div>
                            </div>
                        ` : ''}
                        ${(response.pngQrCodeBase64String || response.pngQrCodeDataUri) ? `
                            <div class="mb-3">
                                <strong>PNG QR Code Preview:</strong>
                                <div class="qr-code-container bg-white p-3 rounded text-center">
                                    <img src="${response.pngQrCodeDataUri || `data:image/png;base64,${response.pngQrCodeBase64String}`}" 
                                         alt="QR Code" style="max-width: 250px;" />
                                </div>
                            </div>
                        ` : ''}
                        ${response.deeplink ? `
                            <div class="mb-3">
                                <strong>Deeplink:</strong>
                                <div class="input-group">
                                    <input type="text" class="form-control" value="${response.deeplink}" readonly />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" 
                                                onclick="window.open('${response.deeplink}')">
                                            <i class="fas fa-external-link-alt"></i> Open
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            // Render SVG QR code properly (after setting innerHTML to avoid parsing issues)
            if (state.payment.lastPaymentResponse && state.payment.lastPaymentResponse.svgQrCode) {
                const svgPreview = document.getElementById('svg-qr-preview');
                if (svgPreview) {
                    // Use insertAdjacentHTML to safely insert SVG without double-escaping
                    svgPreview.innerHTML = state.payment.lastPaymentResponse.svgQrCode;
                }
            }
        } else {
            elements.result.innerHTML = '';
        }
    }
}

// Helper function to escape HTML (moved to utils.js but kept here for compatibility)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getPaymentResponseType(response) {
    if (response.svgQrCode) return 'SVG QR Code';
    if (response.pngQrCodeBase64String || response.pngQrCodeDataUri) return 'PNG QR Code';
    if (response.deeplink) return 'Deeplink';
    return 'Payment Request';
}

// Event Handlers
function handleToggleCustomSdk(event) {
    const state = store.getState();
    store.setState({ config: { ...state.config, useCustomSdk: event.target.checked } });
    updateSdk();
}

function handleEnvironmentChange(event) {
    const state = store.getState();
    store.setState({ config: { ...state.config, environment: event.target.value } });
    updateSdk();
}

function handleCustomBaseUrlChange(event) {
    const state = store.getState();
    store.setState({ config: { ...state.config, customBaseUrl: event.target.value } });
    updateSdk();
}

function handleApiKeyChange(event) {
    const state = store.getState();
    store.setState({ config: { ...state.config, apiKey: event.target.value } });
    updateSdk();
}

function handleStellarAccountIdChange(event) {
    const state = store.getState();
    store.setState({ config: { ...state.config, stellarAccountId: event.target.value } });
    updateSdk();
}

async function handleRetry() {
    const state = store.getState();
    store.setState({
        stellarCurrencies: { ...state.stellarCurrencies, error: null },
        companyAccounts: { ...state.companyAccounts, error: null },
    });
    await Promise.all([loadStellarCurrencies(), loadCompanyAccounts()]);
}

async function handleRefreshCurrencies() {
    await loadStellarCurrencies();
}

function handleAvatarFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setSelectedImage(file, e.target.result);
    reader.readAsDataURL(file);
}

async function handleCreateAccount() {
    const stellarAccountId = document.getElementById('new-stellar-account-id')?.value;
    const nameEn = document.getElementById('account-name-en')?.value;
    const nameVn = document.getElementById('account-name-vn')?.value;

    if (!stellarAccountId || !nameEn) {
        showAlert('Please fill in Stellar Account ID and English name', 'error');
        return;
    }

    const name = { en: nameEn };
    if (nameVn) name.vn = nameVn;

    const state = store.getState();
    try {
        await createCompanyAccount(stellarAccountId, name, state.companyAccounts.selectedImageFile);
        document.getElementById('new-stellar-account-id').value = '';
        document.getElementById('account-name-en').value = '';
        document.getElementById('account-name-vn').value = '';
        document.getElementById('account-avatar-input').value = '';
        showAlert('Company account created successfully!', 'success');
    } catch (error) {
        showAlert('Failed to create company account: ' + error.message, 'error');
    }
}

async function handleDeleteAccount(stellarAccountId) {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
        await deleteCompanyAccount(stellarAccountId);
        showAlert('Account deleted successfully!', 'success');
    } catch (error) {
        showAlert('Failed to delete account: ' + error.message, 'error');
    }
}

async function handleRefreshAccounts() {
    await loadCompanyAccounts();
}

function handlePaymentCurrencyChange(event) {
    selectCurrency(event.target.value);
}

function handlePaymentAccountChange(event) {
    const state = store.getState();
    const account = state.companyAccounts.accounts.find(a => a.stellarAccountId === event.target.value);
    if (account) selectAccount(account);
}

function handlePaymentAmountChange(event) {
    updatePaymentAmount(event.target.value);
}

function handlePaymentMemoChange(event) {
    updatePaymentMemo(event.target.value);
}

function handlePaymentMaxPaymentsChange(event) {
    updatePaymentMaxPayments(event.target.value);
}

function handlePaymentWebhookUrlChange(event) {
    updatePaymentWebhookUrl(event.target.value);
}

async function handleGenerateDeeplink() {
    await generateDeeplink();
}

async function handleGenerateSvgQrCode() {
    await generateSvgQrCode();
}

async function handleGeneratePngQrCode() {
    await generatePngQrCode();
}


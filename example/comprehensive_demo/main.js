// Main App Initialization
let currentTab = 'setup';
const tabTemplates = {};

// Load HTML templates
async function loadTemplates() {
    const templates = [
        { name: 'setup', file: 'tabs/setup-tab.html' },
        { name: 'stellar-currencies', file: 'tabs/stellar-currencies-tab.html' },
        { name: 'accounts', file: 'tabs/accounts-tab.html' },
        { name: 'payments', file: 'tabs/payments-tab.html' },
    ];

    for (const template of templates) {
        try {
            const response = await fetch(template.file);
            tabTemplates[template.name] = await response.text();
        } catch (error) {
            console.error(`Failed to load template ${template.file}:`, error);
        }
    }
}

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    const activeContent = document.getElementById(`${tabName}-tab-content`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
    
    // Render the active tab
    renderActiveTab();
}

function renderActiveTab() {
    const state = store.getState();
    
    switch (currentTab) {
        case 'setup':
            renderSetupTab(state);
            break;
        case 'stellar-currencies':
            renderStellarCurrenciesTab(state);
            break;
        case 'accounts':
            renderAccountsTab(state);
            break;
        case 'payments':
            renderPaymentsTab(state);
            break;
    }
}

// Subscribe to state changes
store.subscribe((state) => {
    renderActiveTab();
});

// Wait for SDK to be ready (loaded as ES module)
function waitForSdk() {
    return new Promise((resolve) => {
        if (window.BeansMerchantSdk) {
            resolve();
        } else {
            window.addEventListener('sdk-ready', resolve, { once: true });
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for SDK to be loaded
    await waitForSdk();
    
    // Load templates first
    await loadTemplates();
    
    // Initialize SDK with default values (will auto-load currencies and accounts)
    await updateSdk();
    
    // Set up tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.currentTarget.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Initial render
    switchTab('setup');
});


// FooBar Bank - Deposit from Beans App
import { BeansMerchantSdk } from '../../dist/sdk.js';

// Configuration - In a real application, these would come from environment variables or config
const CONFIG = {
    // Use staging environment for demo purposes

    // Demo API key
    apiKey: '2B8F-1D7E-C3A1-9B2D', 
    // FooBar Bank's Stellar account ID (fictional)
    stellarAccountId: 'GCXQCEJD4T56UQVM3432BCUBD4ULYIZUDUFVGYYCZCOLL36UVNNLGBB5',
    // FooBar Bank's account number for memo
    accountNumber: '1234-5678-9012',
    // Default currency ID (same as developer example)
    defaultCurrencyId: 'f2155597-8629-40fd-ba65-7da8b5f837c3'
};

// Stellar memo constraints
const STELLAR_MEMO_MAX_LENGTH = 28;

// Initialize SDK
let sdk;

// Generate memo for Stellar transaction
function generateMemo() {
    const accountNumber = CONFIG.accountNumber;
    
    // Check if account number fits within Stellar memo limit
    if (accountNumber.length <= STELLAR_MEMO_MAX_LENGTH) {
        return accountNumber;
    }
    
    // If account number is too long, generate a shorter identifier
    // In a real application, you might want to use a hash or database mapping
    console.warn(`Account number (${accountNumber.length} chars) exceeds Stellar memo limit (${STELLAR_MEMO_MAX_LENGTH} chars). Using fallback.`);
    
    // Generate a shorter identifier based on account number
    // Remove dashes and take first part
    const shortId = accountNumber.replace(/-/g, '').substring(0, STELLAR_MEMO_MAX_LENGTH);
    return shortId;
}

// DOM elements
const depositForm = document.getElementById('depositForm');
const amountInput = document.getElementById('amount');
const depositBtn = document.getElementById('depositBtn');
const statusMessage = document.getElementById('statusMessage');
const statusText = document.getElementById('statusText');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Initialize the application
async function init() {
    try {
        // Initialize SDK based on environment
        sdk = BeansMerchantSdk.staging(CONFIG.apiKey);

        // Set up form event listeners
        setupEventListeners();
        
        console.log('FooBar Bank deposit system initialized successfully');
        console.log(`Using currency ID: ${CONFIG.defaultCurrencyId}`);
    } catch (error) {
        console.error('Failed to initialize:', error);
        showError('Failed to initialize the deposit system. Please refresh the page.');
    }
}


// Set up event listeners
function setupEventListeners() {
    depositForm.addEventListener('submit', handleDeposit);
    
    // Real-time validation
    amountInput.addEventListener('input', validateAmount);
}

// Handle deposit form submission
async function handleDeposit(event) {
    event.preventDefault();
    
    const amount = parseFloat(amountInput.value);
    
    // Validate inputs
    if (!validateInputs(amount)) {
        return;
    }
    
    try {
        // Show loading state
        setButtonLoading(true);
        showStatus('Generating payment request...');
        
        // Generate deeplink with properly formatted memo
        const memo = generateMemo();
        console.log(`Using memo: "${memo}" (${memo.length} characters)`);
        
        const deeplinkResponse = await sdk.generateDeeplink(
            CONFIG.stellarAccountId,
            CONFIG.defaultCurrencyId,
            amount,
            memo, // Use generated memo (account number or fallback)
            1, // maxAllowedPayments
            null // webhookUrl (optional)
        );
        
        console.log('Deeplink generated:', deeplinkResponse);
        
        // Show success message
        showStatus('Payment request created! Opening Beans app...');
        
        // Open the deeplink
        await openDeeplink(deeplinkResponse.deeplink);
        
        // Reset form after successful deeplink generation
        setTimeout(() => {
            depositForm.reset();
            hideMessages();
            setButtonLoading(false);
        }, 2000);
        
    } catch (error) {
        console.error('Deposit failed:', error);
        showError(`Failed to create payment request: ${error.message}`);
        setButtonLoading(false);
    }
}

// Open deeplink in Beans app
async function openDeeplink(deeplink) {
    try {
        // Check if we're on mobile or desktop
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // On mobile, try to open the app directly
            window.location.href = deeplink;
        } else {
            // On desktop, open in new tab/window
            const newWindow = window.open(deeplink, '_blank');
            
            if (!newWindow) {
                // If popup was blocked, fall back to current window
                window.location.href = deeplink;
            }
        }
        
        // Show instruction message
        setTimeout(() => {
            showStatus('If the Beans app didn\'t open automatically, please check your device or click the link manually.');
        }, 1000);
        
    } catch (error) {
        console.error('Failed to open deeplink:', error);
        showError('Failed to open the Beans app. Please try again.');
    }
}

// Validate form inputs
function validateInputs(amount) {
    // Validate amount
    if (!amount || amount <= 0) {
        showError('Please enter a valid deposit amount greater than $0.00');
        amountInput.focus();
        return false;
    }
    
    if (amount < 0.01) {
        showError('Minimum deposit amount is $0.01');
        amountInput.focus();
        return false;
    }
    
    return true;
}

// Real-time amount validation
function validateAmount() {
    const amount = parseFloat(amountInput.value);
    
    if (amount && amount < 0.01) {
        amountInput.setCustomValidity('Minimum amount is $0.01');
    } else {
        amountInput.setCustomValidity('');
    }
}


// UI Helper functions
function setButtonLoading(loading) {
    if (loading) {
        depositBtn.disabled = true;
        depositBtn.innerHTML = '<span class="loading mr-2"></span>Processing...';
    } else {
        depositBtn.disabled = false;
        depositBtn.innerHTML = '<i class="fas fa-mobile-alt mr-2"></i>Deposit from Beans App';
    }
}

function showStatus(message) {
    statusText.textContent = message;
    statusMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    statusMessage.style.display = 'none';
}

function hideMessages() {
    statusMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle page visibility changes (useful for mobile app switching)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible again, might be returning from Beans app
        console.log('Page became visible - user might have returned from Beans app');
    }
});

// Export for potential external use
window.FooBarBank = {
    init,
    openDeeplink,
    validateInputs
};

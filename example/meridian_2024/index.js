// src/index.js

import { BeansMerchantSdk } from "../../dist/sdk.js";

// Get GET parameters
const apiKey = new URLSearchParams(window.location.search).get('apiKey'); //'XJTO-3LFZ-PQ9M-ZKRV';
const stellarAccountId = new URLSearchParams(window.location.search).get('stellarAccountId'); //'GBH36QD5GJT3BE4K6AWDWMX2VGJXIJPMV7H46ANE5VXN7D4GDRVZSSZV';
const stellarCurrencyId = new URLSearchParams(window.location.search).get('stellarCurrencyId'); //'eb2d2550-4f58-4fff-aef2-72f26b45feb5';

// Initialize the BeansMerchantSdk
const sdk = BeansMerchantSdk.production(apiKey);
// const sdk = BeansMerchantSdk.custom('https://yusuf-beans-1.eu.ngrok.io/v3',apiKey);

// Product information
const product = {
  name: 'Delicious Coffee',
  price: 0.01, // Price per unit in USD
  // price: 5.01, // Price per unit in USD
  quantity: 1, // Default quantity
};

let pollingIntervalId = null; // To store the interval ID
let paymentRequestId = null; // To store the payment request ID

document.addEventListener('DOMContentLoaded', () => {
  // Set the images' sources
  document.querySelector('.product-image').src = './assets/cup.png';
  document.querySelector('.logo').src = './assets/beans_logo.png';
  document.querySelector('.meridian-logo').src = './assets/meridian_2024_logo.png';
  document.getElementById('checkmarkImage').src = './assets/checkmark.png';

  // Set initial total price
  updateTotalPrice();

  // Add event listeners for quantity controls
  document.getElementById('increaseButton').addEventListener('click', increaseQuantity);
  document.getElementById('decreaseButton').addEventListener('click', decreaseQuantity);
  document.getElementById('buyButton').addEventListener('click', generateQrCode);

  // Add event listeners for Cancel and Done buttons
  document.getElementById('cancelButton').addEventListener('click', resetApplication);
  document.getElementById('doneButton').addEventListener('click', resetApplication);
});

function updateTotalPrice() {
  const totalPrice = (product.price * product.quantity).toFixed(2);
  document.querySelectorAll('.total-price').forEach((element) => {
    element.textContent = `Total: $${totalPrice}`;
  });
  document.getElementById('quantity').textContent = product.quantity;
}

function increaseQuantity() {
  product.quantity += 1;
  updateTotalPrice();
}

function decreaseQuantity() {
  if (product.quantity > 1) {
    product.quantity -= 1;
    updateTotalPrice();
  }
}

function generateQrCode() {
  const amount = (product.price * product.quantity).toFixed(2);
  const orderId = `INV${Date.now()}`;

  sdk
    .generateSvgQrCode(
      stellarAccountId,
      stellarCurrencyId,
      amount,
      orderId
    )
    .then((qrCode) => {
      // Hide the purchase section (quantity controls and Buy Now button)
      document.getElementById('purchase-section').style.display = 'none';
      // Update the total price in the QR code container
      document.querySelector('#qrCodeContainer .total-price').textContent = `Total: $${amount}`;
      // Show the QR code container
      document.getElementById('qrCodeContainer').style.display = 'block';
      // Set the QR code SVG
      document.getElementById('qrCode').innerHTML = qrCode.svgQrCode;
      // Show the Cancel button
      document.getElementById('cancelButton').style.display = 'block';

      // Store the paymentRequestId
      paymentRequestId = qrCode.id;

      // Start polling for payment status
      startPollingPaymentStatus();
    })
    .catch((error) => {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code.');
    });
}

function startPollingPaymentStatus() {
  pollingIntervalId = setInterval(() => {
    sdk
      .getPaymentRequestStatus(paymentRequestId)
      .then((response) => {
        if (response.status === 'Completed') {
          // Payment is completed
          clearInterval(pollingIntervalId);
          pollingIntervalId = null;
          showSuccessMessage();
        }
      })
      .catch((error) => {
        console.error('Error checking payment status:', error);
      });
  }, 500); // Poll every 500ms
}

function showSuccessMessage() {
  // Hide the QR code container and Cancel button
  document.getElementById('qrCodeContainer').style.display = 'none';
  document.getElementById('cancelButton').style.display = 'none';

  // Show the success message container
  document.getElementById('successContainer').style.display = 'block';
}

function resetApplication() {
  // Clear the polling interval if it's still running
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }

  // Reset the paymentRequestId
  paymentRequestId = null;

  // Hide QR code container, success container, and buttons
  document.getElementById('qrCodeContainer').style.display = 'none';
  document.getElementById('successContainer').style.display = 'none';
  document.getElementById('cancelButton').style.display = 'none';
  document.getElementById('doneButton').style.display = 'none';

  // Reset quantity and total price
  product.quantity = 1;
  updateTotalPrice();

  // Show the purchase section
  document.getElementById('purchase-section').style.display = 'block';
}
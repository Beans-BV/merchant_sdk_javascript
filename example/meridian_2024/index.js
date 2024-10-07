// src/index.js

import { BeansMerchantSdk } from "../../dist/sdk.js";

// Get GET parameters
const apiKey = new URLSearchParams(window.location.search).get("apiKey");
const stellarAccountId = new URLSearchParams(window.location.search).get(
  "stellarAccountId"
);
const stellarCurrencyId = new URLSearchParams(window.location.search).get(
  "stellarCurrencyId"
);
const price = new URLSearchParams(window.location.search).get("price");

// Initialize the BeansMerchantSdk
const sdk = BeansMerchantSdk.production(apiKey);

// Product information
const product = {
  name: "Premium Coffee",
  price: price ?? 5.0, // Price per unit in USD
  quantity: 1, // Default quantity
};

let pollingIntervalId = null; // To store the interval ID
let paymentRequestId = null; // To store the payment request ID

document.addEventListener("DOMContentLoaded", () => {
  // Set the images' sources
  document
    .querySelectorAll(".product-image")
    .forEach((e) => (e.src = "./assets/coffee2.png"));
  document
    .querySelectorAll(".logo")
    .forEach((e) => (e.src = "./assets/notes_logo_black.png"));
  document
    .querySelectorAll(".meridian-x-beans-logo")
    .forEach((e) => (e.src = "./assets/meridian_x_beans.png"));
  document.getElementById("checkmarkImage").src = "./assets/checkmark.png";

  // Set initial total price
  updateTotal();

  // Add event listeners for quantity controls
  document
    .getElementById("increaseButton")
    .addEventListener("click", increaseQuantity);
  document
    .getElementById("decreaseButton")
    .addEventListener("click", decreaseQuantity);
  document
    .getElementById("buyButton")
    .addEventListener("click", generateQrCode);

  // Add event listeners for Cancel and Done buttons
  document
    .getElementById("cancelButton")
    .addEventListener("click", resetApplication);
  document
    .getElementById("doneButton")
    .addEventListener("click", resetApplication);
});

function updateTotal() {
  document.getElementById("product-amount").textContent = product.quantity;

  const totalPrice = (product.price * product.quantity).toFixed(2);
  document.querySelectorAll(".total-price").forEach((element) => {
    element.textContent = `Proceed - $${totalPrice}`;
  });
  document.getElementById("quantity").textContent = product.quantity;
}

function increaseQuantity() {
  product.quantity += 1;
  updateTotal();
}

function decreaseQuantity() {
  if (product.quantity > 1) {
    product.quantity -= 1;
    updateTotal();
  }
}
function generateQrCode() {
  const amount = (product.price * product.quantity).toFixed(2);
  const orderId = `INV${Date.now()}`;
  document
    .querySelectorAll(".order-id")
    .forEach((e) => (e.textContent = orderId));

  sdk
    .generateSvgQrCode(stellarAccountId, stellarCurrencyId, amount, orderId)
    .then((qrCode) => {
      // Hide the purchase section and footer
      document.getElementById("purchase-section").style.display = "none";
      document.getElementById("proceed-container").style.display = "none";

      // Update the total price in the QR code container
      document.querySelector(
        "#qrCodeContainer .total-price"
      ).textContent = `Total: $${amount}`;

      // Get CSS variables for colors
      const rootStyles = getComputedStyle(document.documentElement);
      const qrForegroundColor = rootStyles
        .getPropertyValue("--on-background")
        .trim();
      const qrBackgroundColor = rootStyles
        .getPropertyValue("--background")
        .trim();

      // Replace colors in the SVG
      const customizedSvg = qrCode.svgQrCode
        .replaceAll("#000000", qrForegroundColor)
        .replaceAll("#FFFFFF", qrBackgroundColor);

      // Set the QR code SVG
      document.getElementById("qrCode").innerHTML = customizedSvg;

      // Show the QR code container and Cancel button
      document.getElementById("qrCodeContainer").style.display = "block";
      document.getElementById("cancelButton").style.display = "block";

      // Store the paymentRequestId
      paymentRequestId = qrCode.id;

      // Start polling for payment status
      startPollingPaymentStatus();
    })
    .catch((error) => {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code.");
    });
}

function startPollingPaymentStatus() {
  pollingIntervalId = setInterval(() => {
    sdk
      .getPaymentRequestStatus(paymentRequestId)
      .then((response) => {
        if (response.status === "Completed") {
          // Payment is completed
          clearInterval(pollingIntervalId);
          pollingIntervalId = null;
          showSuccessMessage();
        }
      })
      .catch((error) => {
        console.error("Error checking payment status:", error);
      });
  }, 500); // Poll every 500ms
}

function showSuccessMessage() {
  // Hide the QR code container and Cancel button
  document.getElementById("qrCodeContainer").style.display = "none";
  document.getElementById("cancelButton").style.display = "none";

  // Show the success message container
  document.getElementById("successContainer").style.display = "block";
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
  document.getElementById("qrCodeContainer").style.display = "none";
  document.getElementById("successContainer").style.display = "none";

  // Reset quantity and total price
  product.quantity = 1;
  updateTotal();

  // Show the purchase section
  document.getElementById("purchase-section").style.display = "block";
  document.getElementById("footer-container").style.display = "flex";
  document.getElementById("proceed-container").style.display = "block";
}

import { BeansMerchantSdk } from "../../dist/sdk.js";
import Constants from "./constants.js";

const apiKeyInput = Constants.ekoEbooksApiKey;
const stellarAccountId = Constants.ekoEbooksStellarAccountId;
const stellarCurrencyId = Constants.ngnStellarCurrencyId;

let amountInput = 0; // Gets updated later
let sdk = BeansMerchantSdk.production(apiKeyInput);

document
  .getElementById("btnGenerateQR")
  .addEventListener("click", generateQrCode);

document
  .getElementById("backArrow")
  .addEventListener("click", function () {
    window.location.href = "index.html";
  });

document.getElementById("qrCode").addEventListener("click", function () {
  qrCodeContainer.style.display = "none";
  document.getElementById("paymentReceivedContainer").style.display =
    "block";
});

function generateQrCode() {
  if (!sdk) {
    alert("Please initialize the SDK first");
    return;
  }

  // Show loading indicator
  const qrCodeContainer = document.getElementById("qrCodeContainer");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const qrCodeElement = document.getElementById("qrCode");

  document.getElementById("checkout-container").style.display = "none";
  qrCodeContainer.style.display = "none";
  loadingIndicator.style.display = "block";
  qrCodeElement.style.display = "none";

  // Generate orderId using current timestamp
  const orderId = "00" + Date.now();

  sdk
    .generateSvgQrCode(
      stellarAccountId,
      stellarCurrencyId,
      amountInput,
      orderId,
      null,
      null
    )
    .then((qrCode) => {
      qrCodeContainer.style.display = "block";
      loadingIndicator.style.display = "none";
      qrCodeElement.style.display = "block";

      qrCodeElement.innerHTML = qrCode.svgQrCode
        .replaceAll("#FFFFFF", "#1a191e")
        .replaceAll("#000000", "#FFFFFF");

      document.querySelector(".seller-name").textContent =
        "EkoEbooks Payments United States";
      document.querySelector(".total-amount").textContent =
        formatCurrency(amountInput);
      document.querySelector(".order-id").textContent = orderId;

      setTimeout(() => {
        qrCodeContainer.style.display = "none";
        document.getElementById(
          "paymentReceivedContainer"
        ).style.display = "block";
      }, 22000);
    })
    .catch((error) => {
      loadingIndicator.style.display = "none";
      qrCodeContainer.style.display = "none";
      document.getElementById("checkout-container").style.display =
        "block";
      alert("Error generating QR code:", error);
    });
}

function formatCurrency(amount) {
  return "₦" + amount.toLocaleString();
}

// Update order total based on amountInput
function updateOrderTotal() {
  amountInput = book.price * book.quantity;
  document.getElementById("orderTotal").textContent =
    formatCurrency(amountInput);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("backArrow").addEventListener("click", function () {
    window.location.href = "index.html";
  });

  // Populate book info in the checkout page
  document.getElementById("orderItems").textContent = formatCurrency(
    book.quantity * book.price
  );
  document.getElementById("orderTotal").textContent = formatCurrency(
    book.quantity * book.price
  );

  // Update order total with amountInput
  updateOrderTotal();
});
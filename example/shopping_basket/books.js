// Define the book object
const book = {
  title: "Blockchain Basics: A Non-Technical Introduction in 25 Steps",
  price: 32500,
  seller: "Eko Ebooks",
  stockStatus: "In stock",
  imageUrl: "./assets/book.jpg",
  quantity: 1,
};

// Function to populate book information
function populateBookInfo() {
  document.getElementById("bookTitle").textContent = book.title;
  document.getElementById("bookPrice").textContent = formatCurrency(book.price);
  document.getElementById("bookPricePerPiece").textContent = `(${formatCurrency(book.price)} / piece)`;
  document.getElementById("bookSeller").textContent = book.seller;
  document.getElementById("bookStockStatus").textContent = book.stockStatus;
  document.getElementById("bookImage").src = book.imageUrl;
  document.getElementById("bookQuantity").textContent = `Quantity: ${book.quantity}`;
  document.getElementById("cardSubtotal").textContent = formatCurrency(book.price * book.quantity);
  document.getElementById("rightColumnSubtotal").textContent = formatCurrency(book.price * book.quantity);
  document.getElementsByClassName("itemcount").textContent = `${book.quantity}`;
  document.querySelectorAll(".itemcount").forEach((e) => {
    e.textContent = `${book.quantity}`;
  });
}

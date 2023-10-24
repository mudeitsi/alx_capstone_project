// Element references
const balance = document.getElementById("balance");
const inflow = document.getElementById("income");
const outflow = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Fetch transactions from local storage
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

// Initialize transactions array
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();

  // Validate input fields
  if (text.value.trim() === "" || amount.value.trim() === "") {
    document.getElementById("error_msg").innerHTML = "<span>Error: Please enter transaction description and amount</span>";
    setTimeout(() => (document.getElementById("error_msg").innerHTML = ""), 3000);
  } else {
    // Create transaction object
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    // Add transaction to transactions array
    transactions.push(transaction);

    // Update UI with new transaction
    addTransactionDOM(transaction);

    // Recalculate and update balance, income, and expense
    updateValues();

    // Update local storage
    updateLocalStorage();

    // Clear input fields
    text.value = "";
    amount.value = "";
  }
}

// Function to generate a random transaction ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add each transaction to history
function addTransactionDOM(transaction) {
  // Determine transaction type (positive/negative)
  const sign = transaction.amount < 0 ? "-" : "+";

  // Create new list item
  const item = document.createElement("li");

  // Add class based on transaction type
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  // Populate list item and append to list
  item.innerHTML = `${transaction.text} ${sign}${Math.abs(transaction.amount)} <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>`;
  list.appendChild(item);
}

// Function to update balance, inflow, and outflow values
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((bal, value) => (bal += value), 0).toFixed(2);
  const income = amounts.filter(value => value > 0).reduce((bal, value) => (bal += value), 0).toFixed(2);
  const expense = amounts.filter(value => value < 0).reduce((bal, value) => (bal += value), 0) * -(1).toFixed(2);

  // Update UI elements with new values
  balance.innerText = `$${total}`;
  inflow.innerText = `$${income}`;
  outflow.innerText = `$${expense}`;
}

// Function to remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  // Update local storage
  updateLocalStorage();

  // Refresh application
  start();
}

// Function to update transactions in local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initial function to start the application
function start() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Initialize the application
start();

// Event Listener for adding transactions
form.addEventListener("submit", addTransaction);


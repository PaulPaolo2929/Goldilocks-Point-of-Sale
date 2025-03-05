
    function loadCashTotal() {
      // Retrieve the string from localStorage (or null if not set)
      const storedAmount = localStorage.getItem("cashTotal");
      console.log("storedAmount:", storedAmount);  // For debugging

      // If null (not set) or empty, show "No Cash Available"
      if (!storedAmount) {
        document.getElementById("cashTotal").textContent = "No Cash Available";
        return;
      }

      // Convert the string to a number
      const numericAmount = parseFloat(storedAmount);
      console.log("numericAmount:", numericAmount); // For debugging

      // If parseFloat failed (NaN), also show "No Cash Available"
      if (isNaN(numericAmount)) {
        document.getElementById("cashTotal").textContent = "No Cash Available";
        return;
      }

      // If numericAmount is exactly 0
      if (numericAmount === 0) {
        document.getElementById("cashTotal").textContent = "₱0.00";
      } else {
        // Otherwise, display it as currency with 2 decimals
        document.getElementById("cashTotal").textContent =
          "₱" + numericAmount.toFixed(2);
      }
    }

    // Example usage:
    // localStorage.setItem("cashTotal", "0");     // string "0"
    // localStorage.setItem("cashTotal", "50.75"); // string "50.75"
    // localStorage.setItem("cashTotal", "abc");   // test invalid

    // Run the function on page load
    document.addEventListener("DOMContentLoaded", loadCashTotal);
  

window.onload = loadCashTotal;

// Receipt Updater
function updateReceipt1() {
  let customerName = document.getElementById("r-Customer")?.value || ""; // Ensure element exists
  let amountPaid = document.getElementById("AmountPaid")?.value || "0.00"; // Ensure element exists
  let receiptNumber = document.getElementById("Product-Code")?.value || "";

  // ✅ Update the display elements correctly
  document.getElementById("Customer-name").innerText = customerName;
  document.getElementById("r-paid").innerText = `${parseFloat(
    amountPaid
  ).toFixed(2)}`;
  document.getElementById("r-number").innerText = receiptNumber; // ✅ Fixed to display receipt number

  // ✅ Save to localStorage
  localStorage.setItem("customerName", customerName);
  localStorage.setItem("amountPaid", amountPaid);
  localStorage.setItem("receiptNumber", receiptNumber);
}

document.addEventListener("DOMContentLoaded", function () {
  let checkoutButton = document.getElementById("checkOut-btn");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", checkout);
  }
});

function checkout() {
  // 1️⃣ Get input values
  let customerName = document.getElementById("r-Customer").value.trim();
  let amountPaid =
    parseFloat(document.getElementById("AmountPaid").value.trim()) || 0;
  let grandTotal = parseFloat(updateGrandTotal());

  // 2️⃣ Validate fields
  if (customerName === "") {
    alert("Please enter the customer name.");
    return;
  }
  if (amountPaid < grandTotal) {
    alert("Insufficient amount paid.");
    return;
  }

  updateReceipt1();
  printReceipt();
  updateCashTotal(grandTotal);

  // 5️⃣ Clear cart and reset fields
  setTimeout(() => {
    localStorage.removeItem("cart");
    document.querySelector(".product-table tbody").innerHTML = ""; // Clear cart table
    // Clear receipt table
    document.querySelector(".receipt-items-container .items tbody").innerHTML =
      "";
    // Update receipt display to reflect the cleared cart

    resetCheckoutFields();
    alert("Checkout successful!");
    updateReceipt();
  }, 1000); // Delay clearing fields for 1 second to allow printing
}

// Function to update cash total
function updateCashTotal(grandTotal) {
  let cashTotal = parseFloat(localStorage.getItem("cashTotal")) || 0;
  cashTotal += grandTotal;

  localStorage.setItem("cashTotal", cashTotal.toFixed(2)); // Update storage
  document.getElementById("cashTotal").textContent = `₱${cashTotal.toFixed(2)}`; // Update UI
}

function resetCheckoutFields() {
  document.getElementById("r-Customer").value = "";
  document.getElementById("Product-Code").value = "";
  document.getElementById("AmountPaid").value = "";
  document.getElementById("changeAmount").textContent = "₱0.00";
  document.getElementById("r-change").textContent = "₱0.00";

  // Clear displayed receipt details
  document.getElementById("Customer-name").innerText = "";
  document.getElementById("r-number").value = "";
  document.getElementById("r-paid").innerText = "0.00";
  document.getElementById("r-number").innerText = "";
  document.getElementById("r-change").innerText = "0.00";
  document.getElementById("changeAmount").textContent = "₱0.00";
  document.getElementById("changeTotal").textContent = "₱0.00";

  // Clear change breakdown table
  let tableBody = document.getElementById("denominationTable");
  tableBody.innerHTML = "";

  // Clear stored data in localStorage
  localStorage.removeItem("customerName");
  localStorage.removeItem("amountPaid");
  localStorage.removeItem("receiptNumber");
  localStorage.removeItem("changeAmount");
  localStorage.removeItem("changeBreakdown");

  // Re-render UI changes
  updateGrandTotal();
}

// Trigger update when amount paid is entered
document
  .getElementById("AmountPaid")
  ?.addEventListener("input", updateReceipt1);

// Date and TIME Update
function updateDateTime() {
  let currentDate = new Date();

  // Formatting options
  let dateOptions = { year: "numeric", month: "long", day: "numeric" };
  let timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Select all elements with class "date" and update them
  document.querySelectorAll(".date").forEach((el) => {
    el.innerHTML = currentDate.toLocaleDateString("en-US", dateOptions);
  });

  // Select all elements with class "time" and update them
  document.querySelectorAll(".time").forEach((el) => {
    el.innerHTML = currentDate.toLocaleTimeString("en-US", timeOptions);
  });
}

// Call the function once initially
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);

// ================ Product table script========
document.addEventListener("DOMContentLoaded", function () {
  loadCartData();

  // ✅ Load saved receipt data (customer name, amount paid, receipt number)
  let savedCustomerName = localStorage.getItem("customerName") || "";
  let savedAmountPaid = localStorage.getItem("amountPaid") || "0.00";
  let savedReceiptNumber = localStorage.getItem("receiptNumber") || "";
  let savedChange = localStorage.getItem("changeAmount") || "0.00";
  let savedChangeBreakdown =
    JSON.parse(localStorage.getItem("changeBreakdown")) || [];

  document.getElementById("r-Customer").value = savedCustomerName;
  document.getElementById("AmountPaid").value = savedAmountPaid;
  document.getElementById("Product-Code").value = savedReceiptNumber;

  document.getElementById("Customer-name").innerText = savedCustomerName;
  document.getElementById("r-paid").innerText = `${parseFloat(
    savedAmountPaid
  ).toFixed(2)}`;
  document.getElementById("r-number").innerText = savedReceiptNumber;
  document.getElementById("changeAmount").textContent = `₱${savedChange}`;
  document.getElementById("changeTotal").textContent = `₱${savedChange}`;
  document.getElementById("r-change").textContent = `₱${savedChange}`;

  // ✅ Load and update the change breakdown table
  let tableBody = document.getElementById("denominationTable");
  tableBody.innerHTML = ""; // Clear existing rows

  savedChangeBreakdown.forEach(({ denomination, quantity }) => {
    let row = `<tr><td>₱${denomination}</td><td>${quantity}</td></tr>`;
    tableBody.innerHTML += row;
  });

  updateGrandTotal(); // ✅ Update total kapag ni-load ang page
});

// ✅ Load Cart from LocalStorage & Auto Update Total
function loadCartData() {
  let savedCart = localStorage.getItem("cart");
  if (savedCart) {
    let cart = JSON.parse(savedCart);
    let tableBody = document.querySelector(".product-table tbody");
    tableBody.innerHTML = ""; // Clear existing table rows

    cart.forEach((item, index) => {
      let total = item.price * item.quantity;

      let row = document.createElement("tr");
      row.dataset.index = index; // Store index for tracking
      row.innerHTML = `
                <td><button class="delete-btn">❌</button></td>
                <td><input type="number" value="${
                  item.quantity
                }" min="1" class="quantity-input"></td>
                <td>Pcs</td>
                <td>${item.name}</td>
                <td>P${item.price.toFixed(2)}</td>
                <td>P${total.toFixed(2)}</td>
            `;
      tableBody.appendChild(row);
    });

    updateGrandTotal(); // ✅ Automatically update total after loading cart

    setupEventListeners(); // ✅ Attach event listeners for future updates
    updateReceipt(); // ✅ Update receipt display
  }
}

// ✅ **Remove Item from Cart**
function removeRow(button) {
  let row = button.closest("tr");
  let index = row.dataset.index;
  row.remove();

  let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  savedCart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(savedCart));

  updateGrandTotal();
  updateReceipt(); // ✅ Update receipt after removing item
}

// ✅ **Update Quantity and Total**
function updateQuantity(input) {
  let row = input.closest("tr");
  let price = parseFloat(row.children[4].textContent.replace("P", ""));
  let quantity = parseInt(input.value);
  let total = price * quantity;
  row.children[5].textContent = `P${total.toFixed(2)}`;

  let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  let index = row.dataset.index;
  if (savedCart[index]) savedCart[index].quantity = quantity;
  localStorage.setItem("cart", JSON.stringify(savedCart));

  updateGrandTotal();
  updateReceipt(); // ✅ Update receipt after modifying quantity
}

// ✅ **Update Receipt Table**
function updateReceipt() {
  let receiptTableBody = document.querySelector(
    ".receipt-items-container .items tbody"
  );
  receiptTableBody.innerHTML = ""; // Clear previous data, but keep headers

  document.querySelectorAll(".product-table tbody tr").forEach((row) => {
    let itemName = row.children[3].textContent; // Product name
    let itemQty = row.children[1].querySelector("input").value; // Quantity
    let itemPrice = row.children[4].textContent; // Unit price
    let itemTotal = row.children[5].textContent; // Total price

    let receiptRow = document.createElement("tr");
    receiptRow.innerHTML = `
            <td>${itemName}</td>
            <td>${itemQty}</td>
            <td>${itemPrice}</td>
            <td>${itemTotal}</td>
        `;
    receiptTableBody.appendChild(receiptRow);
  });
}

// ✅ **Update Receipt Table**
function updateGrandTotal() {
  let total = 0;

  document.querySelectorAll(".product-table tbody tr").forEach((row) => {
    let priceText = row.children[5]?.textContent.trim().replace("P", ""); // Get the 6th column (index 5)

    if (!priceText || isNaN(parseFloat(priceText))) {
      console.error("Invalid price in row:", row);
      return;
    }

    let itemTotal = parseFloat(priceText);
    total += itemTotal;
  });

  let formattedTotal = total.toFixed(2);

  document.querySelectorAll(".grand-total-amount").forEach((element) => {
    element.textContent = `₱${formattedTotal}`;
  });

  console.log("Calculated Grand Total:", formattedTotal); // Debug log

  return parseFloat(formattedTotal); // Ensure a valid number is returned
}

// ✅ **Attach Event Listeners**
function setupEventListeners() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("input", function () {
      updateQuantity(this);
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      removeRow(this);
    });
  });
}

// =================Change generator using functinal Programming (Change recommended Denomination)=============
const denominations = [500, 200, 100, 50, 20, 10, 5, 1];

const getChangeBreakdown = (change) =>
  denominations.reduce((acc, denom) => {
    const count = Math.floor(change / denom);
    if (count > 0) {
      acc.push({ denomination: denom, quantity: count });
      change -= count * denom;
    }
    return acc;
  }, []);

function calculateChange() {
  const amountPaidInput = document.getElementById("AmountPaid").value.trim();
  const amountPaid = parseFloat(amountPaidInput);

  if (isNaN(amountPaid) || amountPaidInput === "") {
    alert("Please enter a valid amount paid.");
    return;
  }

  const grandTotal = parseFloat(updateGrandTotal());

  if (isNaN(grandTotal)) {
    alert("Error calculating the grand total. Please check your data.");
    return;
  }

  if (amountPaid < grandTotal) {
    alert("Insufficient amount paid.");
    return;
  }

  let change = amountPaid - grandTotal;

  // ✅ Save change amount to localStorage before displaying it
  localStorage.setItem("changeAmount", change.toFixed(2));

  document.getElementById("changeAmount").textContent = `₱${change.toFixed(2)}`;
  document.getElementById("changeTotal").textContent = `₱${change.toFixed(2)}`;
  document.getElementById("r-change").textContent = `${change.toFixed(2)}`;

  let cashDrawer = JSON.parse(localStorage.getItem("cashDrawerData")) || [];

  // Get available denominations in descending order
  const availableDenominations = [500, 200, 100, 50, 20, 10, 5, 1];
  let changeBreakdown = [];

  for (let denom of availableDenominations) {
    // Find matching denomination in cash drawer
    let index = cashDrawer.findIndex((entry) => entry.denomination === denom);

    if (index !== -1) {
      let count = Math.min(Math.floor(change / denom), cashDrawer[index].count);

      if (count > 0) {
        let deductedAmount = count * denom;
        change -= deductedAmount;
        change = parseFloat(change.toFixed(2)); // Avoid floating point errors

        changeBreakdown.push({ denomination: denom, quantity: count });
        cashDrawer[index].count -= count;

        // Remove if zero
        if (cashDrawer[index].count === 0) {
          cashDrawer[index].count = 0;
        }
      }
    }

    if (change === 0) break;
  }

  if (change > 0) {
    alert("Not enough denominations available to give exact change.");
    return;
  }

  // Save updated cash drawer
  localStorage.setItem("cashDrawerData", JSON.stringify(cashDrawer));
  localStorage.setItem("changeBreakdown", JSON.stringify(changeBreakdown)); // ✅ Save change breakdown
  window.dispatchEvent(new Event("storage"));

  // Update the table with the new breakdown

  let tableBody = document.getElementById("denominationTable");
  tableBody.innerHTML = "";

  changeBreakdown.forEach(({ denomination, quantity }) => {
    let row = `<tr><td>₱${denomination}</td><td>${quantity}</td></tr>`;
    tableBody.innerHTML += row;
  });

  // Re-render the cash drawer
  renderTable(cashDrawer);
}

// ===========Receipt code generator===========
function generateReceiptNumber() {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // Generate 5-digit number
  const receiptNumber = `RCPT-${randomNum}`;

  document.getElementById("Product-Code").value = receiptNumber;
  updateReceipt1(); // ✅ Update receipt details when new number is generated
}

// =================Printing Receipt===============
function printReceipt() {
  updateReceipt1(); // Update first

  setTimeout(() => {
    window.print(); // Print AFTER update
  });
}

// ===================When you switch to the Cashier Page (index.html), the script retrieves the stored data and updates the "Current Cash Drawer" table.=============
document.addEventListener("DOMContentLoaded", function () {
  function renderCashDrawerTable() {
    const breakdown = JSON.parse(localStorage.getItem("cashDrawerData")) || [];
    const tableBody = document.getElementById("cashDrawerBodyProduct");

    if (breakdown.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='3' style='text-align: center;'>No cash available</td></tr>";
      return;
    }

    tableBody.innerHTML = breakdown
      .map(
        (row) =>
          `<tr>
                <td>${row.denomination}</td>
                <td>${row.count}</td>
                <td>${(row.denomination * row.count).toFixed(2)}</td>
            </tr>`
      )
      .join("");
  }

  renderCashDrawerTable();
});

// ===================receipt table placeholder================

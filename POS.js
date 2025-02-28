
// Receipt Updater
function updateReceipt1() {
    let customerName = document.getElementById("r-Customer")?.value || ""; // Ensure element exists
    let amountPaid = document.getElementById("AmountPaid")?.value || "0.00"; // Ensure element exists
    let receiptNumber = document.getElementById("Product-Code")?.value || ""; 

    // ✅ Update the display elements correctly
    document.getElementById("Customer-name").innerText = customerName;
    document.getElementById("r-paid").innerText = `${parseFloat(amountPaid).toFixed(2)}`;
    document.getElementById("r-number").innerText = receiptNumber; // ✅ Fixed to display receipt number
}

// Trigger update when amount paid is entered
document.getElementById("AmountPaid")?.addEventListener("input", updateReceipt1);

// Date and TIME Update
function updateDateTime() {
    let currentDate = new Date();

    // Formatting options
    let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    // Select all elements with class "date" and update them
    document.querySelectorAll('.date').forEach(el => {
        el.innerHTML = currentDate.toLocaleDateString('en-US', dateOptions);
    });

    // Select all elements with class "time" and update them
    document.querySelectorAll('.time').forEach(el => {
        el.innerHTML = currentDate.toLocaleTimeString('en-US', timeOptions);
    });
}

// Call the function once initially
updateDateTime();

// Update every second
setInterval(updateDateTime, 1000);

function cashDrawerRandomizer() {
    const denominations = [500, 200, 100, 50, 20, 10, 5, 1, 0.25];

    function getDenominationBreakdown(totalAmount) {
        let remainingAmount = totalAmount;
        return denominations.map(denomination => {
            if (remainingAmount <= 0) return { denomination, count: 0 };
            let maxCount = Math.floor(remainingAmount / denomination);
            let count = maxCount > 0 ? Math.floor(Math.random() * (maxCount + 1)) : 0;
            remainingAmount -= count * denomination;
            remainingAmount = parseFloat(remainingAmount.toFixed(2));
            return { denomination, count };
        }).filter(entry => entry.count > 0);
    }

    function renderTable(breakdown) {
        const tableBody = document.getElementById("cashDrawerBody");
        tableBody.innerHTML = breakdown.map(row =>
            `<tr><td>${row.denomination}</td><td>${row.count}</td><td>${(row.denomination * row.count).toFixed(2)}</td></tr>`
        ).join('');
    }

    function handleGenerateAuto() {
        const totalAmount = parseFloat(document.getElementById("totalAmount").value);
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Please enter a valid total amount.");
            return;
        }
        const breakdown = getDenominationBreakdown(totalAmount);
        renderTable(breakdown);
    }

    function openManualPanel() {
        const manualPanel = document.getElementById("manualPanel");
        const manualInputs = document.getElementById("manualInputs");
        manualInputs.innerHTML = "";

        denominations.forEach(denomination => {
            const div = document.createElement("div");
            div.innerHTML = `
                <label>${denomination}: </label>
                <input type="number" min="0" id="input-${denomination}" value="0">
            `;
            manualInputs.appendChild(div);
        });

        manualPanel.classList.remove("hidden");
    }

    function closeManualPanel() {
        document.getElementById("manualPanel").classList.add("hidden");
    }

    function handleManualSubmit() {
        let totalAmount = 0;
        const breakdown = denominations.map(denomination => {
            const count = parseInt(document.getElementById(`input-${denomination}`).value) || 0;
            const amount = count * denomination;
            totalAmount += amount;
            return { denomination, count };
        }).filter(entry => entry.count > 0);

        document.getElementById("totalAmount").value = totalAmount.toFixed(2); // Update totalAmount input
        renderTable(breakdown);
        closeManualPanel();
    }

    // Event Listeners
    document.getElementById("generateAuto").addEventListener("click", handleGenerateAuto);
    document.getElementById("manualInputBtn").addEventListener("click", openManualPanel);
    document.getElementById("submitManual").addEventListener("click", handleManualSubmit);
    document.getElementById("closePanel").addEventListener("click", closeManualPanel);
}

// Initialize the functionality
cashDrawerRandomizer();



// ================ Product table script========
document.addEventListener("DOMContentLoaded", function () {
    loadCartData();
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
                <td><input type="number" value="${item.quantity}" min="1" class="quantity-input"></td>
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
    let receiptTableBody = document.querySelector(".receipt-items-container .items tbody");
    receiptTableBody.innerHTML = ""; // Clear previous data, but keep headers

    document.querySelectorAll(".product-table tbody tr").forEach(row => {
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

    document.querySelectorAll(".product-table tbody tr").forEach(row => {
        let priceText = row.children[5]?.textContent.trim().replace("P", ""); // Get the 6th column (index 5)

        if (!priceText || isNaN(parseFloat(priceText))) {
            console.error("Invalid price in row:", row);
            return;
        }

        let itemTotal = parseFloat(priceText);
        total += itemTotal;
    });

    let formattedTotal = total.toFixed(2);
    
    document.querySelectorAll(".grand-total-amount").forEach(element => {
        element.textContent = `₱${formattedTotal}`;
    });

    console.log("Calculated Grand Total:", formattedTotal); // Debug log

    return parseFloat(formattedTotal); // Ensure a valid number is returned

    
}


// ✅ **Attach Event Listeners**
function setupEventListeners() {
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("input", function () {
            updateQuantity(this);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
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
        console.log("Grand Total from updateGrandTotal():", grandTotal); // Debug log
    
        if (isNaN(grandTotal)) {
            alert("Error calculating the grand total. Please check your data.");
            return;
        }
    
        if (amountPaid < grandTotal) {
            alert("Insufficient amount paid.");
            return;
        }
    
        let change = amountPaid - grandTotal;
        
        document.getElementById("changeAmount").textContent = `₱${change.toFixed(2)}`;
        document.getElementById("changeTotal").textContent = `₱${change.toFixed(2)}`;
        document.getElementById("r-change").textContent = `${change.toFixed(2)}`; // Update the <span> inside <p>
    
        let changeBreakdown = getChangeBreakdown(change);
        let tableBody = document.getElementById("denominationTable");
        tableBody.innerHTML = "";
    
        changeBreakdown.forEach(({ denomination, quantity }) => {
            let row = `<tr><td>₱${denomination}</td><td>${quantity}</td></tr>`;
            tableBody.innerHTML += row;
        });
        
    
    }

    // ===========Receipt code generator===========
    function generateReceiptNumber() {
        const randomNum = Math.floor(10000 + Math.random() * 90000); // Generate 5-digit number
        const receiptNumber = `INV-${randomNum}`;
        
        document.getElementById("Product-Code").value = receiptNumber;
        updateReceipt1(); // ✅ Update receipt details when new number is generated
    }
    
// =================Printing Receipt===============
function printReceipt() {
    window.print();
}



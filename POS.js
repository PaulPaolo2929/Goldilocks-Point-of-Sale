let cart = [];
const denominations = [500, 200, 100, 50, 20, 10, 5, 1, 0.25];

// Add item to cart
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// Update Cart Table & Total
function updateCart() {
    let cartBody = document.getElementById("cart-body");
    let total = 0;
    cartBody.innerHTML = "";

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>P${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>P${itemTotal.toFixed(2)}</td>
            <td><button onclick="removeItem(${index})">Remove</button></td>
        `;
        cartBody.appendChild(row);
    });
    document.getElementById("cart-total").textContent = `P ${total.toFixed(2)}`;
}

// Remove Item from Cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Checkout Process
function checkout() {
    updateReceipt();
    let totalAmount = document.getElementById("cart-total").textContent;
    alert("Proceeding to checkout. Total: " + totalAmount);
}

// Receipt Updater
function updateReceipt() {
    let customerName = document.getElementById("r-Customer")?.value.trim() || "N/A";
    let amountPaid = document.getElementById("AmountPaid")?.value.trim() || "0.00";
    document.getElementById("Customer-name").innerText = customerName;
    document.getElementById("r-paid").innerText = "P" + amountPaid;
}

// Date and Time Updater
function updateDateTime() {
    let currentDate = new Date();
    let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

    document.querySelectorAll('.date').forEach(el => {
        el.innerHTML = currentDate.toLocaleDateString('en-US', dateOptions);
    });
    document.querySelectorAll('.time').forEach(el => {
        el.innerHTML = currentDate.toLocaleTimeString('en-US', timeOptions);
    });
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Cash Drawer Randomizer
function cashDrawerRandomizer() {
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
            totalAmount += count * denomination;
            return { denomination, count };
        }).filter(entry => entry.count > 0);
        
        document.getElementById("totalAmount").value = totalAmount.toFixed(2);
        renderTable(breakdown);
        closeManualPanel();
    }

    // Event Listeners
    document.getElementById("generateAuto").addEventListener("click", handleGenerateAuto);
    document.getElementById("manualInputBtn").addEventListener("click", openManualPanel);
    document.getElementById("submitManual").addEventListener("click", handleManualSubmit);
    document.getElementById("closePanel").addEventListener("click", closeManualPanel);
}

cashDrawerRandomizer();

document.addEventListener("DOMContentLoaded", function () {
    let checkoutButton = document.getElementById("checkout-btn");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", checkout);
    }
});

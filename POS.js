

let cart = [];

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
    cartBody.innerHTML = "";  // Clear previous entries

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let row = document.createElement("tr");
        row.innerHTML =  `
           
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

// Checkout Process - Updates Receipt and Alerts Total
function checkout() {
    
    updateReceipt();  // Make sure receipt updates when clicking checkout

    let totalAmount = document.getElementById("cart-total").textContent;
    alert("Proceeding to checkout. Total: " + totalAmount);
}

// Receipt Updater
function updateReceipt() {
    let customerInput = document.getElementById("r-Customer");
    let amountInput = document.getElementById("AmountPaid");

    if (!customerInput || !amountInput) {
        console.error("Error: One or more input fields not found!");
        return;
    }

    let customerName = customerInput.value.trim();
    let amountPaid = amountInput.value.trim();

    let customerDisplay = document.getElementById("Customer-name");
    let amountDisplay = document.getElementById("r-paid");

    if (!customerDisplay || !amountDisplay) {
        console.error("Error: One or more display elements not found!");
        return;
    }

    customerDisplay.innerText = customerName || "N/A";
    amountDisplay.innerText = "P" + (amountPaid || "0.00");
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

// Initialize Clock
updateDateTime();
setInterval(updateDateTime, 1000);

// Attach checkout function to button
document.addEventListener("DOMContentLoaded", function () {
    let checkoutButton = document.getElementById("checkout-btn");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", checkout);
    }
});

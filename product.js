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

// ================================================================
// Checkout Process - Updates Receipt and Alerts Total
function checkout() {
    updateReceipt();  // Make sure receipt updates when clicking checkout

    let totalAmount = document.getElementById("cart-total").textContent;
    alert("Proceeding to checkout. Total: " + totalAmount);
}

function checkout() {
    localStorage.setItem("cart", JSON.stringify(cart));  // Save cart data
    window.location.href = "index.html"; // Redirect to POS page
}

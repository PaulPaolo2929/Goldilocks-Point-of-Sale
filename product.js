let cart = [];

// Add item to cart
function addToCart(productName, price) {
    let existingItem = cart.find(item => item.name === productName); // Fix: Use productName instead of name
    if (existingItem) {
        existingItem.quantity++;
        existingItem.total = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            total: price
        });
    }
    updateCart();
}

// Update Cart Table & Total
function updateCart() {
    let cartBody = document.getElementById("cart-body");
    let cartTotalElement = document.getElementById("cart-total");
    cartBody.innerHTML = "";  // Clear previous entries
    let total = 0;

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

    cartTotalElement.textContent = `P ${total.toFixed(2)}`;
}

// Remove Item from Cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function proceedToPayment() {
    // Save cart data to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirect to receipt page
    window.location.href = "index.html"; // Change this to your receipt page URL
}


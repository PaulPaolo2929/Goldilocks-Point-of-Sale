document.addEventListener("DOMContentLoaded", function () {
    // Elements for Receipt Number Generation
    const prefix = "RCPT"; // Receipt prefix
    const generateBtn = document.getElementById("generate-btn");
    const receiptInput = document.getElementById("receiptNumber");
    const receiptDisplay = document.getElementById("receipt-number");

    // Customer Name & Amount Elements
    const customerInput = document.getElementById("r-Customer");
    const receiptCustomerName = document.getElementById("customerName");
    const amountPaidInput = document.getElementById("AmountPaid");
    const amountPaidDisplay = document.getElementById("r-paid");


    function generateReceiptNumber() {
        return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    function assignReceiptNumber() {
        const newReceiptNo = generateReceiptNumber();
        if (receiptInput) receiptInput.value = newReceiptNo;
        if (receiptDisplay) receiptDisplay.innerText = newReceiptNo;
    }

    // Update Customer Name on Receipt
    function updateCustomerName() {
        receiptCustomerName.innerText = customerInput.value.trim() || "N/A";
    }

    // Update Amount Paid on Receipt
    function updateAmountPaid() {
        amountPaidDisplay.innerText = amountPaidInput.value || "0";
    }

    // Attach Event Listeners
    if (generateBtn) generateBtn.addEventListener("click", assignReceiptNumber);
    customerInput.addEventListener("input", updateCustomerName);
    amountPaidInput.addEventListener("input", updateAmountPaid);

    //retrieve cart content from product tab
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Get stored cart data

    let receiptTable = document.querySelector(".items"); // Target receipt table
    let grandTotalElement = document.getElementById("r-grandTotal");
    let grandTotal = 0;

    cart.forEach(item => {
        let row = document.createElement("tr");

        let itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>P${item.price.toFixed(2)}</td>
            <td>P${itemTotal.toFixed(2)}</td>
        `;
        
        receiptTable.appendChild(row);
    });

    // Update Grand Total
    grandTotalElement.textContent = `₱${grandTotal.toFixed(2)}`;

    // Get Paid Amount & Calculate Change
    document.getElementById("AmountPaid").addEventListener("input", function () {
        let paidAmount = parseFloat(this.value) || 0;
        let change = paidAmount - grandTotal;

        document.getElementById("r-change").textContent = `₱${change.toFixed(2)}`;
    });   
        
});

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

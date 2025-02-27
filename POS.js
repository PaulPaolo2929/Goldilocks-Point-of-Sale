
// Receipnt Updater
function updateReceipt() {
    let customerName = document.getElementById("r-Customer")?.value || ""; // Ensure the element exists
    let amountPaid = document.getElementById("AmountPaid").value; // Get input value correctly

    // Update the display elements
    document.getElementById("Customer-name").innerText = customerName;
    document.getElementById("r-paid").innerText = amountPaid; // Use innerText to update display span
}
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


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


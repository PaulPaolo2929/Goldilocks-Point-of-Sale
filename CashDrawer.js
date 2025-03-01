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
        if (breakdown.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4' style='text-align: center;'>No cash available</td></tr>";
            return;
        }

        tableBody.innerHTML = breakdown.map((row, index) =>
            `<tr>
                <td>${row.denomination}</td>
                <td>
                    <button onclick="modifyQuantity(${index}, -1)">-</button>
                    <input type="number" value="${row.count}" min="0" id="input-${index}" onchange="updateQuantity(${index})">
                    <button onclick="modifyQuantity(${index}, 1)">+</button>
                </td>
                <td>${(row.denomination * row.count).toFixed(2)}</td>
                <td><button onclick="removeRow(${index})">Remove</button></td>
            </tr>`
        ).join('');
    }

    function saveToLocalStorage(breakdown) {
        localStorage.setItem("cashDrawerData", JSON.stringify(breakdown));
    }

    function handleGenerateAuto() {
        const totalAmount = parseFloat(document.getElementById("totalAmount").value);
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Please enter a valid total amount.");
            return;
        }
        const breakdown = getDenominationBreakdown(totalAmount);
        renderTable(breakdown);
        saveToLocalStorage(breakdown);
    }

    function openManualPanel() {
        document.getElementById("manualPanel").classList.remove("hidden");
        generateManualInputs();
    }

    function closeManualPanel() {
        document.getElementById("manualPanel").classList.add("hidden");
    }

    function generateManualInputs() {
        const manualInputsDiv = document.getElementById("manualInputs");
        manualInputsDiv.innerHTML = ""; // Clear previous inputs

        denominations.forEach(denomination => {
            const inputGroup = document.createElement("div");
            inputGroup.innerHTML = `
                <label>${denomination}: </label>
                <input type="number" id="input-${denomination}" min="0" value="0">
            `;
            manualInputsDiv.appendChild(inputGroup);
        });
    }

    function handleManualSubmit() {
        let totalAmount = 0;
        const breakdown = [];

        denominations.forEach(denomination => {
            const count = parseInt(document.getElementById(`input-${denomination}`).value) || 0;
            if (count > 0) {
                breakdown.push({ denomination, count });
                totalAmount += count * denomination;
            }
        });

        document.getElementById("totalAmount").value = totalAmount.toFixed(2);
        renderTable(breakdown);
        saveToLocalStorage(breakdown);
        closeManualPanel();
    }

    window.modifyQuantity = function(index, change) {
        let breakdown = JSON.parse(localStorage.getItem("cashDrawerData")) || [];
        breakdown[index].count = Math.max(0, breakdown[index].count + change);
        saveToLocalStorage(breakdown);
        renderTable(breakdown);
    };

    window.updateQuantity = function(index) {
        let breakdown = JSON.parse(localStorage.getItem("cashDrawerData")) || [];
        let newValue = parseInt(document.getElementById(`input-${index}`).value) || 0;
        breakdown[index].count = Math.max(0, newValue);
        saveToLocalStorage(breakdown);
        renderTable(breakdown);
    };

    window.removeRow = function(index) {
        let breakdown = JSON.parse(localStorage.getItem("cashDrawerData")) || [];
        breakdown.splice(index, 1);
        saveToLocalStorage(breakdown);
        renderTable(breakdown);
    };

    // Load saved data when page refreshes
    let savedData = JSON.parse(localStorage.getItem("cashDrawerData")) || [];
    renderTable(savedData);

    // Attach event listeners
    document.getElementById("generateAuto").addEventListener("click", handleGenerateAuto);
    document.getElementById("manualInputBtn").addEventListener("click", openManualPanel);
    document.getElementById("submitManual").addEventListener("click", handleManualSubmit);
    document.getElementById("closePanel").addEventListener("click", closeManualPanel);
}

document.addEventListener("DOMContentLoaded", cashDrawerRandomizer);

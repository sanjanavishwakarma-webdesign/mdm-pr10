// Get elements from HTML
const wasteForm = document.getElementById("wasteForm");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");
const dateInput = document.getElementById("date");

const totalWaste = document.getElementById("totalWaste");
const plasticWaste = document.getElementById("plasticWaste");
const paperWaste = document.getElementById("paperWaste");
const organicWaste = document.getElementById("organicWaste");

const wasteList = document.getElementById("wasteList");
const wasteTable = document.getElementById("wasteTable");
const emptyMessage = document.getElementById("emptyMessage");

const progressBar = document.getElementById("progressBar");
const goalMessage = document.getElementById("goalMessage");
const clearAll = document.getElementById("clearAll");
const ecoTip = document.getElementById("ecoTip");


// Load saved data from localStorage
let wasteEntries = JSON.parse(localStorage.getItem("ecoTrackData")) || [];


// Add new waste entry
wasteForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const category = categoryInput.value;
    const quantity = parseFloat(quantityInput.value);
    const date = dateInput.value;

    if (category === "" || quantity <= 0 || date === "") {
        alert("Please enter valid details.");
        return;
    }

    const newEntry = {
        id: Date.now(),
        category: category,
        quantity: quantity,
        date: date
    };

    wasteEntries.push(newEntry);

    saveData();
    displayData();

    wasteForm.reset();
});


// Save data in localStorage
function saveData() {
    localStorage.setItem("ecoTrackData", JSON.stringify(wasteEntries));
}


// Display all data
function displayData() {

    wasteList.innerHTML = "";

    let total = 0;
    let plastic = 0;
    let paper = 0;
    let organic = 0;

    // Calculate totals
    wasteEntries.forEach(function (entry) {

        total += entry.quantity;

        if (entry.category === "Plastic") {
            plastic += entry.quantity;
        }

        if (entry.category === "Paper") {
            paper += entry.quantity;
        }

        if (entry.category === "Organic") {
            organic += entry.quantity;
        }

        // Create table row
        const row = document.createElement("tr");

        row.className = "border-b hover:bg-gray-50";

        row.innerHTML = `
            <td class="p-3">${entry.category}</td>

            <td class="p-3">
                ${entry.quantity.toFixed(1)} kg
            </td>

            <td class="p-3">
                ${entry.date}
            </td>

            <td class="p-3">
                <button
                    onclick="deleteEntry(${entry.id})"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                    Delete
                </button>
            </td>
        `;

        wasteList.appendChild(row);
    });


    // Update dashboard cards
    totalWaste.textContent = total.toFixed(1) + " kg";
    plasticWaste.textContent = plastic.toFixed(1) + " kg";
    paperWaste.textContent = paper.toFixed(1) + " kg";
    organicWaste.textContent = organic.toFixed(1) + " kg";


    // Show or hide table
    if (wasteEntries.length === 0) {

        wasteTable.classList.add("hidden");
        emptyMessage.classList.remove("hidden");

    } else {

        wasteTable.classList.remove("hidden");
        emptyMessage.classList.add("hidden");
    }


    // Update progress
    updateGoal(total);
}


// Update weekly goal
function updateGoal(total) {

    const goal = 10;

    let percentage = (total / goal) * 100;

    if (percentage > 100) {
        percentage = 100;
    }

    progressBar.style.width = percentage + "%";


    if (total === 0) {

        goalMessage.textContent = "Start adding waste entries!";

    } else if (total < goal) {

        goalMessage.textContent =
            `Good job! You are within your goal. ${(
                goal - total
            ).toFixed(1)} kg remaining.`;

    } else {

        goalMessage.textContent =
            "⚠️ You have crossed your weekly waste goal.";

    }
}


// Delete individual entry
function deleteEntry(id) {

    wasteEntries = wasteEntries.filter(function (entry) {
        return entry.id !== id;
    });

    saveData();
    displayData();
}


// Clear all entries
clearAll.addEventListener("click", function () {

    if (wasteEntries.length === 0) {
        alert("There are no entries to clear.");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete all waste entries?"
    );

    if (confirmDelete) {

        wasteEntries = [];

        saveData();
        displayData();
    }
});


// Eco tips
const tips = [
    "Avoid single-use plastic whenever possible.",
    "Separate wet and dry waste.",
    "Reuse paper before throwing it away.",
    "Dispose electronic waste at authorized collection centers.",
    "Carry a reusable water bottle.",
    "Use cloth bags instead of plastic bags."
];


// Change eco tip every time page loads
const randomTip =
    tips[Math.floor(Math.random() * tips.length)];

ecoTip.textContent = randomTip;


// Display saved data when page loads
displayData();

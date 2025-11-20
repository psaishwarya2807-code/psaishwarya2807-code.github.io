// ---------------------------
// FOOD DATABASE
// ---------------------------

const FOOD_DATA = {
    "orange juice": {
        foodName: "Orange Juice",
        calories: "110 kcal per glass",
        nutrients: "Vitamin C, Potassium, Folate",
        benefits: "Boosts immunity, improves skin health",
        bestTime: "Morning",
        category: "Healthy"
    },

    "apple": {
        foodName: "Apple",
        calories: "95 kcal",
        nutrients: "Fiber, Vitamin C, Potassium",
        benefits: "Good for digestion & immunity",
        bestTime: "Morning / Afternoon",
        category: "Healthy"
    },

    "banana": {
        foodName: "Banana",
        calories: "105 kcal",
        nutrients: "Potassium, Vitamin B6, Magnesium",
        benefits: "Energy boost, good for muscles",
        bestTime: "Morning / Pre-workout",
        category: "Healthy"
    },

    "burger": {
        foodName: "Burger",
        calories: "350–600 kcal",
        nutrients: "Protein, Fat",
        benefits: "High energy",
        bestTime: "Lunch",
        category: "Junk Food"
    },

    "pizza": {
        foodName: "Pizza",
        calories: "250–400 kcal per slice",
        nutrients: "Carbs, Fat, Protein",
        benefits: "High energy",
        bestTime: "Evening",
        category: "Junk Food"
    }
};

// ---------------------------
// SELECT HTML ELEMENTS
// ---------------------------

const fileInput = document.getElementById("imageInput");
const foodNameEl = document.getElementById("foodName");
const caloriesEl = document.getElementById("calories");
const nutrientsEl = document.getElementById("nutrients");
const benefitsEl = document.getElementById("benefits");
const bestTimeEl = document.getElementById("bestTime");
const categoryEl = document.getElementById("category");


// ---------------------------
// HELPER: SET UI VALUES
// ---------------------------

function showData(data) {
    foodNameEl.textContent = data.foodName;
    caloriesEl.textContent = data.calories;
    nutrientsEl.textContent = data.nutrients;
    benefitsEl.textContent = data.benefits;
    bestTimeEl.textContent = data.bestTime;
    categoryEl.textContent = data.category;
}

function showNotFound() {
    foodNameEl.textContent = "Not found";
    caloriesEl.textContent = "—";
    nutrientsEl.textContent = "—";
    benefitsEl.textContent = "—";
    bestTimeEl.textContent = "—";
    categoryEl.textContent = "—";
}


// ---------------------------
// MAIN DETECTION LOGIC
// ---------------------------

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imgName = file.name.toLowerCase();

    // Try to detect food from filename keywords
    let matchedFood = null;

    for (let key in FOOD_DATA) {
        if (imgName.includes(key)) {
            matchedFood = FOOD_DATA[key];
            break;
        }
    }

    // Show result
    if (matchedFood) {
        showData(matchedFood);
    } else {
        showNotFound();
    }
});

//
// -------------------------------
//   FOOD DATABASE
// -------------------------------
//

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
        nutrients: "Protein, Fat, Carbs",
        benefits: "High energy",
        bestTime: "Occasional Treat",
        category: "Junk Food"
    }
};

//
// -------------------------------
//   IMAGE UPLOAD + PREVIEW
// -------------------------------
//

const imageInput = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const resultBox = document.getElementById("resultBox");

// When user selects image
imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            previewImage.src = reader.result;
            previewImage.style.display = "block";

            // Simulate automatic food detection
            detectFood();
        });

        reader.readAsDataURL(file);
    }
});

//
// -------------------------------
//   FOOD DETECTION LOGIC
// -------------------------------
//

// Simple keyword matching for now
function detectFood() {
    let fileName = imageInput.files[0].name.toLowerCase();

    let detectedFood = null;

    Object.keys(FOOD_DATA).forEach(food => {
        if (fileName.includes(food)) {
            detectedFood = FOOD_DATA[food];
        }
    });

    if (!detectedFood) {
        resultBox.style.display = "block";
        document.getElementById("foodName").innerText = "Unknown Food";
        document.getElementById("calories").innerText = "-";
        document.getElementById("nutrients").innerText = "-";
        document.getElementById("benefits").innerText = "-";
        document.getElementById("bestTime").innerText = "-";
        document.getElementById("category").innerText = "-";
        return;

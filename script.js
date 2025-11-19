// Food Database
const foodData = {
    "banana": {
        calories: "105 kcal per 100g",
        nutrients: "Potassium, Vitamin B6, Vitamin C, Fiber",
        benefits: "Boosts energy, improves digestion, supports heart health",
        bestTime: "Morning or afternoon",
        category: "Healthy"
    },
    "apple": {
        calories: "52 kcal per 100g",
        nutrients: "Vitamin C, Fiber, Antioxidants",
        benefits: "Good for heart, digestion, and immunity",
        bestTime: "Any time of day",
        category: "Healthy"
    },
    "orange": {
        calories: "47 kcal per 100g",
        nutrients: "Vitamin C, Folate, Potassium",
        benefits: "Boosts immunity, good for skin, helps hydration",
        bestTime: "Morning",
        category: "Healthy"
    },
    "pizza": {
        calories: "266 kcal per slice",
        nutrients: "Carbs, Fat, Sodium",
        benefits: "Tasty but not nutritious",
        bestTime: "Occasionally",
        category: "Junk"
    },
    "burger": {
        calories: "295 kcal per burger",
        nutrients: "Protein, Fat, Carbs",
        benefits: "High protein but high fat",
        bestTime: "Occasionally",
        category: "Junk"
    },
    "dosa": {
        calories: "133 kcal per dosa",
        nutrients: "Carbs, Protein",
        benefits: "Light, easy to digest",
        bestTime: "Breakfast",
        category: "Healthy"
    },
    "idli": {
        calories: "58 kcal per idli",
        nutrients: "Protein, Carbohydrates",
        benefits: "Very light, good for digestion",
        bestTime: "Breakfast",
        category: "Healthy"
    }
};


// Function to classify image
function classifyImage() {
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");

    if (fileInput.files.length === 0) {
        alert("Please upload an image.");
        return;
    }

    // Show preview
    const file = fileInput.files[0];
    preview.src = URL.createObjectURL(file);

    // Guess name from file name
    let fileName = file.name.toLowerCase();

    let detectedFood = "not found";

    for (let food in foodData) {
        if (fileName.includes(food)) {
            detectedFood = food;
            break;
        }
    }

    // Update UI
    const result = document.getElementById("result");

    if (detectedFood !== "not found") {
        const info = foodData[detectedFood];
        result.innerHTML = `
            <strong>Food Name:</strong> ${detectedFood}<br><br>
            <strong>Calories:</strong> ${info.calories}<br><br>
            <strong>Nutrients:</strong> ${info.nutrients}<br><br>
            <strong>Benefits:</strong> ${info.benefits}<br><br>
            <strong>Best Time to Eat:</strong> ${info.bestTime}<br><br>
            <strong>Category:</strong> ${info.category}
        `;
    } else {
        result.innerHTML = `
            <strong>Food Name:</strong> Not in database<br><br>
            <strong>Calories:</strong> —<br><br>
            <strong>Nutrients:</strong> —<br><br>
            <strong>Benefits:</strong> —<br><br>
            <strong>Best Time to Eat:</strong> —<br><br>
            <strong>Category:</strong> —
        `;
    }
}

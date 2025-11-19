// Food Database
const foodDatabase = {
    "banana": {
        calories: "105 kcal",
        nutrients: "Potassium, Vitamin B6, Vitamin C, Fiber",
        benefits: "Boosts energy, improves digestion, good for heart health",
        bestTime: "Morning or before workout",
        category: "Healthy"
    },

    "apple": {
        calories: "95 kcal",
        nutrients: "Fiber, Vitamin C, Potassium",
        benefits: "Good for heart, controls blood sugar, rich in antioxidants",
        bestTime: "Morning",
        category: "Healthy"
    },

    "burger": {
        calories: "295–500 kcal (depends on size)",
        nutrients: "Protein, Carbs, Fats",
        benefits: "High energy food",
        bestTime: "Occasionally, not daily",
        category: "Junk"
    }
};


// MAIN FUNCTION
function classifyFood(foodName) {
    foodName = foodName.toLowerCase();

    if (foodDatabase[foodName]) {
        return foodDatabase[foodName];
    }

    return {
        calories: "—",
        nutrients: "—",
        benefits: "—",
        bestTime: "—",
        category: "—"
    };
}


// Image to food name — Simple keyword match for now
function identifyFoodByImage(fileName) {
    fileName = fileName.toLowerCase();

    if (fileName.includes("banana")) return "banana";
    if (fileName.includes("apple")) return "apple";
    if (fileName.includes("burger")) return "burger";

    return "Not in database";
}


// Image Preview & Classification
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");
    const resultBox = document.getElementById("result");

    if (file) {
        preview.src = URL.createObjectURL(file);

        const identifiedFood = identifyFoodByImage(file.name);
        const foodInfo = classifyFood(identifiedFood);

        resultBox.innerHTML = `
            <b>Food Name:</b> ${identifiedFood}<br><br>
            <b>Calories:</b> ${foodInfo.calories}<br>
            <b>Nutrients:</b> ${foodInfo.nutrients}<br>
            <b>Benefits:</b> ${foodInfo.benefits}<br>
            <b>Best Time to Eat:</b> ${foodInfo.bestTime}<br>
            <b>Category:</b> ${foodInfo.category}
        `;
    }
});

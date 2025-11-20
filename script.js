// Food database (20+ items)
const foodDB = {
    "apple": {
        type: "Healthy",
        ingredients: "Apple",
        benefits: "Rich in fiber & vitamins. Good for digestion.",
        bestTime: "Morning or evening"
    },
    "banana": {
        type: "Healthy",
        ingredients: "Banana",
        benefits: "Boosts energy, rich in potassium.",
        bestTime: "Morning before breakfast"
    },
    "pizza": {
        type: "Junk",
        ingredients: "Cheese, refined flour, sauce, toppings",
        benefits: "Tasty but high in calories.",
        bestTime: "Lunch (occasionally)"
    },
    "burger": {
        type: "Junk",
        ingredients: "Bread, patty, cheese",
        benefits: "Rich in protein but high in fats.",
        bestTime: "Lunch"
    },
    "dosa": {
        type: "Healthy",
        ingredients: "Rice, dal",
        benefits: "Good carbs & protein.",
        bestTime: "Breakfast"
    },
    "idli": {
        type: "Healthy",
        ingredients: "Rice, urad dal",
        benefits: "Very healthy, great for digestion.",
        bestTime: "Breakfast"
    },
    "samosa": {
        type: "Junk",
        ingredients: "Potato, maida, oil",
        benefits: "Tasty but oily.",
        bestTime: "Evening snack"
    },
    "rice": {
        type: "Healthy",
        ingredients: "Rice",
        benefits: "Good carbs for energy.",
        bestTime: "Lunch"
    },
    "chapati": {
        type: "Healthy",
        ingredients: "Wheat flour",
        benefits: "Good fiber & nutrients.",
        bestTime: "Lunch or dinner"
    },
    "chicken": {
        type: "Healthy",
        ingredients: "Chicken",
        benefits: "High protein, muscle building.",
        bestTime: "Lunch"
    }
};

// Simple AI-like fake classifier (matches keywords)
function identifyFood(fileName) {
    fileName = fileName.toLowerCase();

    for (let food in foodDB) {
        if (fileName.includes(food)) {
            return food;
        }
    }
    return null;
}

// When user uploads image
document.getElementById("imageInput").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (!file) return;

    // Show preview
    let img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    // Identify food
    let foodName = identifyFood(file.name);
    let box = document.getElementById("results");

    if (!foodName) {
        box.style.display = "block";
        box.innerHTML = "<h3>Unknown Food</h3><p>Try uploading a clear food picture.</p>";
        return;
    }

    let data = foodDB[foodName];

    box.style.display = "block";
    box.innerHTML = `
        <h2>${foodName.toUpperCase()}</h2>
        <p><b>Type:</b> ${data.type}</p>
        <p><b>Ingredients:</b> ${data.ingredients}</p>
        <p><b>Benefits:</b> ${data.benefits}</p>
        <p><b>Best Time to Eat:</b> ${data.bestTime}</p>
    `;
});

const foods = {
    "apple": {
        type: "Healthy",
        ingredients: "Apple fruit",
        benefits: "High fiber, boosts immunity",
        bestTime: "Morning"
    },
    "banana": {
        type: "Healthy",
        ingredients: "Banana fruit",
        benefits: "Energy boost, good for digestion",
        bestTime: "Morning / Evening"
    },
    "idli": {
        type: "Healthy",
        ingredients: "Rice, urad dal",
        benefits: "Light, easily digestible",
        bestTime: "Breakfast"
    },
    "dosa": {
        type: "Healthy",
        ingredients: "Rice, lentils",
        benefits: "Good carbs and protein",
        bestTime: "Breakfast"
    },
    "utappa": {
        type: "Healthy",
        ingredients: "Rice, lentils, vegetables",
        benefits: "Nutritious and filling",
        bestTime: "Breakfast"
    },
    "biryani": {
        type: "Junk",
        ingredients: "Rice, meat, oil, spices",
        benefits: "Very tasty but heavy",
        bestTime: "Lunch (occasionally)"
    },
    "pizza": {
        type: "Junk",
        ingredients: "Cheese, bread, sauce",
        benefits: "Tasty but high calories",
        bestTime: "Occasionally"
    },
    "burger": {
        type: "Junk",
        ingredients: "Bread, patty, sauces",
        benefits: "Delicious but high fat",
        bestTime: "Occasionally"
    },
    "noodles": {
        type: "Junk",
        ingredients: "Maida, oil, seasoning",
        benefits: "Quick to make, tastes good",
        bestTime: "Rarely"
    },
    "cake": {
        type: "Junk",
        ingredients: "Sugar, flour, cream",
        benefits: "Celebration food",
        bestTime: "Occasional treat"
    },
    "icecream": {
        type: "Junk",
        ingredients: "Milk, sugar, flavours",
        benefits: "Cooling and tasty",
        bestTime: "Afternoon"
    }
};

document.getElementById("imageUpload").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    let name = file.name.toLowerCase();
    let foundFood = null;

    Object.keys(foods).forEach(food => {
        if (name.includes(food)) {
            foundFood = food;
        }
    });

    if (!foundFood) {
        document.getElementById("result").innerHTML = `
            <p><b>Food Detected:</b> Unknown</p>
            <p>Please upload a clearer image.</p>
        `;
        return;
    }

    const item = foods[foundFood];

    document.getElementById("result").innerHTML = `
        <span class="tag ${item.type.toLowerCase()}">${item.type}</span>
        <p><b>Food:</b> ${foundFood}</p>
        <p><b>Ingredients:</b> ${item.ingredients}</p>
        <p><b>Benefits:</b> ${item.benefits}</p>
        <p><b>Best Time to Eat:</b> ${item.bestTime}</p>
    `;
});

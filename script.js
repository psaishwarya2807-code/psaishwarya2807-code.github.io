const foodData = {
    "pizza": {
        type: "Junk Food",
        ingredients: "Cheese, refined flour, sauces, toppings",
        benefits: "Tasty but high in calories",
        bestTime: "Sometimes only"
    },
    "burger": {
        type: "Junk Food",
        ingredients: "Bun, patty, cheese, oil",
        benefits: "Good taste",
        bestTime: "Rarely"
    },
    "biryani": {
        type: "Healthy / Depends",
        ingredients: "Rice, spices, chicken/veg",
        benefits: "High protein, good carbs",
        bestTime: "Lunch"
    },
    "idli": {
        type: "Healthy",
        ingredients: "Rice, urad dal",
        benefits: "Easy to digest, low calorie",
        bestTime: "Breakfast"
    },
    "dosa": {
        type: "Healthy",
        ingredients: "Rice, dal",
        benefits: "Low fat, nutritious",
        bestTime: "Breakfast or dinner"
    },
    "samosa": {
        type: "Junk Food",
        ingredients: "Potato, maida, oil",
        benefits: "Tasty but fried",
        bestTime: "Snacks only"
    }
};

document.getElementById("imageUpload").addEventListener("change", function() {
    const file = this.files[0];

    if (file) {
        const preview = document.getElementById("preview");
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";

        // Fake detection – very simple demo
        let result = document.getElementById("result");
        let foodName = Object.keys(foodData)[Math.floor(Math.random() * Object.keys(foodData).length)];
        let data = foodData[foodName];

        result.innerHTML = `
            <h3>${foodName.toUpperCase()}</h3>
            <p><b>Type:</b> ${data.type}</p>
            <p><b>Ingredients:</b> ${data.ingredients}</p>
            <p><b>Benefits:</b> ${data.benefits}</p>
            <p><b>Best time to eat:</b> ${data.bestTime}</p>
        `;

        result.style.display = "block";
    }
});

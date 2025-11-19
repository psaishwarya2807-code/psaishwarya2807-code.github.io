document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("preview").src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Start classification (fake model for now)
        classifyFood(file.name);
    }
});

// ---------------- FOOD DATABASE ---------------- //

const foodDB = {
    "banana": {
        calories: "105 kcal",
        nutrients: "Potassium, Vitamin B6, Fiber",
        benefits: "Boosts energy, good for digestion",
        time: "Morning or Afternoon",
        category: "Healthy"
    },

    "apple": {
        calories: "95 kcal",
        nutrients: "Vitamin C, Fiber, Antioxidants",
        benefits: "Good for immunity, digestion",
        time: "Anytime",
        category: "Healthy"
    },

    "orange": {
        calories: "62 kcal",
        nutrients: "Vitamin C, Fiber",
        benefits: "Boosts immunity",
        time: "Morning",
        category: "Healthy"
    },

    "watermelon": {
        calories: "85 kcal (1 cup)",
        nutrients: "Vitamin A, Vitamin C",
        benefits: "Hydrates body",
        time: "Afternoon",
        category: "Healthy"
    },

    "grapes": {
        calories: "70 kcal (1 cup)",
        nutrients: "Vitamin K, Antioxidants",
        benefits: "Good for heart",
        time: "Morning / Afternoon",
        category: "Healthy"
    },

    "pineapple": {
        calories: "82 kcal (1 cup)",
        nutrients: "Vitamin C, Manganese",
        benefits: "Good for digestion",
        time: "Afternoon",
        category: "Healthy"
    },

    "mango": {
        calories: "99 kcal",
        nutrients: "Vitamin C, Vitamin A",
        benefits: "Boosts immunity",
        time: "Morning",
        category: "Healthy"
    },

    "lemon": {
        calories: "17 kcal",
        nutrients: "Vitamin C",
        benefits: "Good for skin and digestion",
        time: "Morning",
        category: "Healthy"
    },

    "egg": {
        calories: "78 kcal",
        nutrients: "Protein, Vitamin B12",
        benefits: "Builds muscle",
        time: "Breakfast",
        category: "Healthy"
    },

    "milk": {
        calories: "103 kcal",
        nutrients: "Calcium, Protein",
        benefits: "Good for bones",
        time: "Night",
        category: "Healthy"
    },

    "potato": {
        calories: "164 kcal",
        nutrients: "Carbs, Potassium",
        benefits: "Energy",
        time: "Afternoon",
        category: "Healthy"
    },

    "tomato": {
        calories: "22 kcal",
        nutrients: "Vitamin C, Lycopene",
        benefits: "Good for skin",
        time: "Anytime",
        category: "Healthy"
    },

    "cucumber": {
        calories: "16 kcal",
        nutrients: "Water, Vitamin K",
        benefits: "Hydration",
        time: "Anytime",
        category: "Healthy"
    },

    "carrot": {
        calories: "41 kcal",
        nutrients: "Vitamin A",
        benefits: "Good for eyes",
        time: "Morning",
        category: "Healthy"
    },

    // Junk Foods
    "pizza": {
        calories: "266 kcal (1 slice)",
        nutrients: "Carbs, Fat, Sodium",
        benefits: "Tastes good 😄",
        time: "Evening (occasionally)",
        category: "Junk"
    },

    "burger": {
        calories: "295 kcal",
        nutrients: "Fat, Carbs, Protein",
        benefits: "High energy",
        time: "Evening (rarely)",
        category: "Junk"
    },

    "fries": {
        calories: "312 kcal",
        nutrients: "Fat, Sodium",
        benefits: "Tasty snack",
        time: "Evening (rarely)",
        category: "Junk"
    },

    "cake": {
        calories: "235 kcal",
        nutrients: "Sugar, Fat",
        benefits: "Celebration food 🎉",
        time: "Occasionally",
        category: "Junk"
    },

    "ice cream": {
        calories: "207 kcal",
        nutrients: "Sugar, Fat",
        benefits: "Good dessert 😄",
        time: "Evening",
        category: "Junk"
    }
};


// --------- CLASSIFICATION LOGIC --------- //

function classifyFood(filename) {
    let name = filename.toLowerCase().replace(/\.[^/.]+$/, "");

    // Try matching words
    for (let food in foodDB) {
        if (name.includes(food)) {
            displayDetails(foodDB[food], food);
            return;
        }
    }

    // If not found
    displayDetails(null, "Not in database");
}


// -------- DISPLAY RESULT -------- //

function displayDetails(data, name) {
    document.getElementById("result").innerHTML = `
        <b>Food Name:</b> ${name} <br><br>
        <b>Calories:</b> ${data ? data.calories : "—"} <br>
        <b>Nutrients:</b> ${data ? data.nutrients : "—"} <br>
        <b>Benefits:</b> ${data ? data.benefits : "—"} <br>
        <b>Best Time to Eat:</b> ${data ? data.time : "—"} <br>
        <b>Category:</b> ${data ? data.category : "—"} <br>
    `;
}

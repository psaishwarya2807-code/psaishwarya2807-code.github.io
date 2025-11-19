let model;

async function loadModel() {
    model = await mobilenet.load();
    console.log("Model loaded");
}
loadModel();

document.getElementById("imageUpload").addEventListener("change", () => {
    const file = document.getElementById("imageUpload").files[0];
    const preview = document.getElementById("previewImage");

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    preview.onload = () => {
        classifyImage(); // 🔥 automatic detection
    };
});

// 🔥 FOOD INFORMATION DATABASE
const foodInfo = {
    banana: {
        calories: "105 kcal",
        nutrients: "Potassium, Vitamin B6, Fiber",
        healthy: "Healthy Food",
        besttime: "Afternoon",
        benefits: "Boosts energy, good for digestion"
    },
    apple: {
        calories: "95 kcal",
        nutrients: "Fiber, Vitamin C, Antioxidants",
        healthy: "Healthy Food",
        besttime: "Morning",
        benefits: "Good for heart, digestion"
    },
    pizza: {
        calories: "266 kcal (per slice)",
        nutrients: "Carbs, Fat, Sodium",
        healthy: "Junk Food",
        besttime: "Avoid eating daily",
        benefits: "Tasty but not healthy"
    },
    orange: {
        calories: "62 kcal",
        nutrients: "Vitamin C, Fiber, Folate",
        healthy: "Healthy Food",
        besttime: "Morning",
        benefits: "Boosts immunity"
    },
    burger: {
        calories: "295 kcal",
        nutrients: "Fat, Carbs, Sodium",
        healthy: "Junk Food",
        besttime: "Avoid frequent eating",
        benefits: "High energy but unhealthy"
    }
};

async function classifyImage() {
    const resultText = document.getElementById("result");
    const extra = document.getElementById("extraInfo");

    resultText.textContent = "Detecting...";

    const img = document.getElementById("previewImage");
    const prediction = await model.classify(img);

    const detected = prediction[0].className.toLowerCase();
    resultText.textContent = "Detected: " + prediction[0].className;

    // find match in food database
    let found = null;

    Object.keys(foodInfo).forEach(food => {
        if (detected.includes(food)) {
            found = foodInfo[food];
        }
    });

    if (found) {
        extra.innerHTML = `
            ❤️ <b>${found.healthy}</b><br>
            🔥 Calories: ${found.calories}<br>
            🍀 Nutrients: ${found.nutrients}<br>
            ⭐ Benefits: ${found.benefits}<br>
            ⏰ Best time: ${found.besttime}
        `;
    } else {
        extra.innerHTML = "Food details not found in database.";
    }
}

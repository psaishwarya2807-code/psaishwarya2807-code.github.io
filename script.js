// ====== LOAD THE TEACHABLE MACHINE MODEL ======
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/avDFbgYAi/";
let model;

// Load model when page opens
async function loadModel() {
    try {
        model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        console.log("Model Loaded");
    } catch (error) {
        console.error("Model loading error:", error);
    }
}
loadModel();

// ====== IMAGE UPLOAD ======
const fileInput = document.getElementById("imageUpload");
const preview = document.getElementById("imagePreview");
const outputBox = document.getElementById("output");

fileInput.addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (event) {
        preview.src = event.target.result;
    };
    reader.readAsDataURL(file);

    // Wait for image to load before predicting
    preview.onload = function () {
        classifyImage();
    };
});

// ====== CLASSIFICATION FUNCTION ======
async function classifyImage() {
    if (!model) {
        outputBox.innerHTML = "Model not loaded. Try again.";
        return;
    }

    const prediction = await model.predict(preview);
    let highest = prediction[0];

    // Find top result
    prediction.forEach(p => {
        if (p.probability > highest.probability) highest = p;
    });

    const food = highest.className.toLowerCase();

    // FOOD DETAILS
    const info = {
        banana: {
            type: "Healthy",
            ingredients: "Natural fruit, no additives.",
            benefits: "Good for digestion, potassium-rich, boosts energy.",
            best_time: "Morning or before workout"
        },
        apple: {
            type: "Healthy",
            ingredients: "Natural fruit, no additives.",
            benefits: "Rich in fiber, good for heart health.",
            best_time: "Anytime during the day"
        },
        burger: {
            type: "Junk Food",
            ingredients: "Bread, patty, cheese, sauces.",
            benefits: "Tasty but high in calories & fats.",
            best_time: "Avoid at night"
        }
    };

    // If food exists in our list
    if (info[food]) {
        outputBox.innerHTML = `
            <h3>${food.toUpperCase()}</h3>
            <p><b>Type:</b> ${info[food].type}</p>
            <p><b>Ingredients:</b> ${info[food].ingredients}</p>
            <p><b>Benefits:</b> ${info[food].benefits}</p>
            <p><b>Best Time to Eat:</b> ${info[food].best_time}</p>
        `;
    } else {
        outputBox.innerHTML = "Food not recognized. Try another image.";
    }
}

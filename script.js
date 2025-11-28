// ========== LOAD TM MODEL ==========
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/avDFbgYAi/";
let model;

// Load model
async function loadModel() {
    model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
    console.log("Model loaded!");
}
loadModel();

// ========== IMAGE UPLOAD ==========
const fileInput = document.getElementById("imageUpload");
const preview = document.getElementById("imagePreview");
const output = document.getElementById("output");

fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.onload = function () {
            classifyImage();
        };
    };
    reader.readAsDataURL(file);
});

// ========== CLASSIFY IMAGE ==========
async function classifyImage() {
    if (!model) {
        output.innerHTML = "⚠ Model not loaded yet. Please wait.";
        return;
    }

    const prediction = await model.predict(preview);
    let best = prediction[0];

    prediction.forEach(p => {
        if (p.probability > best.probability) best = p;
    });

    const food = best.className.toLowerCase();

    // INFORMATION
    const info = {
        banana: {
            type: "Healthy",
            ingredients: "Natural fruit",
            benefits: "High in potassium, boosts energy",
            best_time: "Morning or pre-workout"
        },
        apple: {
            type: "Healthy",
            ingredients: "Natural fruit",
            benefits: "Good for digestion and heart health",
            best_time: "Anytime"
        },
        burger: {
            type: "Junk Food",
            ingredients: "Bread, cheese, patty, sauces",
            benefits: "Tasty but unhealthy",
            best_time: "Avoid at night"
        }
    };

    if (info[food]) {
        output.innerHTML = `
            <h3>${food.toUpperCase()}</h3>
            <p><b>Type:</b> ${info[food].type}</p>
            <p><b>Ingredients:</b> ${info[food].ingredients}</p>
            <p><b>Benefits:</b> ${info[food].benefits}</p>
            <p><b>Best Time to Eat:</b> ${info[food].best_time}</p>
        `;
    } else {
        output.innerHTML = "❌ Food not recognized. Try different image.";
    }
}

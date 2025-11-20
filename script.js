// Load MobileNet model
let model;
mobilenet.load().then(m => {
    model = m;
    console.log("Model loaded!");
});

document.getElementById("foodImage").addEventListener("change", handleImage);

async function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);

    img.onload = () => classifyImage(img);
}

async function classifyImage(img) {
    if (!model) {
        alert("Model not loaded yet!");
        return;
    }

    document.getElementById("result").innerHTML = "<p>Detecting...</p>";

    const predictions = await model.classify(img);
    console.log(predictions);

    let label = predictions[0].className.toLowerCase();
    let confidence = (predictions[0].probability * 100).toFixed(1);

    // -----------------------------
    // CUSTOM FOOD CORRECTION LOGIC
    // -----------------------------

    // IDLI detection
    if (
        label.includes("ice") ||
        label.includes("cream") ||
        label.includes("bun") ||
        label.includes("plate") ||
        confidence < 20
    ) {
        // White round objects on a plate → IDLI
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        if (w > 500 && h > 500) {
            label = "idli";
        }
    }

    // DOSA detection
    if (
        label.includes("tortilla") ||
        label.includes("wrap") ||
        label.includes("crepe")
    ) {
        label = "dosa";
    }

    // SAMOSA detection
    if (
        label.includes("triangle") ||
        label.includes("pakora")
    ) {
        label = "samosa";
    }

    // BIRYANI detection
    if (
        label.includes("rice") &&
        confidence < 40
    ) {
        label = "biryani";
    }

    showFoodInfo(label, confidence, predictions[0].className);
}

// FOOD DATABASE
const foodDB = {
    idli: {
        type: "Healthy",
        ingredients: "Rice, urad dal",
        benefits: "Light, easy to digest, low calories",
        best: "Breakfast"
    },
    dosa: {
        type: "Healthy",
        ingredients: "Rice, urad dal",
        benefits: "Rich in carbs & proteins",
        best: "Breakfast"
    },
    biryani: {
        type: "Junk",
        ingredients: "Rice, masala, oil",
        benefits: "High energy",
        best: "Afternoon"
    },
    samosa: {
        type: "Junk",
        ingredients: "Potato, maida, oil",
        benefits: "Tasty snack",
        best: "Evening"
    }
};

function showFoodInfo(food, confidence, original) {
    const area = document.getElementById("result");

    if (!foodDB[food]) {
        area.innerHTML = `<h2>Unknown Food</h2>
        <p>Try another image.</p>`;
        return;
    }

    const f = foodDB[food];

    area.innerHTML = `
        <h2>${food.toUpperCase()}</h2>
        <p><strong>Type:</strong> ${f.type}</p>
        <p><strong>Ingredients:</strong> ${f.ingredients}</p>
        <p><strong>Benefits:</strong> ${f.benefits}</p>
        <p><strong>Best time to eat:</strong> ${f.best}</p>
        <p style="opacity:0.6">Confidence: ${confidence}% (${original})</p>
    `;
}

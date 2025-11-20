// Load TensorFlow model
let model;

async function loadModel() {
    model = await tf.loadGraphModel(
        "https://tfhub.dev/google/aiy/vision/classifier/food_V1/1/model.json",
        { fromTFHub: true }
    );
    console.log("Model Loaded Successfully!");
}
loadModel();

// When user uploads image
document.getElementById("imageInput").addEventListener("change", async function (event) {
    let file = event.target.files[0];
    if (!file) return;

    // Show preview
    let img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    // Wait for model
    if (!model) {
        alert("Model is still loading...");
        return;
    }

    // Read image
    const image = document.createElement("img");
    image.src = img.src;

    image.onload = async () => {
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

        let predictions = await model.predict(tensor).data();

        let index = predictions.indexOf(Math.max(...predictions));

        let foodLabels = [
            "apple", "banana", "orange", "grapes", "pineapple", "mango",
            "pizza", "burger", "sandwich", "french fries", "pasta",
            "idli", "dosa", "vada", "biryani", "rice", "chapati",
            "milk", "egg", "chicken curry", "fish fry", "dal", "sambar"
        ];

        let detectedFood = foodLabels[index] || "Unknown Food";

        const foodInfo = {
            "apple": {
                type: "Healthy",
                benefits: "Rich in fiber and vitamin C.",
                bestTime: "Morning"
            },
            "banana": {
                type: "Healthy",
                benefits: "Great for energy and digestion.",
                bestTime: "Morning or evening"
            },
            "idli": {
                type: "Healthy",
                benefits: "Light and easy to digest.",
                bestTime: "Breakfast"
            },
            "dosa": {
                type: "Healthy",
                benefits: "Good carbs & protein.",
                bestTime: "Breakfast"
            },
            "biryani": {
                type: "Heavy",
                benefits: "High protein & carbs.",
                bestTime: "Lunch"
            },
            "pizza": {
                type: "Junk",
                benefits: "Tasty but high calorie.",
                bestTime: "Lunch"
            }
        };

        let box = document.getElementById("results");
        box.style.display = "block";

        let details = foodInfo[detectedFood] || {
            type: "Unknown",
            benefits: "Not available",
            bestTime: "--"
        };

        box.innerHTML = `
            <h2>${detectedFood.toUpperCase()}</h2>
            <p><b>Type:</b> ${details.type}</p>
            <p><b>Benefits:</b> ${details.benefits}</p>
            <p><b>Best Time to Eat:</b> ${details.bestTime}</p>
        `;
    };
});

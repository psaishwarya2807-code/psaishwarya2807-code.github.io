// ------------------------------
// LOAD mobilenet MODEL
// ------------------------------
let model;
mobilenet.load().then(m => {
    model = m;
    console.log("Model loaded!");
}).catch(err => {
    console.error("Model failed to load:", err);
});


// ------------------------------
// HANDLE IMAGE UPLOAD
// ------------------------------
document.getElementById("foodImage").addEventListener("change", handleImage);

async function handleImage(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected");
        return;
    }

    console.log("Image selected:", file.name);

    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    img.onload = () => {
        console.log("Image loaded into preview");
        classifyImage(img);
    };
}


// ------------------------------
// CLASSIFY IMAGE
// ------------------------------
async function classifyImage(img) {
    if (!model) {
        alert("Model not loaded yet! Please wait 1–2 seconds.");
        return;
    }

    document.getElementById("result").innerHTML = "<p>Classifying...</p>";
    console.log("Classifying image...");

    try {
        const predictions = await model.classify(img);
        console.log("Predictions:", predictions);

        let label = predictions[0].className.toLowerCase();
        let confidence = (predictions[0].probability * 100).toFixed(2);

        // FOOD NAME CLEANING LOGIC
        let finalLabel = label;

        if (label.includes("pizza")) finalLabel = "Pizza";
        if (label.includes("burger")) finalLabel = "Burger";
        if (label.includes("banana")) finalLabel = "Banana";
        if (label.includes("apple")) finalLabel = "Apple";
        if (label.includes("sandwich")) finalLabel = "Sandwich";
        if (label.includes("coffee")) finalLabel = "Coffee";

        document.getElementById("result").innerHTML = `
            <h3>🍽️ Result</h3>
            <p><b>Food:</b> ${finalLabel}</p>
            <p><b>Confidence:</b> ${confidence}%</p>
        `;

    } catch (error) {
        console.error("Error during classification:", error);
        document.getElementById("result").innerHTML = "<p>Error classifying image.</p>";
    }
}

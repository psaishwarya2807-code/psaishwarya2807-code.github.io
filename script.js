// Load MobileNet model
let model;
mobilenet.load().then(m => {
    model = m;
    console.log("Model loaded!");
});

// Listen for image upload
document.getElementById("foodImage").addEventListener("change", handleImage);

async function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    img.onload = () => classifyImage(img);
}

async function classifyImage(img) {
    if (!model) {
        alert("Model not loaded yet!");
        return;
    }

    document.getElementById("result").innerHTML = "<p>Classifying...</p>";

    const predictions = await model.classify(img);
    console.log(predictions);

    let label = predictions[0].className.toLowerCase();
    let confidence = (predictions[0].probability * 100).toFixed(2);

    // Custom food mapping (replace these as you want)
    let finalLabel = label;

    if (label.includes("pizza")) finalLabel = "Pizza";
    if (label.includes("burger")) finalLabel = "Burger";
    if (label.includes("banana")) finalLabel = "Banana";
    if (label.includes("apple")) finalLabel = "Apple";

    document.getElementById("result").innerHTML = `
        <h3>🍽️ Result</h3>
        <p><b>Food:</b> ${finalLabel}</p>
        <p><b>Confidence:</b> ${confidence}%</p>
    `;
}

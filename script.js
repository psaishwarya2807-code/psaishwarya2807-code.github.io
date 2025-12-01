const URL = "https://teachablemachine.withgoogle.com/models/your-model-id/"; 
// ❗ Replace your-model-id with your actual Teachable Machine model ID

let model, maxPredictions;

async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}
loadModel();

function openCamera() {
    const input = document.getElementById("fileInput");
    input.capture = "camera";
    input.click();
}

function openGallery() {
    const input = document.getElementById("fileInput");
    input.removeAttribute("capture");
    input.click();
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";

    classifyImage(img);
});

async function classifyImage(image) {
    if (!model) {
        document.getElementById("result").innerText = "Model is still loading...";
        return;
    }

    const prediction = await model.predict(image);
    prediction.sort((a, b) => b.probability - a.probability);

    const top = prediction[0];
    document.getElementById("result").innerHTML =
        "Prediction: <b>" + top.className + "</b><br>Confidence: " +
        Math.round(top.probability * 100) + "%";
}

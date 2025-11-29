import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.esm.js";
import * as mobilenet from "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.esm.js";

let model;

const statusDiv = document.getElementById("status");
const previewImage = document.getElementById("preview");
const resultDiv = document.getElementById("result");

async function loadModel() {
    statusDiv.textContent = "Loading model...";
    model = await mobilenet.load();
    statusDiv.textContent = "Model Loaded!";
}

loadModel();

cameraInput.onchange = handleImage;
galleryInput.onchange = handleImage;

function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";

        setTimeout(() => classifyImage(), 500);
    };

    reader.readAsDataURL(file);
}

async function classifyImage() {
    try {
        const predictions = await model.classify(previewImage);

        resultDiv.innerHTML = `
            <h3>Prediction:</h3>
            <p><b>${predictions[0].className}</b></p>
            <p>Confidence: ${(predictions[0].probability * 100).toFixed(2)}%</p>
        `;
    } catch (err) {
        resultDiv.innerHTML = "Error detecting food.";
    }
}

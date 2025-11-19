async function classifyImage() {
    const resultText = document.getElementById("result");
    resultText.innerText = "Classifying...";

    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        resultText.innerText = "Please upload an image first.";
        return;
    }

    // Load the model
    const model = await mobilenet.load();

    // Read image
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        const predictions = await model.classify(img);

        if (predictions.length > 0) {
            resultText.innerText =
                "Prediction: " + predictions[0].className +
                "\nConfidence: " + (predictions[0].probability * 100).toFixed(2) + "%";
        } else {
            resultText.innerText = "No prediction available.";
        }
    };
}

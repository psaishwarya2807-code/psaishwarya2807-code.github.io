let model;

// Elements
const statusDiv = document.getElementById("status");
const previewImage = document.getElementById("preview");
const resultDiv = document.getElementById("result");
const takePhotoBtn = document.getElementById("takePhotoBtn");
const choosePhotoBtn = document.getElementById("choosePhotoBtn");

// Load MobileNet
(async () => {
  statusDiv.textContent = "Loading model...";
  model = await mobilenet.load();
  statusDiv.textContent = "Model Loaded!";
})();

// Open Camera
takePhotoBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "camera";
  input.onchange = () => displayAndClassify(input.files[0]);
  input.click();
});

// Choose from gallery
choosePhotoBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => displayAndClassify(input.files[0]);
  input.click();
});

// Display image + classify
function displayAndClassify(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";

    // Delay so image loads before prediction
    setTimeout(() => classifyImage(), 500);
  };

  reader.readAsDataURL(file);
}

// Classify using MobileNet
async function classifyImage() {
  if (!model) {
    statusDiv.textContent = "Model not loaded yet!";
    return;
  }

  statusDiv.textContent = "Classifying...";

  const predictions = await model.classify(previewImage);

  statusDiv.textContent = "Done!";

  // Show results
  resultDiv.innerHTML = `
    <h2>Top Results:</h2>
    <p>${predictions[0].className} — ${(predictions[0].probability * 100).toFixed(2)}%</p>
    <p>${predictions[1].className} — ${(predictions[1].probability * 100).toFixed(2)}%</p>
    <p>${predictions[2].className} — ${(predictions[2].probability * 100).toFixed(2)}%</p>
  `;
}

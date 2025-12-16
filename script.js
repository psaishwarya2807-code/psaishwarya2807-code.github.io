// 🔴 PASTE YOUR REAL MODEL LINK HERE
const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/";

let model;

async function loadModel() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  console.log("Model loaded");
}

loadModel();

// 📷 Camera
function openCamera() {
  const input = document.getElementById("fileInput");
  input.capture = "environment";
  input.click();
}

// 🖼 Gallery
function openGallery() {
  const input = document.getElementById("fileInput");
  input.removeAttribute("capture");
  input.click();
}

// When image selected
document.getElementById("fileInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);
  img.style.display = "block";

  img.onload = async () => {
    const prediction = await model.predict(img);

    let resultText = "";
    prediction.forEach(p => {
      resultText += `${p.className}: ${(p.probability * 100).toFixed(2)}%<br>`;
    });

    document.getElementById("result").innerHTML = resultText;
  };
});

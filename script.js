// script.js
// Replace with your actual backend endpoint that accepts a file and returns JSON.
// Example response expected:
// { foodName: "Orange juice", calories: "110 kcal", nutrients: "...", benefits: "...", bestTime: "...", category: "Juice" }
const PREDICT_URL = "https://your-api.example/predict";

const fileInput = document.getElementById("imageInput"); // change if your input id differs
const chooseFileLabel = document.getElementById("chooseFileLabel"); // optional: shows file name
const statusBox = document.getElementById("statusBox"); // optional: status text
const btnDetect = document.getElementById("detectBtn"); // optional: if you have a button

// Output fields (IDs should match HTML)
const outFoodName = document.getElementById("foodName");
const outCalories = document.getElementById("calories");
const outNutrients = document.getElementById("nutrients");
const outBenefits = document.getElementById("benefits");
const outBestTime = document.getElementById("bestTime");
const outCategory = document.getElementById("category");

// utility to clear UI
function clearOutputs() {
  outFoodName.textContent = "—";
  outCalories.textContent = "—";
  outNutrients.textContent = "—";
  outBenefits.textContent = "—";
  outBestTime.textContent = "—";
  outCategory.textContent = "—";
}

// show status
function setStatus(msg) {
  if (statusBox) statusBox.textContent = msg;
  console.log("STATUS:", msg);
}

// handle response JSON safely
function updateOutputs(data) {
  // defensive: check keys exist
  outFoodName.textContent = data.foodName ?? "—";
  outCalories.textContent = data.calories ?? "—";
  outNutrients.textContent = data.nutrients ?? "—";
  outBenefits.textContent = data.benefits ?? "—";
  outBestTime.textContent = data.bestTime ?? "—";
  outCategory.textContent = data.category ?? "—";
}

// main upload-and-detect function
async function uploadAndDetect(file) {
  clearOutputs();
  setStatus("Uploading image…");
  const fm = new FormData();
  fm.append("image", file);

  try {
    const resp = await fetch(PREDICT_URL, {
      method: "POST",
      body: fm,
      // NOTE: Do not set Content-Type to multipart/form-data manually — browser sets boundary automatically.
      // If you're using a JSON endpoint, you must base64 the image and send JSON instead.
    });

    setStatus(`Response status: ${resp.status}`);
    if (!resp.ok) {
      const text = await resp.text();
      console.error("Server error:", resp.status, text);
      setStatus("Server returned an error. See console for details.");
      return;
    }

    // parse JSON
    const data = await resp.json();
    console.log("Server response JSON:", data);
    updateOutputs(data);
    setStatus("Done.");
  } catch (err) {
    // network or CORS error
    console.error("Network or CORS error:", err);
    if (err instanceof TypeError) {
      // fetch TypeError often indicates network failure or CORS in browsers
      setStatus("Network/CORS error — check console. Is the server reachable and CORS-enabled?");
    } else {
      setStatus("Unexpected error — see console.");
    }
  }
}

// event: when file selected
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setStatus("No file chosen.");
      return;
    }
    if (chooseFileLabel) chooseFileLabel.textContent = file.name;
    setStatus("File selected: " + file.name);

    // direct auto-detect when chosen; if you prefer a "Detect" button, call uploadAndDetect(file) on button click
    uploadAndDetect(file);
  });
}

// optional: detect button if you have one
if (btnDetect) {
  btnDetect.addEventListener("click", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      setStatus("Please choose an image first.");
      return;
    }
    uploadAndDetect(file);
  });
              }

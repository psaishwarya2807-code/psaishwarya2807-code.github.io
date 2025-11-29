// script.js
// MobileNet-based food/object classifier for image picked from camera or gallery.
// Expects these elements in your HTML:
//   <button id="takePhotoBtn">Take Photo</button>
//   <button id="choosePhotoBtn">Choose from Gallery</button>
//   <div id="status"></div>
//   <img id="preview" alt="preview" style="max-width:90%;height:auto;display:block;margin:20px auto;">
//   <div id="result"></div>

(async () => {
  const TFJS_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.12.0/dist/tf.min.js";
  const MOBILENET_URL = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js";

  const statusEl = document.getElementById("status") || createStatus();
  const previewImg = document.getElementById("preview") || createPreviewImg();
  const resultEl = document.getElementById("result") || createResultDiv();

  // Buttons
  const takeBtn = document.getElementById("takePhotoBtn") || createButton("takePhotoBtn", "Take Photo");
  const chooseBtn = document.getElementById("choosePhotoBtn") || createButton("choosePhotoBtn", "Choose from Gallery");

  // Helper: dynamically add script tag and wait for load
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        // already present
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve();
      s.onerror = (e) => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });
  }

  // Load TF and MobileNet
  statusEl.innerText = "Loading TensorFlow.js...";
  try {
    await loadScript(TFJS_URL);
    statusEl.innerText = "Loading MobileNet model...";
    await loadScript(MOBILENET_URL);
  } catch (err) {
    statusEl.innerText = "Error loading libraries. Check network.";
    console.error(err);
    return;
  }

  // Wait for the global tf and mobilenet to be available
  if (typeof tf === "undefined" || typeof mobilenet === "undefined") {
    statusEl.innerText = "TensorFlow or MobileNet not found.";
    return;
  }

  // Load the model (this may take a second)
  let model = null;
  try {
    model = await mobilenet.load({ version: 2, alpha: 1.0 }); // good balance
    statusEl.innerText = "Model loaded. Choose a photo or take one.";
  } catch (err) {
    statusEl.innerText = "Failed to load model.";
    console.error(err);
    return;
  }

  // Create two hidden file inputs (one with camera capture, one regular)
  const cameraInput = document.createElement("input");
  cameraInput.type = "file";
  cameraInput.accept = "image/*";
  cameraInput.capture = "environment";
  cameraInput.style.display = "none";

  const galleryInput = document.createElement("input");
  galleryInput.type = "file";
  galleryInput.accept = "image/*";
  galleryInput.style.display = "none";

  document.body.appendChild(cameraInput);
  document.body.appendChild(galleryInput);

  // Wire up buttons
  takeBtn.addEventListener("click", () => cameraInput.click());
  chooseBtn.addEventListener("click", () => galleryInput.click());

  // Handle file selection for both inputs
  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.onload = async () => {
      // revoke object URL after loaded to free memory
      URL.revokeObjectURL(url);
      await classifyImage(previewImg);
    };
  }

  cameraInput.addEventListener("change", (e) => handleFiles(e.target.files));
  galleryInput.addEventListener("change", (e) => handleFiles(e.target.files));

  // Main classify function
  async function classifyImage(imageElement) {
    if (!model) {
      statusEl.innerText = "Model not loaded yet.";
      return;
    }
    statusEl.innerText = "Classifying image...";
    resultEl.innerHTML = ""; // clear
    try {
      // MobileNet returns array of {className, probability}
      const predictions = await model.classify(imageElement, 5);
      statusEl.innerText = "Top results:";
      if (!predictions || predictions.length === 0) {
        resultEl.innerHTML = "<p>No predictions.</p>";
        return;
      }

      // Build result display
      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.padding = "0";
      ul.style.maxWidth = "360px";
      ul.style.margin = "10px auto";
      predictions.forEach((p) => {
        const li = document.createElement("li");
        li.style.margin = "8px 0";
        // show class and confidence as percentage to 2 decimals
        const percent = (p.probability * 100).toFixed(2);
        li.innerHTML = `<strong>${escapeHtml(p.className)}</strong> — ${percent}%`;
        ul.appendChild(li);
      });
      resultEl.appendChild(ul);

      // Optionally: highlight if one of top labels is a food item
      const topLabel = predictions[0].className.toLowerCase();
      if (isLikelyFood(topLabel)) {
        const foodNotice = document.createElement("p");
        foodNotice.style.textAlign = "center";
        foodNotice.style.fontWeight = "600";
        foodNotice.innerText = `Detected food: ${predictions[0].className} (${(predictions[0].probability*100).toFixed(1)}%)`;
        resultEl.insertBefore(foodNotice, ul);
      }

    } catch (err) {
      console.error(err);
      statusEl.innerText = "Error during classification.";
      resultEl.innerHTML = "<p>Classification failed. See console for details.</p>";
    }
  }

  // Basic heuristic for deciding if the top label is a food.
  // MobileNet labels include many food names (banana, orange, pizza, hotdog, etc.)
  function isLikelyFood(labelLower) {
    const foodKeywords = [
      "banana","apple","orange","pizza","hotdog","hamburger","sandwich","cake",
      "hotdog","sushi","egg","salad","steak","waffle","pasta","spaghetti","vegetable",
      "fruit","ice cream","bagel","bread","donut","meat","cheeseburger","cucumber"
    ];
    return foodKeywords.some(k => labelLower.includes(k));
  }

  // Small HTML helper functions (create if elements missing)
  function createStatus() {
    const d = document.createElement("div");
    d.id = "status";
    d.style.textAlign = "center";
    d.style.marginTop = "10px";
    document.body.insertBefore(d, document.body.firstChild);
    return d;
  }
  function createPreviewImg() {
    const img = document.createElement("img");
    img.id = "preview";
    img.alt = "Preview";
    img.style.maxWidth = "90%";
    img.style.height = "auto";
    img.style.display = "block";
    img.style.margin = "20px auto";
    document.body.appendChild(img);
    return img;
  }
  function createResultDiv() {
    const d = document.createElement("div");
    d.id = "result";
    d.style.maxWidth = "420px";
    d.style.margin = "5px auto 40px";
    document.body.appendChild(d);
    return d;
  }
  function createButton(id, text) {
    const b = document.createElement("button");
    b.id = id;
    b.innerText = text;
    b.style.margin = "10px";
    b.style.padding = "12px 18px";
    b.style.fontSize = "16px";
    document.body.insertBefore(b, document.body.firstChild);
    return b;
  }

  // small escape for html injection safety in className display
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

})();

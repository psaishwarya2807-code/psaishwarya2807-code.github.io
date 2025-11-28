const cameraBtn = document.getElementById('cameraBtn');
const galleryBtn = document.getElementById('galleryBtn');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const resultDiv = document.getElementById('result');

let model;

// Load TensorFlow.js model
async function loadModel() {
  model = await tf.loadLayersModel('model/model.json'); // replace with your path
  console.log("Model loaded");
}
loadModel();

// Camera button
cameraBtn.addEventListener('click', () => {
  imageInput.setAttribute('capture', 'environment'); // use camera
  imageInput.click();
});

// Gallery button
galleryBtn.addEventListener('click', () => {
  imageInput.removeAttribute('capture'); // open gallery
  imageInput.click();
});

// Handle image selection
imageInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Show preview
  preview.src = URL.createObjectURL(file);

  preview.onload = async () => {
    const tensor = preprocessImage(preview);
    const prediction = await model.predict(tensor).data();
    console.log("Raw prediction:", prediction);

    // Replace with your actual classes
    const classes = ['Healthy', 'Junk'];
    const classIndex = prediction.indexOf(Math.max(...prediction));
    resultDiv.innerText = `Prediction: ${classes[classIndex]}`;
  };
});

// Preprocess image
function preprocessImage(img) {
  let tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224]) // adjust to your model
    .toFloat()
    .expandDims();
  return tensor.div(255.0); // normalize if needed
}

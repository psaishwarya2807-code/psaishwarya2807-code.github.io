// Select elements
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const resultDiv = document.getElementById('result');

// Load your pre-trained TensorFlow.js model
let model;
async function loadModel() {
  // Replace with your model path
  model = await tf.loadLayersModel('model/model.json');
  console.log("Model loaded");
}
loadModel();

// Handle image selection
imageInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Show image preview
  preview.src = URL.createObjectURL(file);

  // Wait for the image to load
  preview.onload = async () => {
    const tensor = preprocessImage(preview);
    const prediction = await model.predict(tensor).data();
    
    // Assuming single-label classification
    const classIndex = prediction.indexOf(Math.max(...prediction));
    const classes = ['Healthy', 'Junk']; // Replace with your actual classes
    resultDiv.innerText = `Prediction: ${classes[classIndex]}`;
  };
});

// Preprocess image to feed into model
function preprocessImage(img) {
  let tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224]) // adjust size as per your model
    .toFloat()
    .expandDims();
  return tensor.div(255.0); // normalize if your model expects [0,1]
}

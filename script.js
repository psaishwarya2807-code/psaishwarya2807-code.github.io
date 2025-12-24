const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const result = document.getElementById("result");

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    result.innerText = "";
  }
});

function analyzeFood() {
  if (!imageInput.files.length) {
    alert("Please upload an image");
    return;
  }

  // Dummy result (AI backend will be added later)
  const foods = ["Healthy Food 🥗", "Junk Food 🍔"];
  const random = Math.floor(Math.random() * foods.length);
  result.innerText = "Result: " + foods[random];
}

alert("Website JS connected!");

const cameraInput = document.getElementById("cameraInput");
const galleryInput = document.getElementById("galleryInput");
const preview = document.getElementById("preview");

function openCamera() {
  cameraInput.click();
}

function openGallery() {
  galleryInput.click();
}

cameraInput.addEventListener("change", showImage);
galleryInput.addEventListener("change", showImage);

function showImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
}

const input = document.getElementById("imageInput");
const preview = document.getElementById("preview");

input.addEventListener("change", () => {
    const file = input.files[0];

    if (!file) {
        alert("No file selected!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
    };

    reader.onerror = function () {
        alert("Error reading file!");
    };

    reader.readAsDataURL(file);
});

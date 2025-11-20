const foods = {
    "apple": {
        type: "Healthy",
        ingredients: "Apple",
        benefits: "Rich in fiber, vitamins, boosts immunity",
        bestTime: "Morning"
    },
    "burger": {
        type: "Junk",
        ingredients: "Bread, cheese, patty, sauces",
        benefits: "Tasty but high in fat",
        bestTime: "Occasionally, not daily"
    }
};

document.getElementById("imageUpload").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    // Show preview
    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

    // Simple dummy classifier
    let foodName = "apple";
    if (file.name.toLowerCase().includes("burger")) {
        foodName = "burger";
    }

    const data = foods[foodName];

    document.getElementById("result").innerHTML = `
        <p><b>Food Detected:</b> ${foodName}</p>
        <p><b>Type:</b> ${data.type}</p>
        <p><b>Ingredients:</b> ${data.ingredients}</p>
        <p><b>Benefits:</b> ${data.benefits}</p>
        <p><b>Best Time to Eat:</b> ${data.bestTime}</p>
    `;
});

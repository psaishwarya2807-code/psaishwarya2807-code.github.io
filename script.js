document.getElementById("fileInput").addEventListener("change", function () {
    let file = this.files[0];
    if (!file) return;

    // Show preview
    let reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("preview").src = e.target.result;
    };
    reader.readAsDataURL(file);

    // ------ Food Info Database ------
    let foods = {
        "banana": {
            calories: "105 kcal",
            nutrients: "Potassium, Vitamin C, Fiber",
            benefits: "Boosts energy, good for digestion",
            time: "Morning or afternoon",
            category: "Healthy"
        },
        "apple": {
            calories: "95 kcal",
            nutrients: "Fiber, Vitamin C, Antioxidants",
            benefits: "Improves heart health, aids digestion",
            time: "Morning",
            category: "Healthy"
        },
        "pizza": {
            calories: "266 kcal per slice",
            nutrients: "Carbs, fats, protein",
            benefits: "Good for cravings",
            time: "Lunch or evening",
            category: "Junk"
        }
    };

    // ------ Predict Food Name (simple keyword match) ------
    let predicted = "Unknown Food";

    Object.keys(foods).forEach(food => {
        if (file.name.toLowerCase().includes(food)) {
            predicted = food;
        }
    });

    // ------ Display Result ------
    if (foods[predicted]) {
        document.getElementById("foodName").innerText = predicted;
        document.getElementById("calories").innerText = foods[predicted].calories;
        document.getElementById("nutrients").innerText = foods[predicted].nutrients;
        document.getElementById("benefits").innerText = foods[predicted].benefits;
        document.getElementById("time").innerText = foods[predicted].time;
        document.getElementById("category").innerText = foods[predicted].category;
    } else {
        document.getElementById("foodName").innerText = "Not in database";
        document.getElementById("calories").innerText = "—";
        document.getElementById("nutrients").innerText = "—";
        document.getElementById("benefits").innerText = "—";
        document.getElementById("time").innerText = "—";
        document.getElementById("category").innerText = "—";
    }
});

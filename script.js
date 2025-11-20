// script.js
// Advanced food detection: MobileNet (on-device) + optional HuggingFace fallback.
//
// Optional: set this to your Hugging Face token (paste between quotes) for a server-side
// fallback classification that can increase accuracy for some foods.
// If left empty, the code will only use MobileNet locally.
const HUGGINGFACE_API_TOKEN = ""; // <-- OPTIONAL: put your HF token here, e.g. "hf_xxx"

// --- Food database and keyword mapping (many Indian + common foods) ---
const FOOD_DB = {
  apple: { type: "Healthy", ingredients: "Apple", benefits: "Fiber, vitamin C", bestTime: "Morning", keywords: ["apple"] },
  banana: { type: "Healthy", ingredients: "Banana", benefits: "Potassium, energy", bestTime: "Morning", keywords: ["banana"] },
  orange: { type: "Healthy", ingredients: "Orange", benefits: "Vitamin C", bestTime: "Morning", keywords: ["orange", "mandarin", "tangerine"] },
  grapes: { type: "Healthy", ingredients: "Grapes", benefits: "Antioxidants", bestTime: "Snack", keywords: ["grape","grapes"] },
  pizza: { type: "Junk", ingredients: "Cheese, dough", benefits: "Tasty", bestTime: "Occasionally", keywords: ["pizza","pepperoni","pizza pie"] },
  burger: { type: "Junk", ingredients: "Bun, patty", benefits: "Protein but high fat", bestTime: "Occasionally", keywords: ["burger","hamburger","cheeseburger"] },
  fries: { type: "Junk", ingredients: "Potato, oil", benefits: "Snack", bestTime: "Occasionally", keywords: ["french fries","fries"] },
  cake: { type: "Junk", ingredients: "Flour, sugar", benefits: "Dessert", bestTime: "Occasionally", keywords: ["cake","cheesecake","cupcake"] },
  icecream: { type: "Junk", ingredients: "Milk, sugar", benefits: "Dessert", bestTime: "Afternoon", keywords: ["ice cream","gelato","icecream"] },
  idli: { type: "Healthy", ingredients: "Rice, urad dal", benefits: "Easily digestible", bestTime: "Breakfast", keywords: ["idli","steamed rice cake"] },
  dosa: { type: "Healthy", ingredients: "Rice, lentils", benefits: "Good carbs & protein", bestTime: "Breakfast", keywords: ["dosa","masala dosa","pancake"] },
  vada: { type: "Junk", ingredients: "Lentils, oil", benefits: "Snack", bestTime: "Snack", keywords: ["vada","vadai","donut","fritter"] },
  samosa: { type: "Junk", ingredients: "Potato, pastry", benefits: "Snack", bestTime: "Evening", keywords: ["samosa"] },
  biryani: { type: "Depends", ingredients: "Rice, spices, meat/veg", benefits: "Hearty meal", bestTime: "Lunch", keywords: ["biryani","pilaf","pulao","biriyani"] },
  rice: { type: "Healthy", ingredients: "Rice", benefits: "Carbs for energy", bestTime: "Lunch", keywords: ["rice","fried rice"] },
  chapati: { type: "Healthy", ingredients: "Wheat flour", benefits: "Fiber and carbs", bestTime: "Anytime", keywords: ["chapati","roti","flatbread"] },
  paratha: { type: "Junk", ingredients: "Wheat, oil", benefits: "Filling", bestTime: "Breakfast", keywords: ["paratha"] },
  chicken: { type: "Healthy", ingredients: "Chicken", benefits: "Protein", bestTime: "Lunch/Dinner", keywords: ["chicken","roast chicken","grilled chicken"] },
  fish: { type: "Healthy", ingredients: "Fish", benefits: "Omega-3", bestTime: "Lunch/Dinner", keywords: ["fish","fried fish"] },
  noodles: { type: "Junk", ingredients: "Noodles", benefits: "Quick meal", bestTime: "Occasionally", keywords: ["noodle","noodles","ramen","spaghetti"] },
  momos: { type: "Junk", ingredients: "Dough, filling", benefits: "Snack/meal", bestTime: "Snack", keywords: ["momo","momos","dumpling"] },
  paneer: { type: "Healthy", ingredients: "Paneer", benefits: "Protein, calcium", bestTime: "Lunch/Dinner", keywords: ["paneer","cottage cheese","paneer tikka"] },
  salad: { type: "Healthy", ingredients: "Vegetables", benefits: "Low-calorie, vitamins", bestTime: "Anytime", keywords: ["salad","green salad"] },
  tea: { type: "Drink", ingredients: "Tea leaves, water", benefits: "Refreshment", bestTime: "Morning/Evening", keywords: ["tea","cup of tea"] },
  coffee: { type: "Drink", ingredients: "Coffee beans, water", benefits: "Caffeine boost", bestTime: "Morning", keywords: ["coffee","espresso","latte"] },
  egg: { type: "Healthy", ingredients: "Egg", benefits: "Protein & vitamins", bestTime: "Morning", keywords: ["egg","omelette","fried egg"] }
};

// --- Utilities ---
function showLoader(show) {
  // simple UI hooks — uses elements from index.html
  const resBox = document.getElementById('result');
  if (!resBox) return;
  if (show) {
    resBox.innerHTML = "<div style='text-align:center;padding:18px;'>Detecting &hellip;</div>";
    resBox.style.display = "block";
  }
}
function showUnknown() {
  const resBox = document.getElementById('result');
  resBox.innerHTML = `<h3>Food Detected: Unknown</h3><p>Please try a clearer photo or a different angle.</p>`;
  resBox.style.display = "block";
}
function showResult(key, confidence, topLabel) {
  const entry = FOOD_DB[key];
  const resBox = document.getElementById('result');
  resBox.innerHTML = `
    <h2 style="text-transform:uppercase">${key}</h2>
    <p><b>Type:</b> ${entry.type}</p>
    <p><b>Ingredients:</b> ${entry.ingredients}</p>
    <p><b>Benefits:</b> ${entry.benefits}</p>
    <p><b>Best time to eat:</b> ${entry.bestTime}</p>
    <p style="color:#666; margin-top:8px; font-size:13px">Confidence: ${(confidence*100).toFixed(1)}% (${topLabel})</p>
  `;
  resBox.style.display = "block";
}

// Look for a keyword match in a label
function matchLabelToFood(label) {
  label = label.toLowerCase();
  for (const key in FOOD_DB) {
    const kws = FOOD_DB[key].keywords || [key];
    for (const kw of kws) {
      if (label.includes(kw)) return key;
    }
  }
  return null;
}

// --- MobileNet on-device logic ---
let mobilenetModel = null;
async function ensureMobileNetLoaded() {
  if (mobilenetModel) return mobilenetModel;

  // dynamically load tfjs and mobilenet if not present
  if (!window.tf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.12.0/dist/tf.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  if (!window.mobilenet) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  mobilenetModel = await window.mobilenet.load({ version: 2, alpha: 1.0 });
  return mobilenetModel;
}

// Run mobilenet classify and try to match labels
async function classifyWithMobileNet(imgElement) {
  try {
    await ensureMobileNetLoaded();
    const predictions = await mobilenetModel.classify(imgElement, 8); // top 8 predictions
    if (!predictions || !predictions.length) return null;
    // try to map the best labels to our FOOD_DB keywords
    for (const p of predictions) {
      const found = matchLabelToFood(p.className);
      if (found) return { key: found, confidence: p.probability, label: p.className };
    }
    // no keyword match
    return { predictions }; // return raw preds so caller can decide fallback
  } catch (err) {
    console.error("MobileNet error:", err);
    return null;
  }
}

// --- Optional Hugging Face fallback ---
// This function sends the image blob to HF inference API. Needs a token for reasonable quota.
async function classifyWithHuggingFace(imageBlob) {
  if (!HUGGINGFACE_API_TOKEN) return null;
  try {
    // choose a general image-classification model; change if you prefer a specific food model
    const HF_MODEL = "google/vit-base-patch16-224"; // general vision model
    const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        Accept: "application/json"
      },
      body: imageBlob
    });

    if (!resp.ok) {
      console.warn("HF API response:", resp.status, await resp.text());
      return null;
    }
    const data = await resp.json(); // array of {label, score}
    if (!Array.isArray(data) || !data.length) return null;

    // try to match HF labels to our food DB
    for (const item of data) {
      const lbl = (item.label || item.class || "").toLowerCase();
      const found = matchLabelToFood(lbl);
      if (found) return { key: found, confidence: item.score ?? item.probability, label: item.label };
    }
    return { raw: data };
  } catch (err) {
    console.error("HuggingFace error:", err);
    return null;
  }
}

// --- Main handler for file input ---
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("imageUpload") || document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const resultBox = document.getElementById("result");

  if (!fileInput) {
    console.warn("No file input with id 'imageUpload' or 'imageInput' found.");
    return;
  }

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // show preview
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    resultBox.style.display = "none";

    // small delay to ensure image is painted
    await new Promise(r => setTimeout(r, 250));

    showLoader(true);

    // 1) Try MobileNet first
    const mobileResult = await classifyWithMobileNet(preview);
    if (mobileResult && mobileResult.key) {
      showResult(mobileResult.key, mobileResult.confidence || 0, mobileResult.label || "mobilenet");
      return;
    }

    // If MobileNet returned raw predictions but no mapped keyword, optionally fallback to HF
    if (!HUGGINGFACE_API_TOKEN) {
      // no HF token — show unknown or try to make best guess
      // try to pick top label and see if any partial keyword matches
      if (mobileResult && mobileResult.predictions && mobileResult.predictions.length) {
        const top = mobileResult.predictions[0];
        const maybe = matchLabelToFood(top.className);
        if (maybe) {
          showResult(maybe, top.probability || 0, top.className);
          return;
        }
      }
      showUnknown();
      return;
    }

    // 2) If HF token available, send blob to HF inference API as fallback
    try {
      const blob = await (await fetch(preview.src)).blob();
      const hfResult = await classifyWithHuggingFace(blob);
      if (hfResult && hfResult.key) {
        showResult(hfResult.key, hfResult.confidence || 0, hfResult.label || "hf");
        return;
      }
      // if HF returned raw labels, try mapping top label
      if (hfResult && Array.isArray(hfResult.raw) && hfResult.raw.length) {
        const top = hfResult.raw[0];
        const maybe = matchLabelToFood(top.label || top.class || "");
        if (maybe) {
          showResult(maybe, top.score || 0, top.label || top.class);
          return;
        }
      }
    } catch (err) {
      console.error("HF fallback failed:", err);
    }

    // none matched
    showUnknown();
  });
});

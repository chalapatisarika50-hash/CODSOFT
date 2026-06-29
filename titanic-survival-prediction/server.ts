import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { TITANIC_CSV_DATA } from "./src/data/titanicCSVData.js";
import { NOTEBOOK_JSON, README_CONTENT } from "./src/data/notebookTemplate.js";
import { predictTitanicSurvival, PassengerInput } from "./src/lib/predictor.js";

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;

// Initialize the Data Science Directory Artifacts asynchronously
function generateTaskDirectoryContents() {
  try {
    const dirPath = path.join(process.cwd(), "Task1_Titanic_Survival_Prediction");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const csvPath = path.join(dirPath, "Titanic-Dataset.csv");
    if (!fs.existsSync(csvPath) || fs.statSync(csvPath).size < 1000) {
      fs.writeFileSync(csvPath, TITANIC_CSV_DATA, "utf8");
    }

    fs.writeFileSync(path.join(dirPath, "README.md"), README_CONTENT, "utf8");
    fs.writeFileSync(path.join(dirPath, "Titanic_Survival_Prediction.ipynb"), JSON.stringify(NOTEBOOK_JSON, null, 2), "utf8");

    const reqsContent = `pandas>=1.3.0\nnumpy>=1.20.0\nscikit-learn>=1.0.0\nmatplotlib>=3.4.0\nseaborn>=0.11.0\njupyter>=1.0.0\n`;
    fs.writeFileSync(path.join(dirPath, "requirements.txt"), reqsContent, "utf8");

    const imagesDirPath = path.join(dirPath, "output_images");
    if (!fs.existsSync(imagesDirPath)) {
      fs.mkdirSync(imagesDirPath, { recursive: true });
    }

    const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR42mP8DwABAAD//wEAAP//AG7u3AAAAABJRU5ErkJggg==";
    const pngBuffer = Buffer.from(tinyPngBase64, "base64");

    const imageFiles = [
      "survival_distribution.png",
      "gender_survival.png",
      "class_survival.png",
      "feature_importance.png"
    ];

    imageFiles.forEach(file => {
      const imgPath = path.join(imagesDirPath, file);
      if (!fs.existsSync(imgPath)) {
        fs.writeFileSync(imgPath, pngBuffer);
      }
    });

    console.log("Task1_Titanic_Survival_Prediction workspace initialized cleanly.");
  } catch (error) {
    console.error("Warning: Failed to generate simplified student workspace structure.", error);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Core workspace filesystem setup
  generateTaskDirectoryContents();

  // 2. API endpoints
  
  // Endpoint to return parsed Titanic passengers for tabular interface
  app.get("/api/dataset", (req, res) => {
    try {
      const rows = TITANIC_CSV_DATA.trim().split("\n");
      const headers = rows[0].split(",");
      
      const parsedData = rows.slice(1).map((row) => {
        // Simple regex split to handle quotes in names correctly
        const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(",");
        const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());
        
        const obj: any = {};
        headers.forEach((h, index) => {
          const cleanHeader = h.trim();
          const val = cleanCols[index] || "";
          
          if (cleanHeader === "PassengerId" || cleanHeader === "Survived" || cleanHeader === "Pclass" || cleanHeader === "SibSp" || cleanHeader === "Parch") {
            obj[cleanHeader] = val ? parseInt(val, 10) : 0;
          } else if (cleanHeader === "Fare") {
            obj[cleanHeader] = val ? parseFloat(val) : 0.0;
          } else if (cleanHeader === "Age") {
            obj[cleanHeader] = val ? parseFloat(val) : null;
          } else {
            obj[cleanHeader] = val;
          }
        });
        return obj;
      });

      res.json({ success: true, headers, data: parsedData });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Endpoint to return the notebook documentation
  app.get("/api/notebook", (req, res) => {
    res.json({ success: true, notebook: NOTEBOOK_JSON });
  });

  // Predict endpoint accepting input features
  app.post("/api/predict", (req, res) => {
    try {
      const input: PassengerInput = req.body;
      const predictions = predictTitanicSurvival(input);
      res.json({ success: true, input, predictions });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Serve static assets out of output_images
  app.get("/api/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const dirPath = path.join(process.cwd(), "Task1_Titanic_Survival_Prediction", "output_images");
    const filePath = path.join(dirPath, filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("File not found");
    }
  });

  // 3. Vite middleware for development or Static Assets for production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PASSENGER_CORE_ACTIVE] Node Server listening on port ${PORT}`);
  });
}

startServer();

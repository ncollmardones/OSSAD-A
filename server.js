import ee from "@google/earthengine";
import fs from "fs";
import express from "express";
import cors from "cors";

const app = express();

// En producción, solo permite tu dominio de Netlify
const allowedOrigins = [
  "https://monitoreo-salares-ossada.netlify.app",
  "http://localhost:5173", // para desarrollo local
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

/* =========================
   AUTH EARTH ENGINE
   La clave se lee desde variable de entorno GEE_KEY (JSON string)
   En Railway/Render: pegar el contenido de key.json como variable de entorno
========================= */

function initEarthEngine() {
  return new Promise((resolve, reject) => {
    let privateKey;

    try {
      // Producción: variable de entorno GEE_KEY con el JSON completo
      if (process.env.GEE_KEY) {
        privateKey = JSON.parse(process.env.GEE_KEY);
      } else {
        // Fallback local: leer archivo (solo desarrollo)
        privateKey = JSON.parse(fs.readFileSync("./key.json", "utf8"));
      }
    } catch (e) {
      return reject(new Error("No se pudo cargar la clave GEE: " + e.message));
    }

    ee.data.authenticateViaPrivateKey(
      privateKey,
      () => {
        console.log("✅ Earth Engine autenticado");
        ee.initialize(null, null, resolve, reject);
      },
      reject
    );
  });
}

/* =========================
   FUNCIONES LANDSAT
========================= */

function renameL89(img) {
  return img.select(
    ["SR_B2", "SR_B3", "SR_B4", "SR_B5", "SR_B6", "SR_B7", "QA_PIXEL"],
    ["blue", "green", "red", "nir", "swir1", "swir2", "QA_PIXEL"]
  );
}

function maskQA(img) {
  const qa = img.select("QA_PIXEL");
  const mask = qa.bitwiseAnd(1 << 3)  // cloud
    .or(qa.bitwiseAnd(1 << 4))         // cloud shadow
    .or(qa.bitwiseAnd(1 << 5))         // snow
    .or(qa.bitwiseAnd(1 << 1))         // dilated cloud
    .eq(0);
  return img.updateMask(mask);
}

function scaleSR(img) {
  const optical = img
    .select(["blue", "green", "red", "nir", "swir1", "swir2"])
    .multiply(0.0000275)
    .add(-0.2);
  return img.addBands(optical, null, true);
}

function getLandsatSR(start, end, geom) {
  const L8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    .filterBounds(geom)
    .filterDate(start, end)
    .map(renameL89);

  const L9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
    .filterBounds(geom)
    .filterDate(start, end)
    .map(renameL89);

  return L8.merge(L9).map(maskQA).map(scaleSR);
}

/* =========================
   HELPER: ESTACIÓN → FECHAS
========================= */

function seasonToDates(season, year) {
  const y = Number(year);
  const ranges = {
    verano:    [`${y}-12-01`,   `${y + 1}-02-28`],
    otoño:     [`${y}-03-01`,   `${y}-05-31`],
    invierno:  [`${y}-06-01`,   `${y}-08-31`],
    primavera: [`${y}-09-01`,   `${y}-11-30`],
  };
  return ranges[season] ?? null;
}

/* =========================
   ENDPOINT PRINCIPAL
========================= */

app.post("/api/analyze", async (req, res) => {
  try {
    const { salar, season, year } = req.body;

    if (!salar || !season || !year) {
      return res.status(400).json({ error: "Faltan parámetros: salar, season, year." });
    }

    const dates = seasonToDates(season, year);
    if (!dates) {
      return res.status(400).json({ error: `Estación no válida: ${season}` });
    }

    const [startDate, endDate] = dates;
    console.log(`📍 Salar: ${salar} | 🗓 ${startDate} → ${endDate}`);

    const salares = ee.FeatureCollection(
      "projects/appossada/assets/SistemasSalinosSNGM2023"
    );
    const roi = salares.filter(ee.Filter.eq("Nombre", salar)).geometry();

    const collection = getLandsatSR(startDate, endDate, roi);
    const count = await collection.size().getInfo();
    console.log(`🛰 Imágenes encontradas: ${count}`);

    if (count === 0) {
      return res.status(400).json({
        error: "No hay imágenes disponibles para ese período.",
      });
    }

    const ndwi = collection
      .map((img) =>
        img.normalizedDifference(["green", "nir"]).rename("NDWI")
      )
      .median()
      .clip(roi);

    const map = await ndwi.getMap({
      min: -0.5,
      max: 0.5,
      palette: ["brown", "yellow", "blue"],
    });

    res.json({ mapUrl: map.urlFormat });

  } catch (error) {
    console.error("❌ Error en análisis:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check (útil para Railway/Render)
app.get("/health", (_req, res) => res.json({ status: "ok" }));

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

initEarthEngine()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ No se pudo iniciar Earth Engine:", err);
    process.exit(1);
  });
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/course/:id", async (req, res) => {
  const {id} = req.params;
  app.use(cors({ origin: "http://localhost:5173" }));
  try {
    const response = await fetch(`https://gw-uio.intark.uh-it.no/tp-uio/ws/1.4/open/?type=course&id=${id}&sem=25h`, {
      headers: {
        "X-Gravitee-Api-Key": process.env.TP_API_KEY || ""
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

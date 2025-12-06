import express from "express";
import cors from "cors";
import tokenAnalyzer from "./modules/tokenAnalyzer.js";
import walletAnalyzer from "./modules/walletAnalyzer.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({ status: "NEXA-GUARD backend is running" });
});

// Token analizi
app.post("/api/analyze/token", async (req, res) => {
  const { tokenAddress } = req.body;
  if (!tokenAddress) {
    return res.status(400).json({ error: "Token address missing" });
  }

  const result = await tokenAnalyzer(tokenAddress);
  res.json(result);
});

// Cüzdan analizi
app.post("/api/analyze/wallet", async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address missing" });
  }

  const result = await walletAnalyzer(walletAddress);
  res.json(result);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`NEXA-GUARD backend running on http://localhost:${PORT}`);
});

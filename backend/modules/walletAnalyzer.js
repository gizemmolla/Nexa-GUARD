import axios from "axios";
import analyzeToken from "./tokenAnalyzer.js";

export default async function analyzeWallet(address) {
  try {
    const resp = await axios.post(
      "https://fullnode.mainnet.sui.io:443",
      {
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getOwnedObjects",
        params: [address]
      }
    );

    const data = resp.data.result;
    if (!data || !data.data) {
      return { error: "Cüzdan veya obje bulunamadı." };
    }

    const owned = data.data;
    const results = [];

    // Basit demo: wallet içindeki her objeyi token gibi analiz et
    for (const obj of owned) {
      const objectId = obj.data?.objectId || obj.objectId;
      if (!objectId) continue;

      const analysis = await analyzeToken(objectId);
      if (!analysis.error) {
        results.push({
          token: objectId,
          riskScore: analysis.riskScore,
          risks: analysis.risks
        });
      }
    }

    return {
      wallet: address,
      tokens: results
    };
  } catch (err) {
    console.error(err.message);
    return { error: "Wallet analysis failed: " + err.message };
  }
}

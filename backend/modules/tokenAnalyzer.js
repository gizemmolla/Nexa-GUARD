import axios from "axios";

// Basit risk hesaplama
function calcScore(risks) {
  let s = 100;
  if (risks.unlimitedMint) s -= 40;
  if (risks.anyoneCanMint) s -= 30;
  if (risks.hasPause) s -= 10;
  if (risks.upgradeable) s -= 20;
  if (s < 0) s = 0;
  return s;
}

export default async function analyzeToken(address) {
  try {
    // Şimdilik: Sui RPC'yi kaba şekilde okuyalım
    const resp = await axios.post(
      "https://fullnode.mainnet.sui.io:443",
      {
        jsonrpc: "2.0",
        id: 1,
        method: "sui_getObject",
        params: [address, { showContent: true }]
      }
    );

    const obj = resp.data.result;
    if (!obj) return { error: "Token bulunamadı." };

    // Demo için: raw JSON üzerinde string taraması
    const raw = JSON.stringify(obj);

    const risks = {
      unlimitedMint: raw.includes("mint") && !raw.includes("cap"),
      anyoneCanMint: raw.includes("public entry fun mint"),
      hasPause: raw.toLowerCase().includes("pause"),
      upgradeable: raw.toLowerCase().includes("upgrade"),
    };

    const riskScore = calcScore(risks);

    return {
      token: address,
      riskScore,
      risks,
      ai_summary: `
Bu token için yapılan hızlı analizde:
- Unlimited mint riski: ${risks.unlimitedMint ? "VAR" : "YOK"}
- Mint yetkisi herkese açık mı: ${risks.anyoneCanMint ? "EVET" : "HAYIR"}
- Pause fonksiyonu: ${risks.hasPause ? "VAR" : "YOK"}
- Upgrade edilebilir kontrat: ${risks.upgradeable ? "EVET" : "HAYIR"}

Genel risk skoru: ${riskScore}/100

Not: Bu bir demo statik analizidir, tam audit yerine geçmez.
`
    };
  } catch (err) {
    console.error(err.message);
    return { error: "Analysis failed: " + err.message };
  }
}

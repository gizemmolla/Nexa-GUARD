import { useState } from "react";

function App() {
  const getRiskLabel = (score) => {
  if (score <= 39) return { label: "High Risk", color: "#ef4444" };
  if (score <= 69) return { label: "Medium Risk", color: "#f97316" };
  return { label: "Low Risk", color: "#22c55e" };
};

  const [activeTab, setActiveTab] = useState("token");

  // Token state
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState(null);
  const [tokenError, setTokenError] = useState("");

  // Wallet state
  const [walletAddress, setWalletAddress] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletResult, setWalletResult] = useState(null);
  const [walletError, setWalletError] = useState("");

  const riskInfo = tokenResult ? getRiskLabel(tokenResult.riskScore) : null;

  

  const analyzeToken = async () => {
    setTokenLoading(true);
    setTokenError("");
    setTokenResult(null);

    try {
      const res = await fetch("http://localhost:4000/api/analyze/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAddress }),
      });
      const data = await res.json();
      if (data.error) setTokenError(data.error);
      else setTokenResult(data);
    } catch (e) {
      console.error(e);
      setTokenError("Backend'e bağlanılamadı.");
    } finally {
      setTokenLoading(false);
    }
  };

  const analyzeWallet = async () => {
    setWalletLoading(true);
    setWalletError("");
    setWalletResult(null);

    try {
      const res = await fetch("http://localhost:4000/api/analyze/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await res.json();
      if (data.error) setWalletError(data.error);
      else setWalletResult(data);
    } catch (e) {
      console.error(e);
      setWalletError("Backend'e bağlanılamadı.");
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px",
        background: "#020617",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "4px" }}>NEXA-GUARD</h1>
      <p style={{ opacity: 0.8, marginBottom: "24px" }}>
        Sui Token & Wallet Risk Scanner — mint ve supply açıklarına odaklı güvenlik aracı.
      </p>

      {/* Tabs */}
      <div
        style={{
          display: "inline-flex",
          borderRadius: "999px",
          border: "1px solid #1e293b",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => setActiveTab("token")}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            background: activeTab === "token" ? "#0f172a" : "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Token Analyzer
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            background: activeTab === "wallet" ? "#0f172a" : "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Wallet Analyzer
        </button>
      </div>

      {/* Token tab */}
      {activeTab === "token" && (
        <div>
          <input
            type="text"
            placeholder="Token Address (0x...)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            style={{
              width: "400px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              marginRight: "10px",
            }}
          />

          <button
            onClick={analyzeToken}
            disabled={!tokenAddress || tokenLoading}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              background: tokenLoading ? "#475569" : "#3b82f6",
              border: "none",
              color: "white",
              fontWeight: "bold",
              cursor: !tokenAddress || tokenLoading ? "not-allowed" : "pointer",
            }}
          >
            {tokenLoading ? "Analyzing..." : "Analyze Token"}
          </button>

          {tokenError && (
            <p style={{ marginTop: "16px", color: "#f87171" }}>{tokenError}</p>
          )}

          {tokenResult && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "#0f172a",
                borderRadius: "12px",
                maxWidth: "520px",
                border: "1px solid #1f2937",
              }}
            >
              <h2 style={{ marginBottom: "8px" }}>
                Risk Score: {tokenResult.riskScore} / 100
              </h2>

                  {riskInfo && (
      <p
        style={{
          marginBottom: "8px",
          fontSize: "14px",
          fontWeight: 600,
          color: riskInfo.color,
        }}
      >
        {riskInfo.label}
      </p>
    )}
              <p>
                <b>Unlimited Mint:</b>{" "}
                {tokenResult.risks?.unlimitedMint ? "YES" : "NO"}
              </p>
              <p>
                <b>Anyone Can Mint:</b>{" "}
                {tokenResult.risks?.anyoneCanMint ? "YES" : "NO"}
              </p>
              <p>
                <b>Pause Function:</b>{" "}
                {tokenResult.risks?.hasPause ? "YES" : "NO"}
              </p>
              <p>
                <b>Upgradeable:</b>{" "}
                {tokenResult.risks?.upgradeable ? "YES" : "NO"}
              </p>

              <hr style={{ margin: "12px 0", borderColor: "#1f2937" }} />

              <p style={{ fontSize: "14px", opacity: 0.9 }}>
                {tokenResult.ai_summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Wallet tab */}
      {activeTab === "wallet" && (
        <div>
          <input
            type="text"
            placeholder="Wallet Address (0x...)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            style={{
              width: "400px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              marginRight: "10px",
            }}
          />

          <button
            onClick={analyzeWallet}
            disabled={!walletAddress || walletLoading}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              background: walletLoading ? "#475569" : "#22c55e",
              border: "none",
              color: "white",
              fontWeight: "bold",
              cursor:
                !walletAddress || walletLoading ? "not-allowed" : "pointer",
            }}
          >
            {walletLoading ? "Analyzing..." : "Analyze Wallet"}
          </button>

          {walletError && (
            <p style={{ marginTop: "16px", color: "#f87171" }}>{walletError}</p>
          )}

        {walletResult && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "#0f172a",
              borderRadius: "12px",
              maxWidth: "600px",
              border: "1px solid #1f2937",
            }}
          >
            <h2 style={{ marginBottom: "8px" }}>
              Wallet: {walletResult.wallet}
            </h2>

            {walletResult.tokens.length === 0 && (
              <p>Hiç analiz edilebilir token bulunamadı.</p>
            )}

            {walletResult.tokens.map((t) => {
              const info = t.riskScore !== undefined && t.riskScore !== null
                ? getRiskLabel(t.riskScore)
                : null;

              return (
                <div
                  key={t.token}
                  style={{
                    padding: "10px",
                    marginTop: "8px",
                    borderRadius: "8px",
                    border: "1px solid #1f2937",
                  }}
                >
                  <p style={{ fontSize: "13px", opacity: 0.8, marginBottom: 4 }}>
                    Token: {t.token}
                  </p>

                  <p style={{ marginBottom: 2 }}>
                    <b>Risk Score:</b> {t.riskScore ?? "-"} / 100
                  </p>

                  {info && (
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: info.color,
                        marginBottom: 4,
                      }}
                    >
                      {info.label}
                    </p>
                  )}

                  <p style={{ fontSize: "12px", opacity: 0.8 }}>
                    Unlimited mint: {t.risks?.unlimitedMint ? "YES" : "NO"} ·{" "}
                    Anyone can mint: {t.risks?.anyoneCanMint ? "YES" : "NO"}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        </div>
      )}
    </div>
  );
}

export default App;

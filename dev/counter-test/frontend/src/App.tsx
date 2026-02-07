import { useEffect, useState } from "react";

type CounterResponse = { value: number };

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function apiPost<T>(path: string): Promise<T> {
  const res = await fetch(path, { method: "POST" });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}

export default function App() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [pulseKey, setPulseKey] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  async function refresh() {
    setError("");
    try {
      const data = await apiGet<CounterResponse>("/api/counter");
      setValue(data.value);
      setIsConnected(true);
      return data.value;
    } catch (e: any) {
      setIsConnected(false);
      throw e;
    }
  }

  async function increment() {
    setLoading(true);
    setError("");
    try {
      const data = await apiPost<CounterResponse>("/api/counter/increment");
      setValue(data.value);
      setPulseKey((prev) => prev + 1);
      setIsConnected(true);
    } catch (e: any) {
      setIsConnected(false);
      const errorMsg = e?.message?.includes("Failed to fetch")
        ? "Erro de conexão: Backend não está respondendo"
        : e?.message?.includes("500")
        ? "Erro no servidor: Tente novamente"
        : e?.message || "Erro desconhecido";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setLoading(true);
    setError("");
    try {
      const data = await apiPost<CounterResponse>("/api/counter/reset");
      setValue(data.value);
      setPulseKey((prev) => prev + 1);
      setIsConnected(true);
    } catch (e: any) {
      setIsConnected(false);
      const errorMsg = e?.message?.includes("Failed to fetch")
        ? "Erro de conexão: Backend não está respondendo"
        : e?.message?.includes("500")
        ? "Erro no servidor: Tente novamente"
        : e?.message || "Erro desconhecido";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh()
      .catch((e) => {
        setError(
          e?.message?.includes("Failed to fetch")
            ? "Erro de conexão: Verifique se o backend está rodando"
            : e?.message ?? "Erro ao carregar"
        );
        setIsConnected(false);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, []);

  if (initialLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3730a3 100%)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              animation: "spin 1s linear infinite",
            }}
          >
            ⏳
          </div>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>Carregando...</div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3730a3 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "24px",
        margin: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Header with Status */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              ✨ Contador
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "500",
                color: isConnected ? "#059669" : "#dc2626",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "#10b981" : "#ef4444",
                  boxShadow: isConnected
                    ? "0 0 8px rgba(16, 185, 129, 0.6)"
                    : "0 0 8px rgba(239, 68, 68, 0.6)",
                  animation: isConnected ? "pulse-status 2s infinite" : "none",
                }}
              />
              {isConnected ? "Conectado" : "Desconectado"}
            </div>
          </div>
        </div>

        {/* Counter Display */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(30, 58, 138, 0.5)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            key={pulseKey}
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: "white",
              textAlign: "center",
              letterSpacing: "-2px",
              animation: "pulse 0.4s ease-out",
            }}
          >
            {value}
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            disabled={loading}
            onClick={increment}
            style={{
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 12px rgba(30, 58, 138, 0.5)",
              transform: loading ? "scale(0.98)" : "scale(1)",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.02) translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 58, 138, 0.6)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 58, 138, 0.5)";
              }
            }}
          >
            {loading ? "⏳ Carregando..." : "➕ Incrementar"}
          </button>

          <button
            disabled={loading}
            onClick={reset}
            style={{
              background: loading ? "#f3f4f6" : "white",
              color: loading ? "#9ca3af" : "#1e3a8a",
              border: "2px solid #1e3a8a",
              borderRadius: "12px",
              padding: "14px 20px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "#1e3a8a";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#1e3a8a";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            🔄 Resetar
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <p
              style={{
                color: "#991b1b",
                margin: 0,
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div
          style={{
            background: "#f9fafb",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "13px",
            color: "#6b7280",
            lineHeight: "1.6",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#374151" }}>Backend:</strong>{" "}
            <code
              style={{
                background: "white",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              http://localhost:3000
            </code>
          </div>
          <div>
            <strong style={{ color: "#374151" }}>Frontend:</strong>{" "}
            <code
              style={{
                background: "white",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              http://localhost:5173
            </code>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse-status {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
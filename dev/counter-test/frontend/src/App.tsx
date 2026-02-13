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
          background: "var(--gradient-primary)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: "var(--color-white)" }}>
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
        background: "var(--gradient-primary)",
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
          boxShadow: "0 20px 60px var(--shadow-card)",
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
                background: "var(--gradient-text)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              🍀 Contador
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "500",
                color: isConnected ? "var(--color-success-dark)" : "var(--color-error-dark)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "var(--color-success)" : "var(--color-error)",
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
            background: "var(--gradient-text)",
            borderRadius: "16px",
            padding: "40px",
            marginBottom: "24px",
            boxShadow: "0 8px 24px var(--shadow-primary)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            key={pulseKey}
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: "var(--color-white)",
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
              background: loading ? "var(--color-gray-400)" : "var(--gradient-text)",
              color: "var(--color-white)",
              border: "none",
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 12px var(--shadow-primary)",
              transform: loading ? "scale(0.98)" : "scale(1)",
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.02) translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px var(--shadow-primary-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px var(--shadow-primary)";
              }
            }}
          >
            {loading ? "⏳ Carregando..." : "➕ Incrementar"}
          </button>

          <button
            disabled={loading}
            onClick={reset}
            style={{
              background: loading ? "var(--color-gray-100)" : "var(--color-white)",
              color: loading ? "var(--color-gray-400)" : "var(--color-primary-dark)",
              border: "2px solid var(--color-primary-dark)",
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
                e.currentTarget.style.background = "var(--color-primary-dark)";
                e.currentTarget.style.color = "var(--color-white)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "var(--color-white)";
                e.currentTarget.style.color = "var(--color-primary-dark)";
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
              background: "var(--color-bg-error)",
              border: "1px solid var(--color-bg-error-border)",
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
            background: "var(--color-gray-50)",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "13px",
            color: "var(--color-gray-500)",
            lineHeight: "1.6",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "var(--color-gray-700)" }}>Backend:</strong>{" "}
            <code
              style={{
                background: "var(--color-white)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                border: "1px solid var(--color-gray-200)",
              }}
            >
              http://localhost:3000
            </code>
          </div>
          <div>
            <strong style={{ color: "var(--color-gray-700)" }}>Frontend:</strong>{" "}
            <code
              style={{
                background: "var(--color-white)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                border: "1px solid var(--color-gray-200)",
              }}
            >
              http://localhost:5173
            </code>
          </div>
        </div>

        <style>{`
          :root {
            /* Primary Colors */
            --color-primary-dark: #14532d;
            --color-primary-main: #166534;
            --color-primary-light: #15803d;
            
            /* Status Colors */
            --color-success: #10b981;
            --color-success-dark: #059669;
            --color-error: #ef4444;
            --color-error-dark: #dc2626;
            --color-warning: #fbbf24;
            --color-warning-dark: #f59e0b;
            
            /* Neutral Colors */
            --color-white: #ffffff;
            --color-gray-50: #f9fafb;
            --color-gray-100: #f3f4f6;
            --color-gray-200: #e5e7eb;
            --color-gray-400: #9ca3af;
            --color-gray-500: #6b7280;
            --color-gray-700: #374151;
            
            /* Background Colors */
            --color-bg-error: #fee2e2;
            --color-bg-error-border: #fecaca;
            
            /* Shadows */
            --shadow-primary: rgba(30, 58, 138, 0.5);
            --shadow-primary-hover: rgba(30, 58, 138, 0.6);
            --shadow-card: rgba(0, 0, 0, 0.3);
            
            /* Gradients */
            --gradient-primary: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-main) 50%, var(--color-primary-light) 100%);
            --gradient-text: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary-light) 100%);
          }

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

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
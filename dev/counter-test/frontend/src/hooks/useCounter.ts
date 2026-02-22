import { useEffect, useState } from "react";
import {
  getCounter,
  incrementCounter,
  resetCounter,
} from "../api/counter";

function normalizeError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("Failed to fetch"))
    return "Erro de conexão: Backend não está respondendo";
  if (msg.includes("500")) return "Erro no servidor: Tente novamente";
  return msg || "Erro desconhecido";
}

function normalizeLoadError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("Failed to fetch"))
    return "Erro de conexão: Verifique se o backend está rodando";
  return msg ?? "Erro ao carregar";
}

export function useCounter() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [pulseKey, setPulseKey] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  async function refresh() {
    setError("");
    try {
      const data = await getCounter();
      setValue(data.value);
      setIsConnected(true);
      return data.value;
    } catch (e) {
      setIsConnected(false);
      throw e;
    }
  }

  async function increment() {
    setLoading(true);
    setError("");
    try {
      const data = await incrementCounter();
      setValue(data.value);
      setPulseKey((prev) => prev + 1);
      setIsConnected(true);
    } catch (e) {
      setIsConnected(false);
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    setLoading(true);
    setError("");
    try {
      const data = await resetCounter();
      setValue(data.value);
      setPulseKey((prev) => prev + 1);
      setIsConnected(true);
    } catch (e) {
      setIsConnected(false);
      setError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh()
      .catch((e) => {
        setError(normalizeLoadError(e));
        setIsConnected(false);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, []);

  return {
    value,
    loading,
    initialLoading,
    error,
    pulseKey,
    isConnected,
    increment,
    reset,
  };
}

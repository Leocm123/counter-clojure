export type CounterResponse = { value: number };

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string): Promise<T> {
  const res = await fetch(path, { method: "POST" });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}

export async function getCounter(): Promise<CounterResponse> {
  return apiGet<CounterResponse>("/api/counter");
}

export async function incrementCounter(): Promise<CounterResponse> {
  return apiPost<CounterResponse>("/api/counter/increment");
}

export async function resetCounter(): Promise<CounterResponse> {
  return apiPost<CounterResponse>("/api/counter/reset");
}

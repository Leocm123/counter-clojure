# 🧮 Counter Application

Demo full-stack: **Clojure (Pedestal)** no backend e **React + TypeScript (Vite)** no frontend.

Uma única tela com um contador: obter valor, incrementar e resetar. O estado fica em memória no backend (um **atom**).

---

## 🚀 Como rodar

Escolha uma opção.

### Com Docker (recomendado)

**Requisito:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

```bash
git clone <url-do-repositorio>
cd counter-clojure
docker compose up --build
```

Acesse **http://localhost:8080**. Para parar: `Ctrl+C` e depois `docker compose down`.

### Sem Docker

**Requisitos:** Java 11+, [Clojure CLI](https://clojure.org/guides/install_clojure) (`clj`), Node.js 16+.

**Terminal 1 — backend:**
```bash
cd dev/counter-test/backend
clj -M:run
```
Backend em http://localhost:3000

**Terminal 2 — frontend:**
```bash
cd dev/counter-test/frontend
npm install
npm run dev
```
Frontend em http://localhost:5173

---

## 🛠 Stack

| Camada   | Tecnologias |
|----------|-------------|
| Backend  | Clojure, Pedestal, Jetty, Cheshire (JSON) |
| Frontend | React, TypeScript, Vite, CSS (variáveis + um CSS por componente) |
| Deploy   | Docker Compose (backend + frontend com nginx) |

O frontend usa **TypeScript** e **CSS puro**. A API é REST; CORS está configurado para desenvolvimento local e para o proxy no Docker.

---

## 🌐 API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET    | `/api/counter` | Valor atual do contador |
| POST   | `/api/counter/increment` | Incrementa em 1 |
| POST   | `/api/counter/reset` | Zera o contador |

Resposta em JSON: `{ "value": number }`.

---

## 📁 Estrutura

```
counter-clojure/
├── docker-compose.yml          # Sobe backend + frontend
├── dev/counter-test/
│   ├── backend/
│   │   ├── deps.edn
│   │   ├── Dockerfile
│   │   └── src/counter/backend/server.clj
│   └── frontend/
│       ├── package.json
│       ├── Dockerfile
│       ├── vite.config.ts
│       ├── src/
│       │   ├── App.tsx, main.tsx
│       │   ├── api/, hooks/, components/
│       │   └── styles/variables.css
│       └── docs/               # Guias React/TypeScript/CSS
```

---

## 🧠 Detalhes técnicos

- **Estado:** `(defonce counter* (atom 0))` no backend; atualização com `swap!`. Estado é perdido ao reiniciar o servidor.
- **CORS:** interceptor no Pedestal que lê `Origin` e devolve os headers adequados.
- **Docker:** backend escuta em `0.0.0.0:3000`; frontend (nginx) faz proxy de `/api` para o backend.

---

## 🎨 Tema

Cores e gradientes estão em **`dev/counter-test/frontend/src/styles/variables.css`** (`:root`). Alterando as três cores primárias, o restante do tema acompanha:

```css
--color-primary-dark: #14532d;
--color-primary-main: #166534;
--color-primary-light: #15803d;
```

Exemplos rápidos: 
verde (`#065f46`, `#059669`, `#10b981`), 
azul (`#1e3a8a`, `#1e40af`, `#3730a3`), 
roxo (`#6b21a8`, `#7c3aed`, `#8b5cf6`).

---

## 👨‍💻 Autor

**Leonardo Moreno** — Counter Application (demo)

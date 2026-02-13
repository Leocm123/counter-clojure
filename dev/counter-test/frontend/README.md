# 🧮 Counter Application – Clojure + Pedestal + React

Aplicação full-stack simples desenvolvida como teste técnico.

O backend foi implementado em Clojure utilizando Pedestal, e o frontend em React com TypeScript (Vite).

A aplicação expõe uma API HTTP com três operações:
* 🔢 Obter valor atual do contador
* ➕ Incrementar contador
* 🔄 Resetar contador

O estado do contador é mantido em memória utilizando um **atom**.

---

## 📌 Visão Geral da Arquitetura

### Backend
* **Linguagem:** Clojure
* **Framework HTTP:** Pedestal
* **Servidor:** Jetty
* **Estado:** atom em memória
* **Serialização JSON:** Cheshire

O backend expõe endpoints REST e utiliza um interceptor de CORS para permitir comunicação com o frontend rodando em outra origem.

### Frontend
* React 18
* TypeScript
* Vite
* Fetch API para comunicação com o backend
* Tratamento de loading e erro

O frontend consome a API via chamadas HTTP e atualiza a interface com base no estado retornado.

---

## 🚀 Como Rodar o Projeto

### 🔹 Pré-requisitos
* Java 11+
* Clojure CLI instalado (`clj`)
* Node.js 16+

### 🔹 Backend

Na raiz do projeto:

```bash
clj -M:run
```

O servidor iniciará em:
```
http://localhost:3000
```

### 🔹 Frontend

Entre na pasta do frontend:

```bash
cd frontend
npm install
npm run dev
```

O frontend iniciará em:
```
http://localhost:5173
```

---

## 🌐 API Endpoints

### `GET /api/counter`
Retorna o valor atual do contador.

**Response:**
```json
{
  "value": 5
}
```

### `POST /api/counter/increment`
Incrementa o contador em 1.

**Response:**
```json
{
  "value": 6
}
```

### `POST /api/counter/reset`
Reseta o contador para 0.

**Response:**
```json
{
  "value": 0
}
```

---

## 🧠 Como Funciona Internamente

### 🔹 Estado com Atom

O contador é armazenado como:

```clojure
(defonce counter* (atom 0))
```

Atualização é feita com:

```clojure
(swap! counter* inc)
```

O uso de **`atom`** garante atualização atômica e segura para concorrência em um único processo.

⚠️ **O estado é perdido ao reiniciar o servidor**, pois está apenas em memória.

### 🔹 Fluxo de Requisição

1. O frontend chama a API via `fetch`.
2. O navegador pode enviar um preflight (OPTIONS) se necessário.
3. O Pedestal recebe a requisição.
4. O interceptor de CORS adiciona os headers necessários.
5. O handler executa a lógica.
6. O backend retorna JSON.
7. O React atualiza o estado e re-renderiza a interface.

### 🔐 CORS

Foi implementado um interceptor para permitir comunicação entre:

```
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

O interceptor:
* Lê o header `Origin`
* Armazena no contexto
* Adiciona headers CORS na resposta
* Trata requisições `OPTIONS` (preflight)

---

## 📁 Estrutura do Projeto

```
counter-clojure/
│
├── deps.edn
├── src/
│   └── counter/
│       └── backend/
│           └── server.clj
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
```

---

## ⚖️ Decisão Técnica: Atom vs Datomic

Para este teste foi utilizada a solução simples com **`atom`** devido a:
* Menor complexidade
* Escopo reduzido da aplicação
* Entrega focada na arquitetura e entendimento do fluxo

Uma evolução possível seria utilizar **Datomic em memória** para persistência e histórico.

---

## 🎨 Customização de Tema

A aplicação utiliza **CSS Variables** (design tokens) para facilitar a personalização de cores. Todas as cores estão centralizadas no `:root` do componente `App.tsx`.

### Como Mudar o Tema

No arquivo `App.tsx`, localize a seção `<style>` e modifique as variáveis CSS:

```css
:root {
  /* Primary Colors - Mude estas para alterar o tema principal */
  --color-primary-dark: #14532d;
  --color-primary-main: #166534;
  --color-primary-light: #15803d;

  
  /* ... outras variáveis */
}
```

### Exemplos de Temas Alternativos

#### 🌿 Tema Verde Esmeralda
```css
--color-primary-dark: #065f46;
--color-primary-main: #059669;
--color-primary-light: #10b981;
```

#### 🔵 Tema Azul
```css
  --color-primary-dark: #1e3a8a;
  --color-primary-main: #1e40af;
  --color-primary-light: #3730a3;
```
#### 🟣 Tema Roxo
```css
--color-primary-dark: #6b21a8;
--color-primary-main: #7c3aed;
--color-primary-light: #8b5cf6;
```

#### 🔴 Tema Vermelho
```css
--color-primary-dark: #991b1b;
--color-primary-main: #dc2626;
--color-primary-light: #ef4444;
```

**Dica:** Os gradientes são calculados automaticamente. Você só precisa mudar as 3 cores primárias! 🎨

---

## 🔍 Possíveis Melhorias

* [ ] Persistência real (Datomic ou outro banco)
* [ ] Testes automatizados (backend e frontend)
* [ ] Separação de camadas no backend (handlers, services, state)
* [ ] Deploy containerizado (Docker)
* [ ] Logs estruturados
* [ ] Rate limiting
* [ ] Autenticação (JWT)

---

## 👨‍💻 Autor

**Leonardo Moreno**  
Teste técnico – Counter Application
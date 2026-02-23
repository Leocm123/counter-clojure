# Guia: React, TypeScript e CSS

---

# Parte 1 — React

## 1. O que é React (em uma frase)

React é uma biblioteca para construir interfaces: você descreve a **UI em função do estado**; quando o estado muda, o React **atualiza o que aparece na tela**.

---

## 2. JSX

### O que é

Sintaxe que mistura **JavaScript** com **marcação parecida com HTML**. Cada “tag” vira uma chamada a `React.createElement` (ou função do React 17+).

```tsx
<div className="app">
  <CounterCard value={value} onIncrement={increment} />
</div>
```

- **`className`** em vez de `class`: `class` é palavra reservada em JS; no DOM a propriedade é `className`.
- **`{value}`** — chaves = “aqui entra JavaScript”. Qualquer expressão JS pode ir dentro de `{}`.
- **Componentes com maiúscula:** `<CounterCard />` é componente; `<div>` é elemento nativo.

### Regra: um único elemento no return

O return de um componente deve devolver **um único elemento** (que pode ter filhos):

```tsx
return (
  <div className="app">
    <CounterCard ... />
  </div>
);
```

Para não poluir com `<div>` extra, pode usar **Fragment**: `<></>` ou `<React.Fragment>`.

---

## 3. Componentes

### Função que retorna JSX

Um componente é uma **função** que retorna JSX (e pode receber **props**).

```tsx
export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">🍀 Contador</h1>
      {isConnected ? "Conectado" : "Desconectado"}
    </header>
  );
}
```

- **Export:** `export function Header` — outros arquivos podem fazer `import { Header } from "..."`.
- **Props:** o “argumento” do componente; vem do pai. Sempre **somente leitura** (não altere props dentro do componente).

### Default export (um por arquivo)

```tsx
export default function App() { ... }
```

Quem importa pode usar qualquer nome: `import App from "./App"` ou `import MeuApp from "./App"`.

### Nome do componente = nome da função

Por convenção, o nome da função é **PascalCase** e é o “nome” do componente no JSX: `<Header />`, `<CounterCard />`.

---

## 4. Props (propriedades)

### O que são

Dados passados **do pai para o filho**. O filho não altera as props; o pai é dono dos dados.

```tsx
<CounterCard
  value={value}
  loading={loading}
  onIncrement={increment}
  onReset={reset}
/>
```

- **value, loading** — dados (números, boolean, string).
- **onIncrement, onReset** — funções (callbacks). O filho chama quando o usuário clica; a lógica fica no pai (ou no hook).

### Tipagem com TypeScript

```tsx
type CounterCardProps = {
  value: number;
  loading: boolean;
  error: string;
  onIncrement: () => void;   // função sem argumento, retorna void
  onReset: () => void;
};

export function CounterCard({ value, loading, error, onIncrement, onReset }: CounterCardProps) {
  ...
}
```

- **`() => void`** — tipo “função que não recebe nada e não retorna nada útil”.
- Desestruturar nas chaves: `{ value, loading }` evita ficar escrevendo `props.value`.

---

## 5. Estado: useState

### O que é

**Estado** é dado que, quando muda, faz o React **renderizar de novo** o componente. `useState` devolve o valor atual e uma função para atualizar.

```tsx
const [value, setValue] = useState(0);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

- **`[valor, setValor]`** — array com dois itens: estado atual e “setter”.
- **`useState(0)`** — valor inicial (aqui, número 0).
- **Regra:** não altere o estado direto (`value = 1`). Use sempre o setter: `setValue(1)`.

### Atualização baseada no valor anterior

Quando o novo valor depende do anterior, use **função** no setter para evitar race conditions:

```tsx
setPulseKey((prev) => prev + 1);
```

`prev` é o valor mais recente no momento em que o React aplicar a atualização.

### Onde fica o estado

O estado fica no componente (ou no hook) que **usa** e **atualiza** esse dado. Quem precisa ver o valor recebe por **props**. No seu app: estado no hook `useCounter`, e o `App` repassa para `CounterCard` por props.

---

## 6. Efeitos: useEffect

### O que é

`useEffect` serve para **sincronizar** o componente com o “mundo de fora”: API, timer, subscription, etc. O React chama a função depois de pintar na tela.

```tsx
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
```

- **Função** — o “efeito”: o que rodar (aqui, carregar o contador na subida).
- **Array de dependências `[]`** — quando rodar. `[]` = “só na montagem do componente” (uma vez). Se fosse `[id]`, rodaria de novo quando `id` mudasse.

### Boas práticas

- Não coloque tudo no `[]` sem necessidade; só o que o efeito realmente depende.
- Se o efeito chama uma API, normalmente você trata loading/erro com estado (como você fez).

---

## 7. Custom hooks (useCounter)

### O que é

Um **hook** é uma função cujo nome começa com `use` e que pode chamar outros hooks (`useState`, `useEffect`). **Custom hook** = sua função que encapsula estado e lógica para reutilizar.

```tsx
export function useCounter() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  // ...
  useEffect(() => { ... }, []);
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
```

- O componente que chama `useCounter()` recebe o objeto retornado e usa no JSX (e repassa props para os filhos).
- Ajuda a manter o `App` simples e a lógica da API/estado em um lugar só.

### Regras dos hooks

- Só chame hooks **no topo** de componentes ou de outros hooks (não dentro de `if`, loops ou callbacks).
- Só chame hooks de **funções de componente** ou de **funções que são hooks** (nome começando com `use`).

---

## 8. Renderização condicional

### if antes do return

```tsx
if (initialLoading) {
  return <LoadingScreen />;
}
return (
  <div className="app">
    <CounterCard ... />
  </div>
);
```

Mostra uma coisa ou outra conforme o estado.

### Operador && no JSX

```tsx
{error && <ErrorMessage message={error} />}
```

- Se `error` for string vazia (falsy), não renderiza nada.
- Se `error` tiver texto, renderiza `<ErrorMessage />`. Não use `error && ...` quando `error` puder ser `0` (0 é falsy e seria renderizado).

### Ternário

```tsx
{isConnected ? "Conectado" : "Desconectado"}
className={`header__status--${isConnected ? "connected" : "disconnected"}`}
```

---

## 9. Eventos e callbacks

### onClick

```tsx
<button onClick={onIncrement}>Incrementar</button>
```

- **Não** chame a função na hora: `onClick={onIncrement()}` — isso executaria ao renderizar. Correto é passar a **referência**: `onClick={onIncrement}`.
- Se precisar de argumento: `onClick={() => onIncrement(id)}`.

### disabled

```tsx
<button disabled={loading} onClick={onIncrement}>
  {loading ? "Carregando..." : "Incrementar"}
</button>
```

Evita cliques duplos enquanto a requisição está em andamento.

---

## 10. key (lista e re-render forçado)

Quando o React renderiza uma **lista**, cada item deve ter uma **key** única (geralmente um id). No seu código você usa `pulseKey` para **forçar** o React a tratar o número como “novo” e rodar a animação de novo:

```tsx
<div key={pulseKey} className="counter-display__value">
  {value}
</div>
```

Ao incrementar/resetar, você faz `setPulseKey((prev) => prev + 1)`. A key muda → o React “destrói” e “recria” aquele nó → a animação CSS roda de novo.

---

## 11. Ponto de entrada: main.tsx

```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- **createRoot** — API moderna do React 18+: cria a raiz na div `#root`.
- **`!`** em TypeScript — “non-null assertion”: você garante que `getElementById("root")` não é null.
- **StrictMode** — em desenvolvimento, o React roda duas vezes parte da lógica e avisa sobre efeitos e APIs deprecadas; não aparece na UI.

---

## 12. Resumo React (uma frase)

| Conceito | Em uma frase |
|----------|----------------|
| JSX | HTML-like no JS; `{}` para expressões; `className` em vez de `class`. |
| Componente | Função que retorna JSX e pode receber props. |
| Props | Dados (e callbacks) passados do pai para o filho; somente leitura. |
| useState | Estado local: valor + setter; atualizar só com o setter. |
| useEffect | Rodar efeito (ex.: chamar API) na montagem ou quando dependências mudam. |
| Custom hook | Função `useX` que usa outros hooks e encapsula lógica. |
| Condicional | `if` antes do return, ou `{cond && <X />}`, ou `cond ? a : b`. |
| key | Identificador único em listas (ou para forçar re-mount e animação). |
| StrictMode | Ferramenta de dev para avisos; não altera a UI. |

---

# Parte 2 — CSS no meu projeto

O projeto usa **TypeScript** e **CSS puro** (variáveis e um CSS por componente).

## 1. Estrutura

- **index.css** — reset/global; importa `variables.css`.
- **styles/variables.css** — variáveis (`:root`) e `@keyframes` globais.
- **App.css** — só o layout da página (fundo, centralização).
- **Cada componente** — `ComponentName.css` importado no `.tsx`: só estilos daquele componente.

## 2. Variáveis CSS (:root)

```css
:root {
  --color-primary-dark: #14532d;
  --color-success: #10b981;
  --gradient-primary: linear-gradient(135deg, var(--color-primary-dark) 0%, ...);
}
```

- **`--nome`** — variável CSS (custom property).
- **`var(--nome)`** — usa o valor da variável; pode ter segundo argumento: `var(--x, 10px)` (fallback).
- **`:root`** — raiz do documento; as variáveis ficam disponíveis em todo o CSS.

Assim você muda tema/cores em um lugar só.

## 3. Convenção de classes (BEM-like)

- **Bloco:** `header`, `counter-card`, `counter-buttons`.
- **Elemento:** `header__title`, `header__status` (bloco + `__` + elemento).
- **Modificador:** `header__status--connected`, `header__status--disconnected` (elemento + `--` + estado).

No JSX você monta a classe com template string quando depende de estado:

```tsx
className={`header__status header__status--${isConnected ? "connected" : "disconnected"}`}
```

## 4. @keyframes e animation

```css
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.counter-display__value {
  animation: pulse 0.4s ease-out;
}
```

- **@keyframes nome** — define os passos da animação (por % ou from/to).
- **animation:** nome duração timing-function (e opcionalmente delay, iteration-count).

---

## Resumo final

- **React:** componentes, props, estado (useState), efeitos (useEffect), custom hooks, condicionais, eventos, key.
- **TypeScript:** tipagem de props e estado; tipos como `CounterCardProps`, `() => void`.
- **CSS no projeto:** variáveis em `:root`, BEM-like, um CSS por componente, @keyframes.

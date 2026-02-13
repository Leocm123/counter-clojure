# 🧮 Counter Application - Teste Técnico

Aplicação web de contador desenvolvida com **Clojure/Pedestal** no backend e **TypeScript/React** no frontend.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Instalação e Execução](#instalação-e-execução)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Decisões Técnicas](#decisões-técnicas)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## 🎯 Visão Geral

Aplicação full-stack que implementa um contador com operações de incremento e reset. O projeto demonstra integração entre backend funcional (Clojure) e frontend moderno (React/TypeScript).

### Funcionalidades Principais

✅ **Incrementar** - Adiciona 1 ao contador  
✅ **Resetar** - Volta o contador para 0  
✅ **Visualizar** - Exibe o valor atual do contador  
✅ **Status de Conexão** - Indicador visual em tempo real

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Clojure** - Linguagem funcional para JVM
- **Pedestal** - Framework web para APIs REST
- **Atom** - Gerenciamento de estado em memória (opção simples)
- **Datomic** - Banco de dados imutável (opção avançada)

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida
- **CSS-in-JS** - Estilização inline com tipagem

---

## 🏗️ Arquitetura

### Backend (Clojure + Pedestal)

```
┌─────────────────────────────────────┐
│         Pedestal Router             │
│  (Roteamento e Middleware HTTP)     │
└──────────────┬──────────────────────┘
               │
       ┌───────▼───────┐
       │   Handlers    │
       │ (Funções puras)│
       └───────┬───────┘
               │
    ┌──────────▼───────────┐
    │   State Management   │
    │  (Atom ou Datomic)   │
    └──────────────────────┘
```

**Camadas:**
1. **Rotas** - Definem endpoints da API
2. **Handlers** - Processam requisições de forma funcional
3. **Estado** - Atom (simples) ou Datomic (persistente)

### Frontend (React + TypeScript)

```
┌─────────────────────────────────────┐
│          App Component              │
│     (Estado principal + UI)         │
└──────────────┬──────────────────────┘
               │
    ┌──────────▼───────────┐
    │   API Service Layer  │
    │  (fetch abstraído)   │
    └──────────┬───────────┘
               │
       ┌───────▼───────┐
       │  Backend API  │
       │ (Pedestal)    │
       └───────────────┘
```

**Componentes:**
- **App.tsx** - Componente principal com toda lógica
- **API Layer** - Funções `apiGet` e `apiPost` para comunicação
- **State Management** - React Hooks (`useState`, `useEffect`)

---

## 🚀 Instalação e Execução

### Pré-requisitos

- **Backend**: JDK 11+ e Leiningen
- **Frontend**: Node.js 16+ e npm/yarn

### Backend (Clojure)

```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências
lein deps

# Executar servidor (porta 3000)
lein run

# Ou com auto-reload durante desenvolvimento
lein repl
```

O servidor estará disponível em `http://localhost:3000`

### Frontend (React)

```bash
# Navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar servidor de desenvolvimento (porta 5173)
npm run dev

# Build para produção
npm run build
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📡 API Endpoints

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

## ✨ Features

### 1. **Indicador de Status de Conexão**
- 🟢 Verde pulsante quando conectado
- 🔴 Vermelho quando desconectado
- Detecta automaticamente falhas de comunicação

### 2. **Loading States**
- Tela de carregamento inicial elegante
- Desabilitação de botões durante requisições
- Feedback visual imediato

### 3. **Tratamento de Erros Robusto**
- Mensagens específicas por tipo de erro
- Diferenciação entre erro de rede e servidor
- UI não quebra em caso de falha

### 4. **Design Responsivo**
- Funciona em desktop, tablet e mobile
- Gradiente azul escuro profissional
- Animações suaves e polidas

---

## 🤔 Decisões Técnicas

### Persistência: Atom vs Datomic

#### **Opção Simples: Atom** ✅ (Implementada)

**Vantagens:**
- ✅ Setup instantâneo, zero configuração
- ✅ Perfeito para demonstração e prototipagem
- ✅ Código mais enxuto e legível
- ✅ Performance excelente para cenário single-instance

**Desvantagens:**
- ❌ Dados perdidos ao reiniciar servidor
- ❌ Não escala horizontalmente
- ❌ Sem histórico ou auditoria

**Implementação:**
```clojure
(def counter-state (atom 0))

(defn increment-counter []
  (swap! counter-state inc))
```

#### **Opção Avançada: Datomic**

**Vantagens:**
- ✅ Persistência durável
- ✅ Histórico completo (time travel)
- ✅ Queries poderosas com Datalog
- ✅ Imutabilidade garantida

**Desvantagens:**
- ❌ Setup mais complexo
- ❌ Overhead para caso de uso simples
- ❌ Curva de aprendizado

**Quando usar Datomic:**
- Necessidade de auditoria
- Múltiplas instâncias da aplicação
- Queries complexas sobre histórico
- Ambiente de produção

### Por que TypeScript?

- **Type Safety** - Previne bugs em tempo de desenvolvimento
- **Autocompletion** - Melhor DX com IntelliSense
- **Refactoring** - Mudanças seguras em código grande
- **Documentação** - Tipos servem como documentação viva

### Por que Vite?

- **Performance** - HMR instantâneo, build rápido
- **Moderno** - ESM nativo, sem bundling desnecessário
- **Simples** - Zero config para começar

---

## 📁 Estrutura do Projeto

```
counter-app/
├── backend/
│   ├── src/
│   │   └── counter/
│   │       ├── core.clj          # Entry point
│   │       ├── routes.clj        # Definição de rotas
│   │       ├── handlers.clj      # Lógica de negócio
│   │       └── state.clj         # Gerenciamento de estado
│   ├── project.clj               # Dependências Leiningen
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Componente principal
│   │   ├── main.tsx              # Entry point React
│   │   └── vite-env.d.ts         # TypeScript declarations
│   ├── package.json              # Dependências npm
│   ├── tsconfig.json             # Configuração TypeScript
│   ├── vite.config.ts            # Configuração Vite
│   └── index.html
│
└── README.md                     # Este arquivo
```

---

## 🧪 Testes (Recomendado para Produção)

### Backend (Clojure)
```clojure
;; Exemplo com clojure.test
(deftest test-increment
  (is (= 1 (increment-counter 0))))

(deftest test-reset
  (is (= 0 (reset-counter 42))))
```

### Frontend (React Testing Library)
```typescript
test('increments counter on button click', async () => {
  render(<App />);
  const button = screen.getByText(/incrementar/i);
  fireEvent.click(button);
  await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());
});
```

---

## 🎨 Customização de Tema

A aplicação utiliza **CSS Variables** (design tokens) para facilitar a personalização de cores. Todas as cores estão centralizadas no `:root` do componente.

### Como Mudar o Tema

No arquivo `App.tsx`, localize a seção `<style>` e modifique as variáveis CSS:

```css
:root {
  /* Primary Colors - Mude estas para alterar o tema principal */
  --color-primary-dark: #1e3a8a;    /* Azul escuro */
  --color-primary-main: #1e40af;     /* Azul médio */
  --color-primary-light: #3730a3;    /* Azul roxeado */
  
  /* ... outras variáveis */
}
```

### Exemplos de Temas Alternativos

#### 🟢 Tema Verde (Sustentabilidade)
```css
--color-primary-dark: #065f46;
--color-primary-main: #047857;
--color-primary-light: #059669;
```

#### 🟣 Tema Roxo (Criatividade)
```css
--color-primary-dark: #6b21a8;
--color-primary-main: #7c3aed;
--color-primary-light: #8b5cf6;
```

#### 🔴 Tema Vermelho (Energia)
```css
--color-primary-dark: #991b1b;
--color-primary-main: #dc2626;
--color-primary-light: #ef4444;
```

#### ⚫ Tema Dark Mode (Profissional)
```css
--color-primary-dark: #1f2937;
--color-primary-main: #374151;
--color-primary-light: #4b5563;
```

### Variáveis Disponíveis

| Variável | Uso | Valor Padrão |
|----------|-----|--------------|
| `--color-primary-dark` | Cor principal escura | `#1e3a8a` |
| `--color-primary-main` | Cor principal | `#1e40af` |
| `--color-primary-light` | Cor principal clara | `#3730a3` |
| `--color-success` | Status conectado | `#10b981` |
| `--color-error` | Status erro | `#ef4444` |
| `--gradient-primary` | Gradiente de fundo | Auto-calculado |
| `--gradient-text` | Gradiente do texto/contador | Auto-calculado |
| `--shadow-primary` | Sombra dos botões | Auto-calculado |

### Dica Profissional

Os gradientes são calculados automaticamente baseados nas cores primárias:
- **`--gradient-primary`**: Usado no fundo da página
- **`--gradient-text`**: Usado no título e contador

Você só precisa mudar as 3 cores primárias, e o resto se ajusta automaticamente! 🎨

---

## 🔍 Observações para o Demo

### Pontos a Destacar

1. **Separação de Responsabilidades**
   - Backend 100% funcional (sem side effects)
   - Frontend com hooks modernos

2. **UX/UI Polida**
   - Feedback visual imediato
   - Estados de loading/erro bem tratados
   - Design profissional e responsivo

3. **Code Quality**
   - TypeScript para type safety
   - Funções pequenas e focadas
   - Nomes descritivos

4. **Extensibilidade**
   - Fácil adicionar novos endpoints
   - Estado centralizado e previsível
   - Componentes reutilizáveis

### Melhorias Futuras

- [ ] Adicionar testes automatizados
- [ ] Implementar rate limiting no backend
- [ ] Adicionar autenticação (JWT)
- [ ] Deploy em Docker containers
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com logs estruturados
- [ ] WebSockets para updates em tempo real

---

## 📝 Notas de Desenvolvimento

### Configuração do Proxy (Vite)

Para evitar problemas de CORS durante desenvolvimento, configure o proxy no `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

### CORS no Backend

Se não usar proxy, configure CORS no Pedestal:

```clojure
(def routes
  #{["/api/counter" :get counter-handler 
     :route-name :get-counter
     :constraints {:allowed-origins "*"}]})
```

---

## 👤 Autor

**Leonardo**  
Teste técnico desenvolvido para demonstração de habilidades full-stack com Clojure e React.

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um processo seletivo e é apenas para fins de avaliação técnica.
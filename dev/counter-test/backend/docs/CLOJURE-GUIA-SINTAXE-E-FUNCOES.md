# Guia: Sintaxe e funções Clojure usadas no server.clj

Referência das **funções**, **caracteres especiais** e **formas** que aparecem no seu backend, para você estudar e explicar na entrevista.

---

## 1. Caracteres e símbolos especiais

### `:` — Keyword

- **O que é:** um identificador que funciona como “label” ou “chave constante”.
- **Uso:** chaves de mapas, opções, enums.

```clojure
:status        ; keyword "status"
:get           ; keyword "get"
:request       ; keyword "request"
{:status 200}  ; mapa com chave :status e valor 200
```

Keywords são iguais a si mesmas (`:a = :a`) e são baratas para usar como chave em mapas.

---

### `::` — Keyword no namespace atual

- **O que é:** keyword **qualificado pelo namespace atual**.
- **Uso:** evitar colisão de nomes entre namespaces.

No namespace `counter.backend.server`:

```clojure
::cors           ; vira :counter.backend.server/cors
::origin         ; vira :counter.backend.server/origin
::get-counter    ; vira :counter.backend.server/get-counter
::http/routes    ; isso NÃO é ::  — veja abaixo
```

Assim você usa “nomes globais” que não batem com outros namespaces.

---

### `::namespace/nome` — Keyword em outro namespace

- **O que é:** keyword que **pertence a um namespace específico** (geralmente de lib).
- **Uso:** configs e APIs de bibliotecas.

```clojure
::http/routes   ; :io.pedestal.http/routes (do Pedestal)
::http/port     ; :io.pedestal.http/port
::http/join?    ; :io.pedestal.http/join?
```

O Pedestal usa essas chaves no mapa `service` para configurar rotas, porta, etc.

---

### `` ` `` (crase) — Syntax quote

- **O que é:** “quote com inteligência”: resolve símbolos no namespace atual e evita colisão.
- **Uso:** em macros e, no seu código, nas **rotas** para passar o nome da função.

```clojure
`get-counter
; => counter.backend.server/get-counter (símbolo qualificado)
```

No Pedestal, as rotas recebem **símbolos** que serão resolvidos para as funções (handlers) no namespace. A crase faz esse símbolo ser qualificado pelo namespace atual.

Sem crase: `get-counter` (pode ser interpretado como “valor da var”). Com crase: você passa o **nome** da função de forma explícita.

---

### `@` — Deref (dereference)

- **O que é:** lê o **valor atual** de uma referência (atom, ref, agent, etc.).
- **Uso:** “desembrulhar” o valor que está dentro do atom.

```clojure
(defonce counter* (atom 0))
@counter*   ; => 0   (igual a (deref counter*))
```

Em `get-counter`: `(json-response {:value @counter*})` — você lê o número atual do contador e coloca no JSON.

---

### `*` no nome (ex.: `counter*`)

- **O que é:** **convenção de nome**, não é operador.
- **Uso:** indicar “recurso global / estado / binding dinâmico”.

```clojure
(defonce counter* (atom 0))
```

Em Clojure é comum ver `*out*`, `*in*`, `*db*`. O `*` só ajuda a ler: “isso aqui é global/estado”.

---

### `_` (underscore)

- **O que é:** **convenção** para “parâmetro não usado”.
- **Uso:** deixar claro que o argumento existe mas não é usado.

```clojure
(defn get-counter [_]
  (json-response {:value @counter*}))
```

O Pedestal passa o request como primeiro argumento; como você não usa, `_` documenta isso. Poderia ser `_request` ou qualquer nome.

---

### `&` em parâmetros — Rest args

- **O que é:** “o resto dos argumentos em uma sequência”.
- **Uso:** funções variáveis.

```clojure
(defn -main [& _]
  ...)
```

`-main` pode ser chamada com 0 ou mais argumentos (ex.: `java -jar app.jar arg1 arg2`). `[& _]` significa “captura os argumentos mas não os usa”. Se usasse `[& args]`, `args` seria uma lista com todos eles.

---

### `#{}` — Set (conjunto)

- **O que é:** coleção **sem ordem**, **sem repetição**.
- **Uso:** lista de rotas onde a ordem não importa e cada rota é única.

```clojure
#{["/api/counter" :get ...]
  ["/api/counter/increment" :post ...]}
```

`expand-routes` recebe um set de vetores; a ordem das rotas não é relevante.

---

### `[]` — Vector (vetor)

- **O que é:** coleção **ordenada**, acesso por índice em O(1).
- **Uso:** argumentos de funções, uma rota (path, method, interceptors, etc.), “lista de coisas com ordem”.

```clojure
[1 2 3]
[:request :headers "origin"]
[cors-interceptor `get-counter]
```

No seu código: vetores são usados para argumentos de `fn`/`defn`, para caminhos em `get-in`/`update-in` e para a definição de cada rota.

---

### `{}` — Map (mapa)

- **O que é:** coleção **chave–valor** (hash map).
- **Uso:** resposta HTTP, contexto do Pedestal, config do service.

```clojure
{:status 200 :body "..."}
{:name ::cors :enter (fn ...) :leave (fn ...)}
```

Chaves são quase sempre keywords (`:status`, `::http/port`).

---

### `->` — Threading macro (thread first)

- **O que é:** passa o resultado de uma expressão como **primeiro argumento** da seguinte.
- **Uso:** encadear chamadas sem aninhar parênteses.

```clojure
(-> service
    http/create-server
    http/start)
; equivale a:
(http/start (http/create-server service))
```

`service` → `create-server` → `start`. Deixa o fluxo “de cima para baixo”.

---

## 2. Funções do core que usei

### `assoc`

- **Associar** chave(s) e valor(es) a um mapa (ou vetor). **Não altera** o mapa original; devolve um **novo** mapa.

```clojure
(assoc ctx ::origin origin)
; ctx = {:request {...} ...}
; resultado = ctx com mais uma chave ::origin e valor origin
```

Útil para “adicionar uma chave ao mapa sem mutar”.

---

### `get-in`

- **Acessar** valor aninhado em mapas (e vetores) usando uma **lista de chaves**.

```clojure
(get-in ctx [:request :headers "origin"] "*")
; 1) ctx
; 2) caminho: :request → :headers → "origin"
; 3) valor default se não achar: "*"
```

Equivalente a `(get (get (get ctx :request) :headers) "origin")`, com default.

---

### `update-in`

- **Atualizar** um valor aninhado aplicando uma função ao valor atual.

```clojure
(update-in ctx [:response :headers]
           (fnil merge {})
           {"Access-Control-Allow-Origin" origin ...})
```

- Caminho: `ctx` → `:response` → `:headers`.
- `(fnil merge {})` é a função aplicada ao valor que está em `[:response :headers]`.
- O último argumento é passado para essa função junto com o valor atual.

Se `:headers` for `nil`, `(fnil merge {})` usa `{}` no lugar do nil e aí faz `(merge {} {...})`, evitando NPE. Resultado: um **novo** `ctx` com os headers CORS merged.

---

### `fnil`

- **Cria uma função** que, quando o **primeiro argumento** for `nil`, usa um **valor default** no lugar.

```clojure
(fnil merge {})
; Nova função: "como merge, mas se o 1º arg for nil, usa {} no lugar"
; (merge nil {:a 1})  → erro
; ((fnil merge {}) nil {:a 1})  → {:a 1}
```

No `update-in`, o valor em `[:response :headers]` pode ser `nil`; com `fnil` você faz merge sem erro.

---

### `merge`

- **Junta** mapas: chaves do primeiro, depois do segundo (o segundo sobrescreve quando a chave é a mesma).

```clojure
(merge {:a 1} {:b 2})           ; => {:a 1 :b 2}
(merge nil {:a 1})              ; => erro (nil não é mapa)
((fnil merge {}) nil {:a 1})    ; => {:a 1}
```

No CORS você está fazendo “headers atuais merged com os headers de CORS”.

---

### `let`

- **Liga** nomes a valores em um escopo local.

```clojure
(let [origin (get-in ctx [:request :headers "origin"] "*")]
  (assoc ctx ::origin origin))
```

“Calcule `origin` uma vez e use no `assoc`.” Os colchetes são pares [nome valor nome valor ...].

---

### `fn`

- **Cria uma função** anônima.

```clojure
(fn [ctx]
  (let [origin (get-in ctx [:request :headers "origin"] "*")]
    (assoc ctx ::origin origin)))
```

`[ctx]` = parâmetros. O corpo pode usar `ctx`. `(fn [x] (+ x 1))` é como “lambda” em outras linguagens.

---

### `defn`

- **Define uma função com nome** (atalho para `(def nome (fn [...] ...))`).

```clojure
(defn get-counter [_]
  (json-response {:value @counter*}))
```

Nome: `get-counter`. Parâmetros: um (não usado, por isso `_`). Corpo: uma expressão.

---

## 3. Estado: atom, swap!, reset!, defonce

### `atom`

- **Referência** que guarda um valor e pode ser alterada de forma **atômica** (thread-safe).

```clojure
(def counter* (atom 0))
@counter*        ; ler: 0
(swap! counter* inc)   ; atualizar com (inc valor-atual) → 1
(reset! counter* 0)    ; colocar 0 de volta
```

---

### `swap!`

- **Atualiza** o valor do atom com uma função que recebe o valor atual e retorna o novo. O retorno de `swap!` é o **novo** valor.

```clojure
(swap! counter* inc)
; inc do 0 => 1. O atom passa a ser 1. swap! retorna 1.
```

No seu handler você usa esse retorno no JSON: `(json-response {:value (swap! counter* inc)})`.

---

### `reset!`

- **Substitui** o valor do atom por um valor fixo. Retorna esse valor.

```clojure
(reset! counter* 0)   ; atom vira 0, retorna 0
```

---

### `defonce`

- Como `def`, mas só **define** se o nome ainda **não** estiver definido (útil no REPL para não recriar estado ao recompilar).

```clojure
(defonce counter* (atom 0))
```

Assim o contador não é zerado toda vez que você recarrega o arquivo.

---

## 4. Outras formas que aparecem no código

### `inc`

- Soma 1 ao número. `(inc 0)` => `1`.

### `deref`

- Mesmo que `@`: `(deref counter*)` = `@counter*`.

### `-main`

- Nome especial: ponto de entrada quando você roda com `clj -M:run` ou `java -jar`. O “-” na frente é só convenção de nome para “ponto de entrada”.

### Keywords como “função”

- Em `(::origin ctx "*")`: keywords podem ser usadas como **função** que faz lookup no mapa.  
  `(::origin ctx "*")` é o mesmo que `(get ctx ::origin "*")` — pega o valor da chave `::origin` em `ctx`, ou `"*"` se não achar.

---

## 5. Resumo em uma frase (para entrevista)

| Símbolo / função | Em uma frase |
|------------------|--------------|
| `:` | Keyword: “label” imutável, usado como chave em mapas. |
| `::` | Keyword no namespace atual (ex.: `::cors`). |
| `::http/port` | Keyword do namespace de outra lib (config do Pedestal). |
| `` ` `` | Syntax quote: símbolo qualificado no namespace atual (usado nas rotas). |
| `@` | Lê o valor atual de um atom (deref). |
| `*` em `counter*` | Convenção: nome indica “recurso global / estado”. |
| `_` | Convenção: parâmetro não usado. |
| `&` em `[& _]` | Rest args: “todos os argumentos”; aqui não usados. |
| `#{}` | Set: coleção sem ordem, sem repetição. |
| `->` | Threading: resultado vira primeiro arg da próxima expressão. |
| `assoc` | Adiciona/sobrescreve chave em mapa; retorna mapa novo. |
| `get-in` | Acessa valor aninhado por lista de chaves; pode ter default. |
| `update-in` | Atualiza valor aninhado aplicando uma função; retorna estrutura nova. |
| `fnil` | Envolve uma função: se 1º arg for nil, usa um default. |
| `merge` | Junta mapas (segundo sobrescreve chaves do primeiro). |
| `swap!` | Atualiza atom com uma função (valor-atual → valor-novo); retorna o novo valor. |
| `reset!` | Coloca o atom em um valor fixo; retorna esse valor. |
| `defonce` | Define só uma vez (útil para estado no REPL). |

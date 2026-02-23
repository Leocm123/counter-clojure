# Backend Clojure (Pedestal) - Counter API
FROM clojure:temurin-21-tools-deps-jammy

WORKDIR /app

# Copiar deps primeiro para aproveitar cache de camadas
COPY deps.edn .
RUN clj -P

COPY src ./src

EXPOSE 3000

CMD ["clj", "-M:run"]

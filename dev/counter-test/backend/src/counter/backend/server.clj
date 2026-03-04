(ns counter.backend.server
  (:require
   [cheshire.core :as json]
   [io.pedestal.connector :as conn]
   [io.pedestal.http.jetty :as jetty]
   [io.pedestal.interceptor :as interceptor]))

;; ----------------------------
;; State (ATOM)
;; ----------------------------
(defonce counter* (atom 0))

;; website usa JSON, então precisamos de uma função para converter EDN em respostas JSON
(defn json-response [m]
  {:status 200
   :headers {"Content-Type" "application/json; charset=utf-8"}
   :body (json/generate-string m)})

;; ----------------------------
;; CORS (não pode setar :response no :enter)
;; ----------------------------
(def cors-interceptor
  (interceptor/interceptor
   {:name ::cors
    ;; identtifica de onde vem o pedido (origin) e guarda no ctx, para usar na resposta
    :enter (fn [ctx]
             ;; guarda o origin no ctx (não cria response aqui)
             (let [origin (get-in ctx [:request :headers "origin"] "*")]
               (assoc ctx ::origin origin)))
    ;; na resposta, pega o origin do ctx e seta os headers CORS
    :leave (fn [ctx]
             (let [origin (::origin ctx "*")]
               (update-in ctx [:response :headers]
                          (fnil merge {})
                          {"Access-Control-Allow-Origin" origin
                           "Access-Control-Allow-Methods" "GET,POST,OPTIONS"
                           "Access-Control-Allow-Headers" "Content-Type"
                           "Access-Control-Allow-Credentials" "true"})))}))

;; ----------------------------
;; Handlers
;; ----------------------------
(defn get-counter [_]
  (json-response {:value @counter*}))
;;atalho drefer

(defn increment-counter [_]
  (json-response {:value (swap! counter* inc)}))

(defn reset-counter [_]
  (json-response {:value (reset! counter* 0)}))

;; ----------------------------
;; Routes
;; ----------------------------
(def routes
  #{["/api/counter" :get [cors-interceptor get-counter] :route-name ::get-counter]
    ["/api/counter/increment" :post [cors-interceptor increment-counter] :route-name ::inc]
    ["/api/counter/reset" :post [cors-interceptor reset-counter] :route-name ::reset]
    ;; curl.exe http://localhost:3000/api/counter
    ;; curl.exe -X POST http://localhost:3000/api/counter/increment
    ;; curl.exe -X POST http://localhost:3000/api/counter/reset
    })

(defn -main [& _]
  (println "Backend on http://0.0.0.0:3000")
  (-> (conn/default-connector-map "0.0.0.0" 3000)
      (assoc :join? true)
      (conn/with-default-interceptors)
      (conn/with-routes routes)
      (jetty/create-connector nil)
      (conn/start!)))

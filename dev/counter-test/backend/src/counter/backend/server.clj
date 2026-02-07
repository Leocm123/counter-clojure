(ns counter.backend.server
  (:require
   [cheshire.core :as json]
   [io.pedestal.http :as http]
   [io.pedestal.http.route :as route]
   [io.pedestal.interceptor :as interceptor]))

;; ----------------------------
;; State (ATOM)
;; ----------------------------
(defonce counter* (atom 0))

(defn json-response [m]
  {:status 200
   :headers {"Content-Type" "application/json; charset=utf-8"}
   :body (json/generate-string m)})

;; ----------------------------
;; CORS correto (não pode setar :response no :enter)
;; ----------------------------
(def cors-interceptor
  (interceptor/interceptor
   {:name ::cors
    :enter (fn [ctx]
             ;; guarda o origin no ctx (não cria response aqui)
             (let [origin (get-in ctx [:request :headers "origin"] "*")]
               (assoc ctx ::origin origin)))
    :leave (fn [ctx]
             (let [origin (::origin ctx "*")]
               (update-in ctx [:response :headers]
                          (fnil merge {})
                          {"Access-Control-Allow-Origin" origin
                           "Access-Control-Allow-Methods" "GET,POST,OPTIONS"
                           "Access-Control-Allow-Headers" "Content-Type"
                           "Access-Control-Allow-Credentials" "true"})))}))

(defn options-handler [_]
  {:status 204
   :headers {"Access-Control-Allow-Methods" "GET,POST,OPTIONS"
             "Access-Control-Allow-Headers" "Content-Type"}})

;; ----------------------------
;; Handlers
;; ----------------------------
(defn get-counter [_]
  (json-response {:value @counter*}))

(defn increment-counter [_]
  (json-response {:value (swap! counter* inc)}))

(defn reset-counter [_]
  (reset! counter* 0)
  (json-response {:value 0}))

;; ----------------------------
;; Routes
;; ----------------------------
(def routes
  (route/expand-routes
   #{["/api/counter" :get [cors-interceptor `get-counter] :route-name ::get-counter]
     ["/api/counter/increment" :post [cors-interceptor `increment-counter] :route-name ::inc]
     ["/api/counter/reset" :post [cors-interceptor `reset-counter] :route-name ::reset]

     ;; preflight
     ["/api/*path" :options [cors-interceptor `options-handler] :route-name ::options]}))

(def service
  {:env :dev
   ::http/routes routes
   ::http/type :jetty
   ::http/port 3000
   ::http/join? false})

(defn -main [& _]
  (-> service
      http/create-server
      http/start)
  (println "Backend on http://localhost:3000"))

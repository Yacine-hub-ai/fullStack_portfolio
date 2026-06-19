# Requêtes PromQL — Projet Portfolio

## 1. API Backend

### Disponibilité
```promql
# Backend UP (1 = disponible, 0 = down)
up{job="portfolio-backend"}
```

### Trafic
```promql
# Taux de requêtes par seconde (fenêtre 1 min)
rate(http_requests_total{job="portfolio-backend"}[1m])

# Taux de requêtes par seconde (fenêtre 5 min)
rate(http_requests_total{job="portfolio-backend"}[5m])

# Taux de requêtes par route et méthode
sum by (route, method) (rate(http_requests_total{job="portfolio-backend"}[1m]))

# Nombre total de requêtes sur la dernière heure
increase(http_requests_total{job="portfolio-backend"}[1h])

# Requêtes en cours
http_requests_in_flight{job="portfolio-backend"}
```

### Erreurs
```promql
# Taux d'erreurs 5xx (valeur brute)
rate(http_requests_total{job="portfolio-backend", status=~"5.."}[5m])

# Taux d'erreurs 5xx en pourcentage
rate(http_requests_total{job="portfolio-backend", status=~"5.."}[5m])
/
rate(http_requests_total{job="portfolio-backend"}[5m]) * 100

# Répartition des codes de réponse HTTP
sum by (status) (increase(http_requests_total{job="portfolio-backend"}[1h]))

# Uniquement les erreurs 4xx
rate(http_requests_total{job="portfolio-backend", status=~"4.."}[5m])
```

### Latence
```promql
# Latence médiane P50 (toutes routes)
histogram_quantile(0.50,
  sum by (le) (rate(http_request_duration_ms_bucket{job="portfolio-backend"}[5m]))
)

# Latence P90
histogram_quantile(0.90,
  sum by (le) (rate(http_request_duration_ms_bucket{job="portfolio-backend"}[5m]))
)

# Latence P99
histogram_quantile(0.99,
  sum by (le) (rate(http_request_duration_ms_bucket{job="portfolio-backend"}[5m]))
)

# Latence P50 et P99 par route
histogram_quantile(0.50,
  sum by (le, route) (rate(http_request_duration_ms_bucket{job="portfolio-backend"}[5m]))
)

histogram_quantile(0.99,
  sum by (le, route) (rate(http_request_duration_ms_bucket{job="portfolio-backend"}[5m]))
)

# Latence moyenne
rate(http_request_duration_ms_sum{job="portfolio-backend"}[5m])
/
rate(http_request_duration_ms_count{job="portfolio-backend"}[5m])
```

---

## 2. Node.js (mémoire & CPU)

```promql
# Heap utilisé (octets)
portfolio_nodejs_heap_size_used_bytes{app="portfolio-backend"}

# Heap total (octets)
portfolio_nodejs_heap_size_total_bytes{app="portfolio-backend"}

# Mémoire résidente (RAM)
portfolio_process_resident_memory_bytes{app="portfolio-backend"}

# CPU user (secondes)
rate(portfolio_process_cpu_user_seconds_total{app="portfolio-backend"}[1m])

# CPU système
rate(portfolio_process_cpu_system_seconds_total{app="portfolio-backend"}[1m])

# Nombre de file descriptors ouverts
portfolio_process_open_fds{app="portfolio-backend"}

# Event loop lag (Node.js)
portfolio_nodejs_eventloop_lag_seconds{app="portfolio-backend"}

# Garbage collector — durée totale
rate(portfolio_nodejs_gc_duration_seconds_sum[5m])
```

---

## 3. Système (node-exporter)

```promql
# Utilisation CPU en % (toutes instances)
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# RAM disponible
node_memory_MemAvailable_bytes

# RAM utilisée en %
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Espace disque utilisé en %
100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100)

# Trafic réseau entrant (octets/s)
rate(node_network_receive_bytes_total{device="eth0"}[5m])

# Trafic réseau sortant (octets/s)
rate(node_network_transmit_bytes_total{device="eth0"}[5m])
```

---

## 4. MongoDB (mongodb-exporter)

```promql
# MongoDB disponible
up{job="mongodb"}

# Connexions actives
mongodb_connections{state="current"}

# Opérations par type (insert, query, update, delete)
rate(mongodb_op_counters_total[5m])

# Latence des opérations
rate(mongodb_mongod_op_latencies_latency_total[5m])
/
rate(mongodb_mongod_op_latencies_ops_total[5m])
```

---

## 5. Conteneurs Docker (cAdvisor)

```promql
# CPU utilisé par conteneur (%)
rate(container_cpu_usage_seconds_total{name=~"portfolio-.*"}[5m]) * 100

# RAM utilisée par conteneur
container_memory_usage_bytes{name=~"portfolio-.*"}

# RAM limite par conteneur
container_spec_memory_limit_bytes{name=~"portfolio-.*"}

# Trafic réseau entrant par conteneur
rate(container_network_receive_bytes_total{name=~"portfolio-.*"}[5m])

# Redémarrages de conteneurs
increase(container_restart_count{name=~"portfolio-.*"}[1h])
```

---

## 6. Alertes actives

```promql
# Voir toutes les alertes actives
ALERTS

# Alertes critiques uniquement
ALERTS{severity="critical"}

# Alertes en état "firing"
ALERTS{alertstate="firing"}
```

---

## 7. Requêtes utiles pour la démo

```promql
# Générer du trafic puis observer :
# for i in $(seq 1 100); do curl -s http://localhost:3001/api/projets > /dev/null; done

# Vérifier que les métriques HTTP arrivent
http_requests_total{job="portfolio-backend"}

# Top 5 routes les plus appelées
topk(5, sum by (route) (increase(http_requests_total{job="portfolio-backend"}[1h])))

# Routes avec le plus d'erreurs
topk(5, sum by (route) (increase(http_requests_total{job="portfolio-backend", status=~"[45].."}[1h])))
```

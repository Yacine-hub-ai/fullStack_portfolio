# 7. Prometheus & Grafana — Monitoring du projet fil rouge

## 7.1 Problématique — Pourquoi monitorer ?

Une application en production est une boîte noire sans observabilité. Sans monitoring :

- On découvre les pannes **après** les utilisateurs
- On ne sait pas si les ressources (CPU, RAM, disque) sont saturées
- On ne peut pas mesurer l'impact d'un déploiement
- Les alertes sont réactives (email après crash) plutôt que proactives

**Les questions auxquelles le monitoring répond :**

| Question | Métrique |
|----------|----------|
| L'API répond-elle ? | `http_requests_total`, `up` |
| Combien de requêtes par seconde ? | `rate(http_requests_total[5m])` |
| Quelle est la latence P99 ? | `http_request_duration_seconds` |
| MongoDB est-il saturé ? | `mongodb_connections`, `mongodb_op_counters_total` |
| Le pod K8s redémarre-t-il ? | `kube_pod_container_status_restarts_total` |

---

## 7.2 Présentation — Quoi ?

### Prometheus
Système de monitoring **open-source** créé par SoundCloud (2012), maintenant projet CNCF.
- Collecte des métriques en **mode pull** (scrape HTTP)
- Stockage en **time-series database** (TSDB) locale
- Langage de requête : **PromQL**

### Grafana
Plateforme de **visualisation** open-source.
- Se connecte à Prometheus (et 50+ autres sources)
- Tableaux de bord interactifs
- Système d'alerting avec notifications (email, Slack, PagerDuty…)

### AlertManager
Composant Prometheus qui gère le **routage des alertes** :
- Déduplication, groupement, silences
- Envoi vers email, Slack, webhook…

---

## 7.3 Concepts

### Target
Une **target** est un endpoint HTTP que Prometheus scrape pour collecter des métriques.
```
http://backend:3001/metrics   ← target Express.js
http://mongodb-exporter:9216/metrics ← target MongoDB
http://node-exporter:9100/metrics    ← target système (CPU/RAM)
```

### Modèle de données
Chaque métrique est identifiée par :
- Un **nom** : `http_requests_total`
- Des **labels** (dimensions) : `{method="GET", route="/api/projets", status="200"}`
- Une **valeur** + **timestamp**

```
http_requests_total{method="GET",route="/api/projets",status="200"} 142 1718789432000
```

### Types de métriques

| Type | Description | Exemple |
|------|-------------|---------|
| **Counter** | Valeur qui ne fait qu'augmenter | Nombre de requêtes |
| **Gauge** | Valeur qui monte et descend | Connexions actives, RAM |
| **Histogram** | Distribution de valeurs (buckets) | Latence des requêtes |
| **Summary** | Quantiles calculés côté client | P50, P90, P99 |

### Exporters
Un **exporter** expose des métriques au format Prometheus pour des systèmes tiers :

| Exporter | Système monitoré | Port |
|----------|-----------------|------|
| `node-exporter` | CPU, RAM, disque, réseau | 9100 |
| `mongodb-exporter` | MongoDB | 9216 |
| `cadvisor` | Conteneurs Docker | 8080 |
| `kube-state-metrics` | Ressources Kubernetes | 8080 |
| `prom-client` (Node.js) | Application Express | 3001/metrics |

### Alertes
Définies en PromQL dans des fichiers `.rules.yml` :
```yaml
- alert: BackendDown
  expr: up{job="backend"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Backend API indisponible"
```

### PromQL — Exemples

```promql
# Taux de requêtes par seconde (5 min)
rate(http_requests_total[5m])

# Latence P99
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Taux d'erreurs HTTP 5xx
rate(http_requests_total{status=~"5.."}[5m])

# RAM utilisée par les pods
container_memory_usage_bytes{namespace="portfolio"}
```

---

## 7.4 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Namespace: monitoring                     │
│                                                             │
│  ┌─────────────┐  scrape  ┌──────────────────────────────┐ │
│  │  Prometheus  │◄────────│  Targets (endpoints /metrics) │ │
│  │  :9090       │         │  - backend:3001/metrics       │ │
│  └──────┬──────┘         │  - node-exporter:9100         │ │
│         │ alerts          │  - mongodb-exporter:9216      │ │
│         ▼                 │  - kube-state-metrics:8080    │ │
│  ┌─────────────┐         └──────────────────────────────┘ │
│  │AlertManager │                                           │
│  │  :9093       │──► Email / Slack                        │
│  └─────────────┘                                           │
│                                                             │
│  ┌─────────────┐  query   ┌─────────────┐                 │
│  │   Grafana   │◄────────│  Prometheus  │                  │
│  │   :3000     │  PromQL  └─────────────┘                  │
│  └─────────────┘                                           │
└─────────────────────────────────────────────────────────────┘

Flux de données :
Application → /metrics → Prometheus (pull) → Grafana (query) → Dashboard
                                           → AlertManager → Notification
```

---

## 7.5 Installation

### Option A — Docker Compose (développement local)

```bash
cd docker/monitoring
docker compose up -d
```

Accès :
- Prometheus : http://localhost:9090
- Grafana    : http://localhost:3001  (admin / admin)
- AlertManager: http://localhost:9093

### Option B — Kubernetes (production)

```bash
kubectl apply -f k8s/monitoring/
```

Ou via port-forward pour accéder localement :
```bash
kubectl port-forward svc/grafana     3001:3000 -n monitoring &
kubectl port-forward svc/prometheus  9090:9090 -n monitoring &
```

### Ajouter Prometheus comme source de données dans Grafana

1. Grafana → Configuration → Data Sources → Add
2. Type : **Prometheus**
3. URL : `http://prometheus:9090`
4. Save & Test

### Importer un dashboard K8s

1. Grafana → Dashboards → Import
2. ID : **15661** (Kubernetes Cluster Monitoring)
3. ID : **1860**  (Node Exporter Full)
4. ID : **7362**  (MongoDB Overview)

---

## 7.6 Démo — Intégration dans le projet fil rouge

### Ce qui est intégré

1. **Backend Express** expose `/metrics` via `prom-client`
   - Métriques HTTP (requêtes, latence, status codes)
   - Métriques Node.js (event loop, GC, mémoire heap)

2. **Prometheus** scrape toutes les 15s :
   - Le backend portfolio
   - MongoDB via `mongodb-exporter`
   - Les nœuds via `node-exporter`

3. **Grafana** avec 3 dashboards préconfigurés :
   - Portfolio API (requêtes, latence, erreurs)
   - Infrastructure (CPU, RAM, réseau)
   - MongoDB (connexions, opérations, réplication)

4. **AlertManager** avec règles d'alerte :
   - Backend down > 1 min → alerte critique
   - Latence P99 > 500ms → alerte warning
   - Erreurs 5xx > 5% → alerte critique

### Tester les métriques

```bash
# Voir les métriques brutes du backend
curl http://localhost:3001/metrics

# Générer du trafic
for i in $(seq 1 50); do curl -s http://localhost:3001/api/projets > /dev/null; done

# Vérifier dans Prometheus
open http://localhost:9090
# Requête : rate(http_requests_total[1m])
```

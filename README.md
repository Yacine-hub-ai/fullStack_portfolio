# fullStack_portfolio

Projet fil rouge full stack avec frontend, backend Node/Express, MongoDB, Docker, Kubernetes, Jenkins, SonarQube, Terraform et Prometheus/Grafana.

## Terraform

La documentation Terraform est disponible dans [docs/terraform.md](docs/terraform.md).

Deux demos sont ajoutees :

- [terraform/aws-demo](terraform/aws-demo) : creation d'un VPC et d'une instance EC2 sur AWS ;
- [terraform/k8s-app](terraform/k8s-app) : deploiement de l'application portfolio sur Kubernetes avec Terraform.

## Prometheus & Grafana

La documentation Prometheus/Grafana est disponible dans [docs/prometheus-grafana.md](docs/prometheus-grafana.md).

### Démarrage rapide (monitoring local)

```bash
# Démarrer le stack applicatif
docker compose -f docker/docker-compose.yml up -d

# Démarrer le stack monitoring
docker compose -f docker/monitoring/docker-compose.monitoring.yml up -d
```

Accès :
- Prometheus  : http://localhost:9090
- Grafana     : http://localhost:3030  (admin / admin)
- AlertManager: http://localhost:9093
- Métriques   : http://localhost:3001/metrics

### Déploiement Kubernetes

```bash
kubectl apply -f k8s/monitoring/
kubectl port-forward svc/grafana    3030:3000 -n monitoring &
kubectl port-forward svc/prometheus 9090:9090 -n monitoring &
```

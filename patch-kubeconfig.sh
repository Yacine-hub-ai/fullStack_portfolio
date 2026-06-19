#!/bin/bash
set -e

# ── 1. Utiliser l'IP gateway Docker Desktop ───────────────────
# Minikube écoute sur 127.0.0.1 (localhost uniquement).
# Depuis un conteneur Docker, 192.168.65.254 est l'IP gateway
# Docker Desktop qui redirige vers localhost du Mac.
# (host.docker.internal résout en IPv6 en priorité sur ce système,
#  ce qui ne fonctionne pas avec Minikube en IPv4.)
HOST_IP="192.168.65.254"
echo "✅ Cible : $HOST_IP"

# ── 2. Récupérer l'URL Minikube ────────────────────────────────
MINIKUBE_URL=$(kubectl config view --raw -o jsonpath='{.clusters[0].cluster.server}')
echo "🔗 URL Minikube : $MINIKUBE_URL"
NEW_URL=$(echo "$MINIKUBE_URL" | sed "s/127\.0\.0\.1/$HOST_IP/g")
echo "🔗 Nouvelle URL : $NEW_URL"

# ── 3. Créer le dossier de destination ────────────────────────
mkdir -p docker/jenkins/secrets/kube

# ── 4. Exporter le kubeconfig brut et appliquer 3 patches ─────
#   a) Remplacer 127.0.0.1 → IP Mac  (accès réseau depuis le conteneur)
#   b) Remplacer le chemin ca.crt Mac → chemin dans le conteneur Jenkins
#   c) Remplacer les chemins client.crt / client.key Mac → conteneur Jenkins
kubectl config view --raw \
  | sed "s|$MINIKUBE_URL|$NEW_URL|g" \
  | sed "s|/Users/yacine/.minikube/ca.crt|/root/.minikube/ca.crt|g" \
  | sed "s|/Users/yacine/.minikube/profiles/minikube/client.crt|/root/.minikube/profiles/minikube/client.crt|g" \
  | sed "s|/Users/yacine/.minikube/profiles/minikube/client.key|/root/.minikube/profiles/minikube/client.key|g" \
  > docker/jenkins/secrets/kube/config

echo ""
echo "✅ kubeconfig patché → docker/jenkins/secrets/kube/config"
echo ""
echo "📋 Vérification :"
grep "server:"               docker/jenkins/secrets/kube/config
grep "certificate-authority" docker/jenkins/secrets/kube/config
grep "client-certificate"    docker/jenkins/secrets/kube/config
grep "client-key"            docker/jenkins/secrets/kube/config
echo ""
echo "🔄 Redémarre Jenkins pour appliquer : docker restart portfolio-jenkins"

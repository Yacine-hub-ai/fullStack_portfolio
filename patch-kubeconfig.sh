#!/bin/bash
HOST_IP=$(ipconfig getifaddr en0)
echo "IP : $HOST_IP"
mkdir -p docker/jenkins/secrets/kube
MINIKUBE_URL=$(kubectl config view --raw -o jsonpath='{.clusters[0].cluster.server}')
echo "Minikube URL : $MINIKUBE_URL"
NEW_URL=$(echo "$MINIKUBE_URL" | sed "s/127\.0\.0\.1/$HOST_IP/g")
echo "Nouvelle URL : $NEW_URL"
kubectl config view --raw | sed "s|$MINIKUBE_URL|$NEW_URL|g" > docker/jenkins/secrets/kube/config
echo "Done !"

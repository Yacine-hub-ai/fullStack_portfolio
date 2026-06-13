output "namespace" {
  description = "Namespace Kubernetes de l'application."
  value       = kubernetes_namespace_v1.portfolio.metadata[0].name
}

output "ingress_host" {
  description = "Host configure sur l'ingress."
  value       = var.ingress_host
}

output "frontend_node_port_url" {
  description = "URL locale possible avec Minikube ou un cluster local expose en NodePort."
  value       = "http://localhost:${var.frontend_node_port}"
}

output "kubectl_check_command" {
  description = "Commande de verification du deploiement."
  value       = "kubectl get all -n ${kubernetes_namespace_v1.portfolio.metadata[0].name}"
}

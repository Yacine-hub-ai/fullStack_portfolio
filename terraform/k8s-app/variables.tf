variable "kubeconfig_path" {
  description = "Chemin vers le fichier kubeconfig."
  type        = string
  default     = "~/.kube/config"
}

variable "kube_context" {
  description = "Contexte Kubernetes a utiliser. Laisser vide pour le contexte courant."
  type        = string
  default     = ""
}

variable "namespace" {
  description = "Namespace Kubernetes de l'application."
  type        = string
  default     = "portfolio"
}

variable "frontend_image" {
  description = "Image Docker du frontend."
  type        = string
  default     = "cineya/portfolio-frontend:latest"
}

variable "backend_image" {
  description = "Image Docker du backend."
  type        = string
  default     = "cineya/portfolio-backend:latest"
}

variable "mongodb_image" {
  description = "Image Docker MongoDB."
  type        = string
  default     = "mongo:7.0"
}

variable "frontend_replicas" {
  description = "Nombre de replicas frontend."
  type        = number
  default     = 1
}

variable "backend_replicas" {
  description = "Nombre de replicas backend."
  type        = number
  default     = 1
}

variable "frontend_node_port" {
  description = "NodePort expose pour le frontend."
  type        = number
  default     = 30080
}

variable "mongo_root_user" {
  description = "Utilisateur root MongoDB."
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "mongo_root_password" {
  description = "Mot de passe root MongoDB."
  type        = string
  default     = "ChangeMe123"
  sensitive   = true
}

variable "mongo_database" {
  description = "Base MongoDB utilisee par l'application."
  type        = string
  default     = "portfolio"
}

variable "mongo_storage_size" {
  description = "Taille du volume persistant MongoDB."
  type        = string
  default     = "1Gi"
}

variable "ingress_host" {
  description = "Nom DNS local utilise par l'ingress."
  type        = string
  default     = "portfolio.local"
}

variable "ingress_class_name" {
  description = "Classe ingress Kubernetes."
  type        = string
  default     = "nginx"
}

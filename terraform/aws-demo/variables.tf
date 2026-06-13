variable "project_name" {
  description = "Nom utilise pour taguer les ressources AWS."
  type        = string
  default     = "portfolio-demo"
}

variable "aws_region" {
  description = "Region AWS cible."
  type        = string
  default     = "eu-west-3"
}

variable "vpc_cidr" {
  description = "Bloc CIDR du VPC."
  type        = string
  default     = "10.10.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Bloc CIDR du subnet public."
  type        = string
  default     = "10.10.1.0/24"
}

variable "instance_type" {
  description = "Type de l'instance EC2 de demonstration."
  type        = string
  default     = "t2.micro"
}

variable "ssh_cidr" {
  description = "CIDR autorise pour SSH. A restreindre avec votre IP publique."
  type        = string
  default     = "0.0.0.0/0"
}

variable "key_name" {
  description = "Nom optionnel d'une paire de cles EC2 existante."
  type        = string
  default     = null
}

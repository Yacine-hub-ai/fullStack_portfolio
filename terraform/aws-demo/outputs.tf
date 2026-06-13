output "vpc_id" {
  description = "Identifiant du VPC cree."
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "Identifiant du subnet public."
  value       = aws_subnet.public.id
}

output "instance_id" {
  description = "Identifiant de l'instance EC2."
  value       = aws_instance.web.id
}

output "instance_public_ip" {
  description = "Adresse IP publique de l'instance EC2."
  value       = aws_instance.web.public_ip
}

output "http_url" {
  description = "URL HTTP de demonstration."
  value       = "http://${aws_instance.web.public_ip}"
}

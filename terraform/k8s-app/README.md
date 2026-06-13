# Integration Terraform Kubernetes

Ce dossier deploie l'application portfolio sur Kubernetes avec Terraform.

Ressources gerees :

- namespace `portfolio` ;
- secret MongoDB ;
- StatefulSet et service MongoDB ;
- deployment et service backend ;
- deployment et service frontend ;
- ingress `portfolio.local`.

## Utilisation

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

## Verification

```bash
kubectl get all -n portfolio
kubectl get ingress -n portfolio
```

## Nettoyage

```bash
terraform destroy
```

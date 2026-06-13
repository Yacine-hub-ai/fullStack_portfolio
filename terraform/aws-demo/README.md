# Demo Terraform AWS : VPC + EC2

Cette demo illustre les concepts Terraform avec AWS : provider, data source, variables, resources et outputs.

## Utilisation

```bash
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

## Nettoyage

```bash
terraform destroy
```

Les credentials AWS doivent etre configures avant l'execution, par exemple avec `aws configure`.

# Terraform

## 6.1. Problematique : pourquoi Terraform ?

Dans un projet DevOps, l'infrastructure doit etre reproductible, lisible et versionnee comme le code applicatif. Sans outil d'IaC, la creation d'un VPC, d'une machine EC2 ou le deploiement sur Kubernetes se fait souvent a la main, ce qui provoque des ecarts entre les environnements, des oublis et des deploiements difficiles a rejouer.

Terraform repond a ce probleme en decrivant l'infrastructure dans des fichiers de configuration. On peut ensuite planifier les changements, les appliquer, les relire dans Git et reconstruire le meme environnement plus tard.

## 6.2. Presentation : quoi ?

Terraform est un outil d'Infrastructure as Code developpe par HashiCorp. Il permet de declarer l'etat souhaite d'une infrastructure, puis de laisser Terraform creer, modifier ou supprimer les ressources necessaires.

Dans ce projet fil rouge, Terraform sert a deux choses :

- faire une demonstration cloud avec un VPC et une instance EC2 sur AWS ;
- deployer l'application portfolio sur un cluster Kubernetes a partir de ressources Terraform.

## 6.3. Concepts

- **Provider** : plugin qui permet a Terraform de communiquer avec une plateforme. Exemples : `aws`, `kubernetes`.
- **Resource** : element cree ou gere par Terraform. Exemples : `aws_vpc`, `aws_instance`, `kubernetes_deployment_v1`.
- **Module** : dossier Terraform reutilisable qui regroupe plusieurs ressources.
- **State** : fichier qui garde la correspondance entre le code Terraform et les ressources reelles. Il ne doit pas etre modifie a la main.
- **Data source** : lecture d'une ressource ou information existante sans la creer. Exemple : recuperer la derniere AMI Amazon Linux.
- **Variable** : valeur parametrable pour eviter de coder en dur les noms, ports, images ou regions.
- **Output** : information affichee apres un `terraform apply`, par exemple une URL, une IP ou un nom de namespace.
- **Plan** : apercu des changements que Terraform va faire avant l'application.

## 6.4. Architecture

Le dossier Terraform est separe en deux parties :

```text
terraform/
  aws-demo/   # demonstration : VPC + subnet public + security group + EC2
  k8s-app/    # integration projet : deploiement de l'app sur Kubernetes
```

Architecture de l'integration Kubernetes :

```text
Utilisateur
  |
  v
Ingress portfolio.local
  |
  +--> Service frontend -> Deployment frontend -> image cineya/portfolio-frontend
  |
  +--> Service backend  -> Deployment backend  -> image cineya/portfolio-backend
                                      |
                                      v
                              Service mongodb
                                      |
                                      v
                              StatefulSet MongoDB + PVC
```

## 6.5. Fichiers de configuration

### Demo AWS

- `terraform/aws-demo/versions.tf` : versions Terraform et provider AWS.
- `terraform/aws-demo/variables.tf` : region, CIDR, type d'instance, nom du projet.
- `terraform/aws-demo/main.tf` : VPC, subnet, internet gateway, route table, security group et EC2.
- `terraform/aws-demo/outputs.tf` : identifiants utiles apres deploiement.
- `terraform/aws-demo/terraform.tfvars.example` : exemple de variables.

### Integration Kubernetes

- `terraform/k8s-app/versions.tf` : versions Terraform et provider Kubernetes.
- `terraform/k8s-app/variables.tf` : namespace, images, ports, hote ingress, secrets MongoDB.
- `terraform/k8s-app/main.tf` : namespace, secret, MongoDB, backend, frontend, ingress.
- `terraform/k8s-app/outputs.tf` : namespace, host et endpoint local.
- `terraform/k8s-app/terraform.tfvars.example` : exemple de personnalisation.

## 6.6. Commandes de base

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform destroy
```

Commandes utiles :

```bash
terraform output
terraform state list
terraform show
```

## 6.7. Installation

Sur macOS avec Homebrew :

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform version
```

Sur Linux, installer Terraform depuis le depot officiel HashiCorp ou telecharger le binaire depuis le site officiel, puis verifier :

```bash
terraform version
```

Pour la partie AWS, il faut aussi configurer les credentials :

```bash
aws configure
```

Pour la partie Kubernetes, il faut un cluster accessible et un fichier kubeconfig fonctionnel :

```bash
kubectl config current-context
kubectl get nodes
```

## 6.8. Demo

### Pratique 1 : creer un VPC et une EC2

```bash
cd terraform/aws-demo
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Cette demo cree :

- un VPC ;
- un subnet public ;
- une internet gateway ;
- une route table publique ;
- un security group HTTP/SSH ;
- une instance EC2 Amazon Linux.

Pour nettoyer :

```bash
terraform destroy
```

### Pratique 2 : deployer l'application sur Kubernetes

```bash
cd terraform/k8s-app
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Verifier le deploiement :

```bash
kubectl get all -n portfolio
kubectl get ingress -n portfolio
```

Si `portfolio.local` est utilise en local, ajouter l'entree correspondante dans `/etc/hosts` selon l'adresse du cluster ou de l'ingress controller.

Pour nettoyer :

```bash
terraform destroy
```

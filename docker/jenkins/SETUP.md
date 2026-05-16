# Guide de configuration Jenkins — Portfolio CI/CD

## 1. Démarrer Jenkins

```bash
cd docker/jenkins/
docker compose -f docker-compose.jenkins.yml up -d
```

Vérifier que le container tourne :
```bash
docker ps | grep portfolio-jenkins
```

Ouvrir l'interface : **http://localhost:8080**

---

## 2. Installer les plugins

Dans Jenkins : **Manage Jenkins → Plugins → Available plugins**

Installer les plugins suivants (ou utiliser `plugins.txt`) :

| Plugin | Description |
|---|---|
| `git` | Intégration Git / GitHub |
| `workflow-aggregator` | Support Pipeline déclaratif |
| `docker-workflow` | Étapes Docker dans le pipeline |
| `credentials-binding` | Injection des secrets dans le pipeline |
| `github` | Intégration webhook GitHub |
| `pipeline-utility-steps` | `readJSON` et autres utilitaires pipeline |

Redémarrer Jenkins après installation.

---

## 3. Configurer les Credentials

**Manage Jenkins → Credentials → System → Global credentials → Add Credentials**

### 3.1 Token GitHub

| Champ | Valeur |
|---|---|
| Kind | Username with password |
| Username | ton-username-github |
| Password | ton-token-github-PAT |
| ID | `github-token` |
| Description | GitHub Personal Access Token |

> Créer le PAT sur GitHub : Settings → Developer settings → Personal access tokens → Tokens (classic) → scopes : `repo`, `admin:repo_hook`

### 3.2 Credentials Docker Hub

| Champ | Valeur |
|---|---|
| Kind | Username with password |
| Username | cineya |
| Password | ton-mot-de-passe-dockerhub |
| ID | `dockerhub-credentials` |
| Description | Docker Hub — cineya |

### 3.3 Variables MongoDB

Créer 3 credentials de type **Secret text** :

| ID | Valeur |
|---|---|
| `mongo-root-user` | valeur de MONGO_ROOT_USER |
| `mongo-root-password` | valeur de MONGO_ROOT_PASSWORD |
| `mongo-db` | valeur de MONGO_DB |

---

## 4. Créer le job Pipeline

1. Cliquer sur **"New Item"**
2. Nom : `portfolio-pipeline`
3. Type : **Pipeline**
4. Cliquer **OK**

Dans la configuration du job :

- **Build Triggers** : cocher **"GitHub hook trigger for GITScm polling"**
- **Pipeline** :
  - Definition : `Pipeline script from SCM`
  - SCM : `Git`
  - Repository URL : `https://github.com/Yacine-hub-ai/fullStack_portfolio.git`
  - Credentials : `github-token`
  - Branch : `*/main`
  - Script Path : `Jenkinsfile`

Sauvegarder.

---

## 5. Configurer le webhook GitHub

Sur GitHub : **Settings → Webhooks → Add webhook**

| Champ | Valeur |
|---|---|
| Payload URL | `http://<ton-ip-locale>:8080/github-webhook/` |
| Content type | `application/json` |
| Events | `Just the push event` |
| SSL verification | Désactiver en local |

> Trouver ton IP locale : `ipconfig getifaddr en0` (macOS)

---

## 6. Tester le pipeline

1. Faire un push sur la branche `main`
2. Vérifier dans Jenkins que le build se déclenche automatiquement
3. Les 6 stages doivent passer au vert : Checkout → Build → Push to Docker Hub → Test → Deploy → Health Check

---

## 7. Commandes utiles

```bash
# Voir les logs Jenkins
docker logs portfolio-jenkins -f

# Redémarrer Jenkins
docker restart portfolio-jenkins

# Arrêter Jenkins
docker compose -f docker/jenkins/docker-compose.jenkins.yml down

# Vérifier l'accès Docker depuis Jenkins
docker exec portfolio-jenkins docker ps
```

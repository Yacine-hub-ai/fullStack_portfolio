# ── Backend Express.js ────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# ARG pour choisir le mode : production (défaut) ou test
ARG NODE_ENV=production

COPY package.json ./

# En production : exclure les devDependencies
# En test : installer toutes les dépendances
RUN if [ "$NODE_ENV" = "test" ]; then \
      npm install; \
    else \
      npm install --omit=dev; \
    fi

COPY . .

EXPOSE 3001

# En production : démarrer le serveur
# En test : lancer les tests
CMD if [ "$NODE_ENV" = "test" ]; then \
      node --test --test-timeout=15000 tests/api.test.js; \
    else \
      node app.js; \
    fi

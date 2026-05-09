# ── Build stage ────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Installer les dépendances en premier (cache Docker)
COPY package.json ./
RUN npm install --omit=dev

# Copier le code source
COPY . .

EXPOSE 3001

CMD ["node", "app.js"]

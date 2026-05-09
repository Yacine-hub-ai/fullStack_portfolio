# Nginx sert le fichier HTML statique
FROM nginx:1.27-alpine

# Supprimer les fichiers par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier la config Nginx personnalisée
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copier le index.html et la photo de profil depuis la racine du projet
COPY index.html /usr/share/nginx/html/index.html
COPY yass1.jpeg /usr/share/nginx/html/yass1.jpeg

# Donner les bonnes permissions
RUN chmod 644 /usr/share/nginx/html/index.html \
    && chmod 644 /usr/share/nginx/html/yass1.jpeg \
    && chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Multi-stage build für Hugo-Seite

# Stage 1: Build der Hugo-Seite
FROM docker.io/hugomods/hugo@sha256:dcbc5b53c4e53bb74a7c986caf58a3954395a1e9d8dc9bb492f2c610a7cf6eb0 AS builder

# Arbeitsverzeichnis setzen
WORKDIR /src

# Dependencies kopieren und installieren
COPY package*.json ./
RUN npm ci

# Projekt-Dateien kopieren
COPY . .

# Bootstrap SCSS und JS in Hugo Assets verfügbar machen
RUN mkdir -p assets/scss/bootstrap && \
    cp -r node_modules/bootstrap/scss/* assets/scss/bootstrap/ && \
    mkdir -p assets/js/vendor && \
    cp node_modules/bootstrap/dist/js/bootstrap.bundle.min.js assets/js/vendor/

# Clean Hugo resource cache to force regeneration
RUN rm -rf resources/_gen/ public/

# Hugo Build (Production)
RUN hugo --minify --environment production --baseURL "/"

# Stage 2: Nginx Server für statische Dateien
FROM docker.io/library/nginx@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752

# Nginx Konfiguration für SPA/Hugo
COPY --from=builder /src/public /usr/share/nginx/html

# Single source of truth for Nginx and its security headers.
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

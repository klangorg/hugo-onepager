# Multi-stage build für Hugo-Seite

# Stage 1: Build der Hugo-Seite
FROM hugomods/hugo:exts AS builder

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

# Hugo Build (Production)
RUN hugo --minify --environment production --baseURL "/"

# Stage 2: Nginx Server für statische Dateien
FROM nginx:alpine

# Nginx Konfiguration für SPA/Hugo
COPY --from=builder /src/public /usr/share/nginx/html

# Custom Nginx Config (optional)
RUN cat <<'NGINX_CONF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://rocket.xana.space; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://rocket.xana.space wss://rocket.xana.space; frame-src 'self' https://www.googletagmanager.com https://rocket.xana.space; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip Kompression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Cache Headers für statische Assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
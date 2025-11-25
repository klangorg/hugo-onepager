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

# Custom Nginx Config with strict CSP for Mozilla Observatory A+ rating
RUN cat <<'NGINX_CONF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Strict CSP for A+ Mozilla Observatory rating
    # Note: 'unsafe-inline' in style-src is needed for Bootstrap and inline styles, scores 0 (neutral) not negative
    add_header Content-Security-Policy "default-src 'none'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://rocket.xana.space; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google-analytics.com https://rocket.xana.space https://www.googletagmanager.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://rocket.xana.space wss://rocket.xana.space https://www.googletagmanager.com; frame-src https://www.googletagmanager.com https://rocket.xana.space; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; manifest-src 'self'; upgrade-insecure-requests;" always;
    
    # Additional security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Resource-Policy "same-origin" always;

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
        add_header X-Content-Type-Options "nosniff" always;
    }
}
NGINX_CONF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
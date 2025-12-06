# WordPress System Archivierung

**Archivierungsdatum:** 11. November 2025  
**Grund:** Migration von WordPress zu Hugo Static Site Generator  
**Vorherige Domain:** https://max-it.tech

---

## System-Übersicht

### Produktiv-System (archiviert, Container gestoppt)

#### WordPress Container
- **Container Name:** `wordpress`
- **Image:** `wordpress:latest` (basierend auf Apache)
- **Status vor Archivierung:** Up 44 hours
- **Datenverzeichnis:** `/home/docker/docker/wordpress`
- **Owner:** `www-data:www-data`
- **Port intern:** 80 (Apache)
- **Netzwerk:** `traefik` (Docker Network)

#### Datenbank Container
- **Container Name:** `wordpress-db`
- **Image:** `mariadb:latest`
- **Status vor Archivierung:** Up 2 weeks
- **Datenverzeichnis:** `/home/docker/docker/wordpress-db`
- **Owner:** `systemd-coredump:systemd-coredump`
- **Port intern:** 3306
- **Netzwerk:** `traefik` (Docker Network)

### Test-System (gelöscht am 11.11.2025)

Die folgenden Container und Verzeichnisse wurden entfernt:

#### Container
- `wordpress-test` - WordPress Testinstanz
- `wordpress-testdb` - MariaDB für Test
- `wordpress-testnginx` - Nginx Reverse Proxy für Test

#### Verzeichnisse (vor Löschung)
- `/home/docker/docker/wordpress-test`
- `/home/docker/docker/wordpress-testdb`
- `/home/docker/docker/wordpress-testnginx`

---

## Traefik Konfiguration

Das WordPress-System war über **Traefik 3** als Reverse Proxy erreichbar.

### Labels (aus docker-compose.yml)

```yaml
wordpress:
  labels:
    - "traefik.enable=true"
    
    # HTTPS Router
    - "traefik.http.routers.wordpress.rule=Host(`max-it.tech`)"
    - "traefik.http.routers.wordpress.entrypoints=websecure"
    - "traefik.http.routers.wordpress.tls=true"
    - "traefik.http.routers.wordpress.tls.certresolver=letsencrypt"
    
    # Service Definition
    - "traefik.http.services.wordpress.loadbalancer.server.port=80"
    
    # HTTP zu HTTPS Redirect
    - "traefik.http.routers.wordpress-http.rule=Host(`max-it.tech`)"
    - "traefik.http.routers.wordpress-http.entrypoints=web"
    - "traefik.http.routers.wordpress-http.middlewares=redirect-to-https"
```

### SSL/TLS
- **Certresolver:** `letsencrypt` (Let's Encrypt via Traefik)
- **Zertifikate:** Automatisch erneuert durch Traefik
- **Entrypoints:** 
  - `web` (Port 80) → Redirect zu HTTPS
  - `websecure` (Port 443) → Hauptzugriff

---

## Datenbank-Konfiguration

### Umgebungsvariablen (aus .env)

Die Datenbank wurde über folgende Environment-Variablen konfiguriert:

**WordPress Container:**
```env
WORDPRESS_DB_HOST=wordpress-db
WORDPRESS_DB_USER=${WORDPRESS_DB_USER}
WORDPRESS_DB_PASSWORD=${WORDPRESS_DB_PASSWORD}
WORDPRESS_DB_NAME=${WORDPRESS_DB_NAME}
```

**MariaDB Container:**
```env
MYSQL_DATABASE=${WORDPRESS_DB_NAME}
MYSQL_USER=${WORDPRESS_DB_USER}
MYSQL_PASSWORD=${WORDPRESS_DB_PASSWORD}
MYSQL_ROOT_PASSWORD=${WORDPRESS_DB_ROOT_PASSWORD}
```

### Wichtige Hinweise
- Die tatsächlichen Werte sind in der Datei `/home/docker/docker/.env` gespeichert
- **WICHTIG:** `.env` Datei vor Systemänderungen sichern!
- Root-Passwort der Datenbank ist separat gespeichert

---

## Verzeichnisstruktur

### WordPress Dateien (`/home/docker/docker/wordpress`)
```
wordpress/
├── wp-admin/          # WordPress Admin-Bereich
├── wp-content/        # Themes, Plugins, Uploads
│   ├── themes/        # Installierte Themes
│   ├── plugins/       # Installierte Plugins
│   └── uploads/       # Hochgeladene Medien
├── wp-includes/       # WordPress Core-Dateien
├── wp-config.php      # WordPress Konfiguration
└── index.php          # Haupteinstieg
```

### Datenbank-Dateien (`/home/docker/docker/wordpress-db`)
```
wordpress-db/
├── mysql/             # MySQL System-Datenbanken
├── wordpress/         # WordPress Datenbank (Artikel, Seiten, etc.)
├── ib_logfile*        # InnoDB Log-Dateien
└── ibdata1            # InnoDB Daten
```

---

## Backup-Empfehlung

### Vor dem Löschen der Verzeichnisse:

```bash
cd /home/docker/docker

# Komplettes Backup
tar -czf wordpress-complete-backup-$(date +%Y%m%d-%H%M).tar.gz \
  wordpress wordpress-db .env

# Nur Datenbank exportieren
docker exec wordpress-db \
  mysqldump -u${WORDPRESS_DB_USER} -p${WORDPRESS_DB_PASSWORD} ${WORDPRESS_DB_NAME} \
  > wordpress-db-dump-$(date +%Y%m%d-%H%M).sql

# Backup verschieben
mkdir -p /backup/wordpress-archive
mv wordpress-*.tar.gz wordpress-*.sql /backup/wordpress-archive/
```

---

## Wiederherstellung

### 1. Container-Konfiguration wiederherstellen

Füge in `/home/docker/docker/docker-compose.yml` folgende Services wieder ein:

```yaml
  wordpress:
    image: wordpress:latest
    container_name: wordpress
    restart: unless-stopped
    depends_on:
      - wordpress-db
    environment:
      WORDPRESS_DB_HOST: wordpress-db
      WORDPRESS_DB_USER: ${WORDPRESS_DB_USER}
      WORDPRESS_DB_PASSWORD: ${WORDPRESS_DB_PASSWORD}
      WORDPRESS_DB_NAME: ${WORDPRESS_DB_NAME}
    volumes:
      - ./wordpress:/var/www/html
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.wordpress.rule=Host(`max-it.tech`)"
      - "traefik.http.routers.wordpress.entrypoints=websecure"
      - "traefik.http.routers.wordpress.tls=true"
      - "traefik.http.routers.wordpress.tls.certresolver=letsencrypt"
      - "traefik.http.services.wordpress.loadbalancer.server.port=80"
      # HTTP Redirect
      - "traefik.http.routers.wordpress-http.rule=Host(`max-it.tech`)"
      - "traefik.http.routers.wordpress-http.entrypoints=web"
      - "traefik.http.routers.wordpress-http.middlewares=redirect-to-https"

  wordpress-db:
    image: mariadb:latest
    container_name: wordpress-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${WORDPRESS_DB_NAME}
      MYSQL_USER: ${WORDPRESS_DB_USER}
      MYSQL_PASSWORD: ${WORDPRESS_DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${WORDPRESS_DB_ROOT_PASSWORD}
    volumes:
      - ./wordpress-db:/var/lib/mysql
    networks:
      - traefik
```

### 2. Netzwerk erstellen (falls nicht vorhanden)

```bash
docker network create traefik
```

### 3. Container starten

```bash
cd /home/docker/docker
docker-compose up -d wordpress wordpress-db
```

### 4. Überprüfung

```bash
# Container Status
docker ps | grep wordpress

# Logs überprüfen
docker logs wordpress
docker logs wordpress-db

# WordPress erreichbar testen
curl -I https://max-it.tech
```

### 5. Domain auf WordPress zurück umstellen

**WICHTIG:** Aktuell läuft Hugo unter `max-it.tech`. Um WordPress wiederherzustellen:

1. Hugo Container stoppen: `docker-compose stop hugo-onepager`
2. Hugo aus docker-compose.yml entfernen oder umbenennen
3. WordPress wieder einfügen (siehe oben)
4. `docker-compose up -d wordpress wordpress-db`
5. Traefik routed automatisch neu

---

## Installierte Plugins & Themes

### Wichtige Plugins
- Siehe `/home/docker/docker/wordpress/wp-content/plugins/`
- Liste kann mit `ls -la wordpress/wp-content/plugins/` abgerufen werden

### Aktives Theme
- Siehe `/home/docker/docker/wordpress/wp-content/themes/`
- Aktives Theme steht in der Datenbank (wp_options Tabelle)

---

## Sicherheitshinweise

1. **Passwörter:** Alle DB-Passwörter sind in `.env` gespeichert
2. **Secrets:** WordPress Security Keys in `wp-config.php`
3. **Backups:** Regelmäßige Backups vor Systemänderungen erstellen
4. **Updates:** WordPress, Plugins und Themes sollten aktuell gehalten werden

---

## Migration zu Hugo

**Warum Hugo?**
- Statische Website = schneller, sicherer, weniger Wartung
- Keine Datenbank = keine SQL-Injection-Risiken
- Keine PHP-Sicherheitslücken
- Geringere Server-Last
- Einfacheres Deployment via Git

**Migrationsweg:**
- WordPress-Inhalte manuell oder via Export zu Markdown konvertiert
- Design neu in Hugo-Theme implementiert
- Statische HTML-Dateien via Nginx/Hugo selbst ausgeliefert

---

## Kontakte & Dokumentation

- **Docker Host:** 192.168.178.200:2022 (SSH via ansible user)
- **Hauptverzeichnis:** `/home/docker/docker`
- **Traefik Dashboard:** Siehe Traefik-Konfiguration
- **Diese Dokumentation:** `/home/docker/docker/wordpress/README-ARCHIVE.md`

---

**Erstellt:** 11. November 2025  
**Letzte Änderung:** 11. November 2025  
**Autor:** Migration von WordPress zu Hugo

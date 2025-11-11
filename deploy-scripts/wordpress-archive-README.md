# WordPress Archivierung

**Datum der Archivierung:** 11. November 2025  
**Grund:** Migration zu Hugo Static Site Generator

## Archivierte Container und Verzeichnisse

### WordPress Produktiv-System
- **Container:** `wordpress`, `wordpress-db`
- **Verzeichnisse:** 
  - `/home/docker/docker/wordpress` (WordPress Dateien)
  - `/home/docker/docker/wordpress-db` (MySQL Datenbank)
- **Domain:** max-it.tech (vorher)

### WordPress Test-System (gelöscht)
- **Container:** `wordpress-test`, `wordpress-testdb`, `wordpress-testnginx`
- **Verzeichnisse:** 
  - `/home/docker/docker/wordpress-test`
  - `/home/docker/docker/wordpress-testdb`
  - `/home/docker/docker/wordpress-testnginx`
- **Status:** Am 11.11.2025 gestoppt und aus docker-compose.yml entfernt

## Wichtige Informationen

### Images
- WordPress: `wordpress:latest`
- MariaDB/MySQL: Siehe docker-compose.yml Backup

### Volumes und Daten
- WordPress Dateien bleiben erhalten in `/home/docker/docker/wordpress`
- Datenbank-Dateien bleiben erhalten in `/home/docker/docker/wordpress-db`
- **WICHTIG:** Vor Löschung Backup erstellen!

### Traefik Konfiguration
- Die Traefik-Labels aus der docker-compose.yml wurden entfernt
- Domain max-it.tech ist jetzt für Hugo konfiguriert

## Reaktivierung (falls nötig)

### 1. Container-Konfiguration wieder hinzufügen

Füge folgende Abschnitte zurück in die `docker-compose.yml`:

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

### 2. Container starten

```bash
cd /home/docker/docker
docker-compose up -d wordpress wordpress-db
```

### 3. Überprüfen

```bash
docker ps | grep wordpress
docker logs wordpress
docker logs wordpress-db
```

## Backup vor Löschung

Falls du die Verzeichnisse löschen möchtest, erstelle vorher ein Backup:

```bash
cd /home/docker/docker
tar -czf wordpress-backup-$(date +%Y%m%d).tar.gz wordpress wordpress-db
# Backup an sicheren Ort verschieben
mv wordpress-backup-*.tar.gz /pfad/zum/backup/
```

## Kontakt

Bei Fragen zur Wiederherstellung siehe die Backup-Dokumentation oder kontaktiere den Admin.

# CLAUDE.md

Projektspezifische Informationen für Claude Code.

## Projekttyp

Hugo Static Site mit Multi-Stage Docker Build (Hugo → Nginx).

## Verzeichnisstruktur

```
/home/max/Git/hugo-onepager/     # Lokales Arbeitsverzeichnis
├── content/                      # Markdown-Inhalte (DE + EN)
├── layouts/partials/             # Custom Layout Overrides
├── assets/css/                   # Custom CSS
├── assets/js/                    # Custom JavaScript
├── static/                       # Statische Dateien (Bilder, Fonts)
├── data/homepage.yml             # Homepage-Daten
├── hugo.toml                     # Hugo-Konfiguration
├── docker-compose.yml            # Docker Compose für Deployment
└── Dockerfile                    # Multi-Stage Build
```

## Befehle

### Lokale Entwicklung

```bash
npm install          # Dependencies installieren
hugo server          # Dev-Server starten (localhost:1313)
hugo                 # Production Build nach ./public
```

### Deployment auf Server

```bash
# Einzeiler-Deployment (empfohlen - nutzt --no-cache für sauberen Build)
ssh docker "cd /home/docker/docker/hugo && sudo git pull && sudo docker compose build --no-cache && sudo docker compose up -d"

# Schnelles Deployment (nutzt Cache, kann bei geänderten Dateien mit gleichem Namen Probleme machen)
ssh docker "cd /home/docker/docker/hugo && sudo git pull && sudo docker compose up -d --build"

# Oder Schritt für Schritt
ssh docker
cd /home/docker/docker/hugo
sudo git pull
sudo docker compose build --no-cache  # Kein Cache = alle Dateien werden neu kopiert
sudo docker compose up -d
```

**Hinweis:** `--no-cache` ist wichtig, wenn Dateien mit gleichem Namen ersetzt wurden (z.B. Bilder).
Docker prüft nur den Timestamp, nicht den Inhalt. Ohne `--no-cache` kann der alte Build-Cache verwendet werden.

## Server-Zugang

- **SSH-Alias**: `ssh docker`
- **Host**: 192.168.178.200
- **Port**: 2022
- **User**: ansible
- **Key**: `~/.ssh/docker`

## Server-Pfade

- **Hugo-Repo**: `/home/docker/docker/hugo`
- **Docker-Compose**: `/home/docker/docker/docker-compose.yml` (Haupt-Compose)
- **Projekt-Compose**: `/home/docker/docker/hugo/docker-compose.yml`

## Technologie-Stack

- **SSG**: Hugo Extended mit Hugo Modules
- **Theme**: Adritian (als Hugo Module)
- **CSS**: Bootstrap SCSS + Custom CSS
- **Webserver**: Nginx Alpine
- **Reverse Proxy**: Traefik (t2_proxy Netzwerk)
- **Domain**: max-it.tech

## Sprachen

- Deutsch (Standard): `content/*.md`
- Englisch: `content/*.en.md`

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `hugo.toml` | Hauptkonfiguration |
| `data/homepage.yml` | Homepage-Sektionen |
| `assets/css/custom.css` | Custom Styles |
| `layouts/partials/*.html` | Layout Overrides |
| `i18n/*.yaml` | Übersetzungen |

## Rocket.Chat Integration

- **Widget**: Integriert im Theme über `assets/js/rocketchat-init.js`
- **Server**: https://rocket.xana.space
- **Agent Auto-Online**: Systemd Service auf dem Docker-Server (`rocketchat-agent-keeper.service`)
  - Setzt Agent-Status alle 5 Minuten auf "available"
  - Service verwalten: `ssh docker "sudo systemctl status rocketchat-agent-keeper"`
  - Widget bleibt dadurch immer im Online-Modus

#!/bin/bash
# WordPress Test-System aufräumen und Hugo vorbereiten

set -e  # Bei Fehler abbrechen

echo "🧹 WordPress Test-System wird entfernt..."

# 1. WordPress-Test Container stoppen und entfernen
echo "Stoppe WordPress-Test Container..."
docker stop wordpress-test wordpress-testdb wordpress-testnginx 2>/dev/null || echo "Container bereits gestoppt"
docker rm wordpress-test wordpress-testdb wordpress-testnginx 2>/dev/null || echo "Container bereits entfernt"

echo "✅ WordPress-Test Container entfernt"

# 2. Verzeichnisse archivieren (optional - auskommentiert)
# echo "Archiviere WordPress-Test Verzeichnisse..."
# tar -czf wordpress-test-backup-$(date +%Y%m%d).tar.gz wordpress-test wordpress-testdb wordpress-testnginx
# echo "✅ Backup erstellt: wordpress-test-backup-$(date +%Y%m%d).tar.gz"

# 3. WordPress-Test Verzeichnisse löschen (optional - auskommentiert)
# echo "⚠️  Lösche WordPress-Test Verzeichnisse..."
# rm -rf wordpress-test wordpress-testdb wordpress-testnginx
# echo "✅ Verzeichnisse gelöscht"

echo ""
echo "📋 Nächste Schritte manuell:"
echo "1. Entferne wordpress-test, wordpress-testdb, wordpress-testnginx aus docker-compose.yml"
echo "2. Erstelle hugo Verzeichnis: mkdir hugo"
echo "3. Klone Repository: cd hugo && git clone https://github.com/klangorg/hugo-onepager.git ."
echo "4. Checkout Branch: git checkout theme-update"
echo "5. Füge Hugo-Service in docker-compose.yml hinzu"
echo ""

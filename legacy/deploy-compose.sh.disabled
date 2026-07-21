#!/bin/bash
# Deploy-Script für hugo-onepager

set -e  # Bei Fehler abbrechen

echo "🚀 Starting deployment..."

# Git aktualisieren
echo "📦 Pulling latest changes..."
git pull origin theme-update

# Docker Image bauen und Container neu starten
echo "🐳 Building and starting Docker container..."
docker-compose up -d --build

# Alte Images aufräumen (optional)
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
echo "🌐 Site is running at your configured domain"

# Logs anzeigen
echo ""
echo "📋 Latest logs:"
docker-compose logs --tail=50

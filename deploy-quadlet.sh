#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/docker/docker/hugo}"
QUADLET="${QUADLET:-/etc/containers/systemd/hugo-onepager.container}"
TAG="localhost/hugo-onepager:$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="/root/hugo-quadlet-deploy-$(date +%Y%m%d_%H%M%S)"

cd "$REPO_DIR"
sudo install -d -m 700 "$BACKUP_DIR"
sudo cp -a "$QUADLET" "$BACKUP_DIR/hugo-onepager.container"

sudo podman build --pull=never --no-cache -t "$TAG" .
IMAGE_ID=$(sudo podman image inspect "$TAG" --format '{{.Id}}')

sudo python3 - "$QUADLET" "$IMAGE_ID" <<'PY'
from pathlib import Path
import sys
path=Path(sys.argv[1])
image=sys.argv[2]
text=path.read_text()
lines=text.splitlines()
replaced=False
for i,line in enumerate(lines):
    if line.startswith('Image='):
        lines[i]=f'Image={image}'
        replaced=True
        break
if not replaced:
    raise SystemExit('Image= missing in Quadlet')
path.write_text('\n'.join(lines)+'\n')
PY

sudo systemctl daemon-reload
sudo systemctl restart hugo-onepager.service
sudo systemctl is-active --quiet hugo-onepager.service
sudo podman inspect hugo-onepager --format '{{.Image}}|{{.State.Status}}'

echo "Rollback Quadlet: $BACKUP_DIR/hugo-onepager.container"
echo "Deployed image: $IMAGE_ID"

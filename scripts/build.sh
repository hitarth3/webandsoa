#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker build -f api-gateway/Dockerfile -t api-gateway:lab8 .
for s in user-service product-service order-service; do docker build -t "$s:lab8" "$s"; done

#!/usr/bin/env bash
set -euo pipefail
base=${1:-http://localhost:8080}
for i in $(seq 1 120); do
 for route in users products orders; do curl --fail --silent --show-error "$base/$route" >/dev/null; done
 code=$(curl --silent --output /dev/null --write-out '%{http_code}' "$base/users/not-a-number")
 test "$code" = 400
 sleep 1
done

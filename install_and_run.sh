#!/bin/sh

set -e

npm install --unsafe-perm
npm run build
exec npm run start:directly


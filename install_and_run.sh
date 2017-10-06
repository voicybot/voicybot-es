#!/bin/sh

set -e

npm --unsafe-perm install
npm --unsafe-perm run build
exec npm --unsafe-perm run start:directly

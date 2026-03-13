#!/bin/bash
set -e

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link || true
php artisan migrate --force

if [ "$1" != "" ]; then
    exec "$@"
else
    exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
fi
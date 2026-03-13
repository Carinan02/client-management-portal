#!/bin/bash
set -e

# Cache config at runtime so correct env vars are used
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Storage symlink
php artisan storage:link || true

# Run migrations
php artisan migrate --force

# Start server
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
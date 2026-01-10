#!/bin/sh
set -o errexit

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn conf.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:${PORT}

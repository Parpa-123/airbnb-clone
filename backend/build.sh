#!/bin/sh
set -o errexit

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --no-input

if [ -n "$CREATE_SUPERUSER" ]; then
    echo "Creating superuser..."
    python manage.py createsuperuser --no-input
fi

echo "Starting Uvicorn..."
exec uvicorn conf.asgi:application \
  --host 0.0.0.0 \
  --port ${PORT}
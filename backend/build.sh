#!/bin/sh
set -o errexit

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --no-input



if [[ $CREATE_SUPERUSER ]];
then
    echo "Creating superuser..."
    python manage.py createsuperuser --no-input
fi

echo "Starting Gunicorn..."
exec gunicorn conf.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:${PORT}

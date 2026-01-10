#!/bin/sh
set -o errexit

python manage.py collectstatic --noinput
python manage.py migrate --noinput

exec gunicorn conf.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000

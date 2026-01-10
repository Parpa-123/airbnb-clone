#!/bin/sh
set -o errexit

# Optional but recommended
python manage.py migrate --noinput

exec gunicorn app.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000

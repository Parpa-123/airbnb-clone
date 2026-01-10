FROM python:3.12-alpine

ENV PYTHONUNBUFFERED=1 \
    PATH="/py/bin:$PATH"

WORKDIR /app

RUN apk add --no-cache \
    build-base \
    libffi-dev \
    openssl-dev \
    jpeg-dev \
    zlib-dev \
    tzdata

COPY requirements.txt /tmp/requirements.txt

RUN python -m venv /py && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm -rf /tmp && \
    adduser --disabled-password --no-create-home django-user

COPY . /app

ENV DJANGO_SETTINGS_MODULE=conf.deployment_settings


COPY build.sh /app/build.sh
RUN chmod +x /app/build.sh

# Create static and media directories with proper permissions
RUN mkdir -p /app/static /app/media && \
    chown -R django-user:django-user /app/static /app/media

EXPOSE 8000

USER django-user

ENTRYPOINT ["./build.sh"]

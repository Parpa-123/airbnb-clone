# Stage 1: Builder
FROM python:3.12-alpine AS builder

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apk add --no-cache \
    build-base \
    libffi-dev \
    openssl-dev \
    jpeg-dev \
    zlib-dev \
    tzdata

COPY requirements.txt .

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install --no-cache-dir -r requirements.txt

# Stage 2: Runner
FROM python:3.12-alpine AS runner

ENV PYTHONUNBUFFERED=1 \
    PATH="/py/bin:$PATH" \
    DJANGO_SETTINGS_MODULE=conf.deployment_settings

WORKDIR /app

RUN apk add --no-cache \
    jpeg \
    zlib \
    tzdata \
    libffi \
    openssl && \
    adduser --disabled-password --no-create-home django-user

COPY --from=builder /py /py
COPY . /app

RUN chmod +x /app/build.sh && \
    mkdir -p /app/static && \
    chown -R django-user:django-user /app/static

EXPOSE 8000

USER django-user

ENTRYPOINT ["./build.sh"]

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

# Copy all application files first
COPY . /app

# Install dependencies from copied requirements.txt
RUN python -m venv /py && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt && \
    adduser --disabled-password --no-create-home django-user

ENV DJANGO_SETTINGS_MODULE=conf.deployment_settings

# Make build script executable (already copied via COPY . /app)
RUN chmod +x /app/build.sh

# Create static directory with proper permissions
RUN mkdir -p /app/static && \
    chown -R django-user:django-user /app/static

EXPOSE 8000

USER django-user

ENTRYPOINT ["./build.sh"]

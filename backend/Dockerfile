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

COPY ./app /app

RUN python manage.py collectstatic --noinput

COPY build.sh /build.sh
RUN chmod +x /build.sh

EXPOSE 8000

USER django-user

ENTRYPOINT ["./build.sh"]

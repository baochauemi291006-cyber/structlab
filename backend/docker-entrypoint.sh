#!/bin/sh
set -eu

if [ -n "${DB_HOST:-}" ]; then
  : "${DB_NAME:?DB_NAME is required when DB_HOST is set}"
  export DB_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT:-5432}/${DB_NAME}"
fi

exec java -jar /app/app.jar

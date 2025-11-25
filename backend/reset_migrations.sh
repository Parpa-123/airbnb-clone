#!/bin/bash

echo "🚨 WARNING: This will delete ALL migrations in 'users' and 'listings' apps and delete your local database!"
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "❌ Cancelled."
  exit 1
fi

echo "🧹 Deleting migration files from users and listings apps..."

# Delete all migration files except __init__.py
find ./users/migrations -type f ! -name "__init__.py" -delete
find ./listings/migrations -type f ! -name "__init__.py" -delete

echo "🗑️ Removing SQLite database (db.sqlite3 if exists)..."
rm -f db.sqlite3

echo "📦 Making new migrations..."
python manage.py makemigrations

echo "🚀 Applying migrations..."
python manage.py migrate

echo "🎉 Done! Fresh migrations created for 'users' and 'listings'."

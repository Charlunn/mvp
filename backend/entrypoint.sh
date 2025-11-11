#!/bin/sh
set -e

echo "[backend] Running database migrations..."
python manage.py migrate --noinput

echo "[backend] Collecting static files..."
python manage.py collectstatic --noinput

echo "[backend] Seeding Neo4j data (safe to rerun)..."
retries=10
until python -m scripts.neo4j_seed; do
  retries=$((retries-1))
  if [ "$retries" -le 0 ]; then
    echo "[backend] Neo4j seed failed after multiple attempts. Continuing without seed."
    break
  fi
  echo "[backend] Neo4j not ready yet. Retrying in 5s..."
  sleep 5
done

echo "[backend] Starting Gunicorn..."
exec gunicorn mvp_backend.wsgi:application --bind 0.0.0.0:8000

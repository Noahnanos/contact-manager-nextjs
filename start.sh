#!/bin/sh

echo "🔄 Waiting for database to be ready..."

# Wait for database to be ready
until npx prisma db push --accept-data-loss; do
  echo "⏳ Database not ready, waiting..."
  sleep 2
done

echo "✅ Database ready, starting application..."
exec node server.js
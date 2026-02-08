#!/bin/bash
set -e

echo "🔧 Préparation de la base de données..."

# Drop, créer, migrer et seed la DB
bundle exec rake db:drop || true
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed

echo "✅ Base de données prête !"

# Exécuter la commande passée (CMD du Dockerfile)
exec "$@"

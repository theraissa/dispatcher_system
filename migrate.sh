#!/bin/bash

COMPOSE="docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml"

case "$1" in
  init)
    echo "🏗️ Inicializando migrações..."
    $COMPOSE exec backend flask db init
    ;;

  create)
    echo "🔍 Criando nova migração..."

    if [ -z "$2" ]; then
      echo "❌ Informe a mensagem da migração."
      echo "Exemplo:"
      echo "./migrate.sh create \"create users table\""
      exit 1
    fi

    $COMPOSE exec backend flask db migrate -m "$2"
    ;;

  upgrade)
    echo "🆙 Aplicando migrações..."
    $COMPOSE exec backend flask db upgrade
    ;;

  downgrade)
    echo "⏪ Revertendo última migração..."
    $COMPOSE exec backend flask db downgrade
    ;;

  history)
    echo "📜 Histórico de migrações..."
    $COMPOSE exec backend flask db history
    ;;

  current)
    echo "📍 Migração atual..."
    $COMPOSE exec backend flask db current
    ;;

  *)
    echo "Uso:"
    echo "./migrate.sh {init|create|upgrade|downgrade|history|current}"
    exit 1
    ;;
esac

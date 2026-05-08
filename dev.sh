#!/bin/bash

COMPOSE="docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml"

# Função para atualizar o ambiente virtual local
update_venv() {
    echo "🐍 Verificando ambiente virtual (local)..."

    if [ ! -d ".venv" ]; then
        echo "✨ Criando novo .venv..."
        python3 -m venv .venv
    fi

    source .venv/bin/activate

    echo "📦 Instalando dependências do requirements.txt..."
    pip install --upgrade pip
    pip install -r backend/requirements.txt

    deactivate

    echo "✅ Ambiente virtual local atualizado!"
}

case "$1" in
  start)
    echo "🚀 Iniciando ambiente de desenvolvimento..."
    $COMPOSE up --build
    ;;

  stop)
    echo "🛑 Parando containers..."
    $COMPOSE down
    ;;

  restart)
    echo "🔄 Reiniciando containers..."
    $COMPOSE down
    $COMPOSE up --build
    ;;

  build)
    echo "🛠️ Reconstruindo imagens (sem cache)..."
    $COMPOSE build --no-cache
    ;;

  venv)
    update_venv
    ;;

  *)
    echo "Uso: ./dev.sh {start|stop|restart|build|venv}"
    exit 1
    ;;
esac

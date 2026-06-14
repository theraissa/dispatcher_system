#!/bin/bash

COMPOSE="docker compose --env-file .env.dev -f docker-compose.yml -f docker-compose.dev.yml"
TEST_COMPOSE="docker compose -f docker-compose.test.yml"

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

  unit)
    if [ -n "$2" ]; then
      echo "🧪 Executando teste unitário: $2"
      $TEST_COMPOSE run --rm unit pytest -v "$2"
    else
      echo "🧪 Executando todos os testes unitários..."
      $TEST_COMPOSE run --rm unit pytest tests/unit -v
    fi
    ;;

  integration)
    if [ -n "$2" ]; then
      echo "🔗 Executando teste de integração: $2"
      $TEST_COMPOSE run --rm integration pytest -v "$2"
    else
      echo "🔗 Executando todos os testes de integração..."
      $TEST_COMPOSE run --rm integration pytest tests/integration -v
    fi
    ;;

  coverage)
    echo "📊 Executando cobertura de testes (unitários + integração)..."
    
    # Executa testes unitários com cobertura
    $TEST_COMPOSE run --rm unit \
        pytest tests/unit --cov=services--cov=admin \
        --cov-report=term-missing --cov-append
    
    # Executa testes de integração com cobertura (acumulando)
    $TEST_COMPOSE run --rm integration \
        pytest tests/integration --cov=services --cov=routes --cov=admin \
        --cov-report=term-missing --cov-append
    
    echo "✅ Relatório de cobertura consolidado."
    ;;

  venv)
    update_venv
    ;;

  *)
    echo "Uso: ./dev.sh {start|stop|restart|build|unit|integration|coverage|venv}"
    exit 1
    ;;
esac

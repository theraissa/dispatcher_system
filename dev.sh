#!/bin/bash

# Função para atualizar o ambiente virtual local
update_venv() {
    echo "🐍 Verificando ambiente virtual (local)..."
    
    # Cria o venv se não existir
    if [ ! -d ".venv" ]; then
        echo "✨ Criando novo .venv..."
        python3 -m venv .venv
    fi

    # Ativa e instala/atualiza dependências
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
    docker compose -f docker-compose.dev.yml up
    ;;
  stop)
    echo "🛑 Parando containers..."
    docker compose -f docker-compose.dev.yml down
    ;;
  build)
    echo "🛠️ Reconstruindo imagens (sem cache)..."
    docker compose -f docker-compose.dev.yml build --no-cache
    ;;
  logs)
    echo "📋 Mostrando logs em tempo real..."
    docker compose -f docker-compose.dev.yml logs -f
    ;;
  venv)
    update_venv
    ;;
  migrate-init)
    echo "🏗️ Inicializando pasta de migrações..."
    docker compose -f docker-compose.dev.yml exec backend flask db init
    ;;
  migrate)
    echo "🔍 Gerando nova migração..."
    read -p "Digite a descrição da mudança: " MESSAGE
    docker compose -f docker-compose.dev.yml exec backend flask db migrate -m "$MESSAGE"
    ;;
  upgrade)
    echo "🆙 Aplicando mudanças no banco de dados..."
    docker compose -f docker-compose.dev.yml exec backend flask db upgrade
    ;;
  *)
    echo "Uso: ./dev.sh {start|stop|build|logs}"
    exit 1
    ;;
esac

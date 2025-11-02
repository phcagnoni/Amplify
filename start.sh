#!/bin/bash

# Script para iniciar o projeto Amplify completo (Backend + Frontend)

echo "🎵 ====================================="
echo "   Amplify - Sistema de Recomendação"
echo "   Backend + Frontend Integration"
echo "======================================"
echo ""

# Diretório raiz do projeto
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verifica Python
echo "🔍 Verificando Python..."
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python encontrado: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python 3 não encontrado. Por favor, instale Python 3.8+"
    exit 1
fi

# Verifica Node.js
echo "🔍 Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js encontrado: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js não encontrado. Por favor, instale Node.js 16+"
    exit 1
fi

echo ""
echo "📦 Instalando dependências..."
echo ""

# Instala dependências do Backend
echo "🐍 Backend (Python)..."
cd "$PROJECT_ROOT/backend"
if [ -f "requirements.txt" ]; then
    pip3 install -q -r requirements.txt
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Dependências do backend instaladas"
    else
        echo -e "${YELLOW}⚠${NC} Erro ao instalar dependências do backend"
    fi
else
    echo -e "${YELLOW}⚠${NC} requirements.txt não encontrado"
fi

# Instala dependências do Frontend
echo "⚛️  Frontend (Node.js)..."
cd "$PROJECT_ROOT/frontend"
if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
        npm install
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓${NC} Dependências do frontend instaladas"
        else
            echo -e "${YELLOW}⚠${NC} Erro ao instalar dependências do frontend"
        fi
    else
        echo -e "${GREEN}✓${NC} Dependências do frontend já instaladas"
    fi
else
    echo -e "${YELLOW}⚠${NC} package.json não encontrado"
fi

echo ""
echo "🚀 Iniciando servidores..."
echo ""

# Cria arquivo de log
LOGS_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOGS_DIR"
BACKEND_LOG="$LOGS_DIR/backend.log"
FRONTEND_LOG="$LOGS_DIR/frontend.log"

# Verifica se a porta 8000 já está em uso
echo "🔍 Verificando porta 8000..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠${NC} Porta 8000 já está em uso!"
    echo "   Para parar o serviço existente, execute: ./stop.sh"
    echo "   Ou mate o processo manualmente: lsof -ti:8000 | xargs kill -9"
    exit 1
fi

# Inicia o Backend em background
echo "🔧 Iniciando Backend API (porta 8000)..."
cd "$PROJECT_ROOT/backend"
python3 api.py > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_ROOT/.backend.pid"

# Aguarda o backend iniciar
sleep 3

# Verifica se o backend está rodando
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Backend iniciado (PID: $BACKEND_PID)"
    echo "   📍 API: http://localhost:8000"
    echo "   📖 Docs: http://localhost:8000/docs"
else
    echo -e "${RED}✗${NC} Falha ao iniciar backend. Verifique $BACKEND_LOG"
    exit 1
fi

echo ""

# Verifica se a porta 3000 já está em uso
echo "🔍 Verificando porta 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠${NC} Porta 3000 já está em uso!"
    echo "   Para parar o serviço existente, execute: ./stop.sh"
    echo "   Ou mate o processo manualmente: lsof -ti:3000 | xargs kill -9"
    # Mata o backend que acabamos de iniciar
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Inicia o Frontend em background
echo "⚛️  Iniciando Frontend (porta 3000)..."
cd "$PROJECT_ROOT/frontend"
npm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$PROJECT_ROOT/.frontend.pid"

# Aguarda o frontend iniciar
sleep 5

# Verifica se o frontend está rodando
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓${NC} Frontend iniciado (PID: $FRONTEND_PID)"
    echo "   📍 App: http://localhost:3000"
else
    echo -e "${RED}✗${NC} Falha ao iniciar frontend. Verifique $FRONTEND_LOG"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "✨ ====================================="
echo "   Amplify está rodando!"
echo "======================================"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:8000"
echo "📖 API Docs:  http://localhost:8000/docs"
echo ""
echo "📋 Logs:"
echo "   Backend:  $BACKEND_LOG"
echo "   Frontend: $FRONTEND_LOG"
echo ""
echo "Para parar os servidores, execute:"
echo "   ./stop.sh"
echo ""
echo "Pressione Ctrl+C para ver os logs em tempo real..."
echo ""

# Segue os logs
tail -f "$BACKEND_LOG" "$FRONTEND_LOG"

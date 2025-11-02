#!/bin/bash

# Script para parar os servidores do Amplify

echo "🛑 Parando Amplify..."
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Para o Backend
if [ -f "$PROJECT_ROOT/.backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/.backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓${NC} Backend parado (PID: $BACKEND_PID)"
    else
        echo "Backend já estava parado"
    fi
    rm "$PROJECT_ROOT/.backend.pid"
else
    echo "Backend não estava rodando"
fi

# Para o Frontend
if [ -f "$PROJECT_ROOT/.frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_ROOT/.frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓${NC} Frontend parado (PID: $FRONTEND_PID)"
    else
        echo "Frontend já estava parado"
    fi
    rm "$PROJECT_ROOT/.frontend.pid"
else
    echo "Frontend não estava rodando"
fi

# Mata qualquer processo remanescente nas portas
echo ""
echo "🔍 Verificando portas 8000 e 3000..."

# Porta 8000 (Backend)
BACKEND_PORT_PID=$(lsof -ti:8000 2>/dev/null)
if [ ! -z "$BACKEND_PORT_PID" ]; then
    kill -9 $BACKEND_PORT_PID 2>/dev/null
    echo -e "${GREEN}✓${NC} Processo na porta 8000 finalizado"
fi

# Porta 3000 (Frontend)
FRONTEND_PORT_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$FRONTEND_PORT_PID" ]; then
    kill -9 $FRONTEND_PORT_PID 2>/dev/null
    echo -e "${GREEN}✓${NC} Processo na porta 3000 finalizado"
fi

echo ""
echo "✅ Amplify parado com sucesso!"

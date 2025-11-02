#!/bin/bash

# Quick Start - Amplify
# Inicialização rápida para desenvolvimento

clear

echo "🎵 =========================================="
echo "   AMPLIFY - Quick Start"
echo "   Sistema de Recomendação Musical"
echo "=========================================="
echo ""

# Detecta se é primeira execução
FIRST_RUN=false
if [ ! -d "backend/__pycache__" ] && [ ! -d "frontend/node_modules" ]; then
    FIRST_RUN=true
fi

if [ "$FIRST_RUN" = true ]; then
    echo "📦 Primeira execução detectada!"
    echo "   Instalando dependências..."
    echo ""
    
    # Instala backend
    echo "🐍 Instalando dependências do backend..."
    cd backend
    pip3 install -q -r requirements.txt
    cd ..
    
    # Instala frontend
    echo "⚛️  Instalando dependências do frontend..."
    cd frontend
    npm install --silent
    cd ..
    
    echo ""
    echo "✅ Dependências instaladas!"
    echo ""
fi

echo "🚀 Iniciando Amplify..."
echo ""
echo "📍 URLs disponíveis:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "⌨️  Pressione Ctrl+C para parar"
echo ""

# Cria diretório de logs
mkdir -p logs

# Inicia backend em background
cd backend
python3 api.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguarda backend iniciar
sleep 2

# Inicia frontend
cd frontend
npm run dev 2>&1 | tee ../logs/frontend.log

#!/bin/bash

# Script para iniciar o backend da API Amplify

echo "🚀 Iniciando Amplify Backend API..."
echo ""
echo "📍 API: http://localhost:8000"
echo "📖 Docs: http://localhost:8000/docs"
echo ""

cd "$(dirname "$0")"

# Verifica se as dependências estão instaladas
if ! python -c "import fastapi" 2>/dev/null; then
    echo "⚠️  Instalando dependências..."
    pip install -r requirements.txt
fi

# Inicia a API
python api.py

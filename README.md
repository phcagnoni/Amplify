# 🎵 Amplify - Sistema de Recomendação Musical

> Sistema inteligente de recomendação musical baseado em grafos com integração Spotify

[![Status](https://img.shields.io/badge/Status-Funcional-success)]()
[![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI-blue)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-cyan)]()

---

## 🚀 Início Rápido

```bash
# Iniciar sistema completo
./quick-start.sh

# Acessar aplicação
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Documentação: http://localhost:8000/docs
```

---

## 📋 Índice

1. [O que é o Amplify?](#-o-que-é-o-amplify)
2. [Funcionalidades](#-funcionalidades)
3. [Como Usar](#-como-usar)
4. [Integração Spotify](#-integração-spotify)
5. [Estrutura de Grafos](#-estrutura-de-grafos)
6. [API REST](#-api-rest)
7. [Desenvolvimento](#-desenvolvimento)
8. [Equipe](#-equipe)

---

## 🎯 O que é o Amplify?

Sistema de recomendação musical que usa **teoria dos grafos** para conectar músicas, artistas e gêneros. O sistema importa dados reais do Spotify e gera recomendações inteligentes baseadas em similaridade.

### Como Funciona?

```
Vértices (Nós):              Arestas (Conexões):
├─ 🎵 Músicas                ├─ Música ←→ Artista
├─ 👤 Artistas               ├─ Música ←→ Gênero
└─ 🎸 Gêneros                └─ Artista ←→ Gênero
```

**Algoritmo de Recomendação:** Coeficiente de Jaccard
```
Similaridade = |Conexões Comuns| / |Total Conexões Únicas|
```

---

## ✨ Funcionalidades

### 1. 🎯 Descoberta Musical
- Sistema de recomendação baseado em grafos
- Visualização de conexões entre músicas
- Algoritmo de similaridade inteligente

### 2. 🌍 Exploração Cultural
- Músicas de diferentes regiões do mundo
- Instrumentos tradicionais
- Gêneros regionais

### 3. 🎵 Integração Spotify (NOVO)
- **Buscar artistas** no Spotify em tempo real
- **Importar músicas** para o grafo com um clique
- **Visualizar estatísticas** do grafo dinamicamente
- **Ver músicas importadas** com detalhes completos

### 4. 🔌 API Demo Interativa
- Teste endpoints da API diretamente no navegador
- Visualize JSON de respostas
- Exemplos práticos de uso

---

## 📖 Como Usar

### Passo 1: Iniciar Sistema
```bash
./quick-start.sh
# Aguarde: ✓ Backend iniciado (8000) ✓ Frontend iniciado (5173)
```

### Passo 2: Fazer Login
```
http://localhost:5173
Email: qualquer@email.com
Senha: qualquer
```

### Passo 3: Explorar as Abas

#### **Aba 1: Descoberta**
1. Clique em uma música
2. Veja o grafo de similaridade
3. Receba recomendações inteligentes

#### **Aba 2: Cultural**
1. Explore músicas por região
2. Descubra instrumentos tradicionais
3. Conheça gêneros regionais

#### **Aba 3: Spotify** ⭐
1. Veja status da integração
2. Busque um artista (ex: "Coldplay")
3. Clique em "Importar"
4. Veja as músicas adicionadas ao grafo

#### **Aba 4: API Demo**
1. Selecione um endpoint
2. Execute a requisição
3. Veja o resultado em JSON

---

## 🎵 Integração Spotify

### Como Funciona?

```
1. Usuário busca "Coldplay"
   ↓
2. Backend consulta Spotify API
   ↓
3. Retorna: foto, gêneros, popularidade
   ↓
4. Usuário clica "Importar"
   ↓
5. Sistema importa:
   • 1 artista (Coldplay)
   • 2 gêneros (Pop, Rock)
   • 10 músicas (top tracks)
   • 25+ conexões
   ↓
6. Grafo atualizado em tempo real!
```

### Configurar Spotify (Opcional)

Para usar a integração real:

```bash
# 1. Obter credenciais em https://developer.spotify.com/dashboard
# 2. Copiar template
cp backend/.env.example backend/.env

# 3. Editar com suas credenciais
nano backend/.env

# 4. Reiniciar
./stop.sh && ./start.sh
```

**Arquivo `.env`:**
```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
```

**Nota:** Sem configurar, o sistema funciona normalmente, mas a importação do Spotify não estará disponível.

---

## 📊 Estrutura de Grafos

### Exemplo: Importar "The Beatles"

**Antes:**
```
50 vértices, 120 conexões
├─ 30 músicas
├─ 10 artistas  
└─ 10 gêneros
```

**Depois:**
```
63 vértices (+13), 145 conexões (+25)
├─ 40 músicas (+10)
├─ 11 artistas (+1)
└─ 12 gêneros (+2)
```

**Visualização:**
```
       [Pop]
       /    \
[The Beatles] [Rock]
      |
      ├─ Hey Jude
      ├─ Let It Be
      ├─ Yesterday
      └─ ... (mais 7)
```

---

## 🔌 API REST

### Endpoints Principais

**Grafo:**
```http
GET  /api/grafo/info              # Estatísticas do grafo
GET  /api/grafo/vertices          # Listar vértices
POST /api/grafo/vertices          # Criar vértice
POST /api/grafo/arestas           # Criar aresta
```

**Músicas:**
```http
GET  /api/musicas                 # Listar músicas
GET  /api/musicas/{id}            # Detalhes de música
POST /api/recomendacoes           # Gerar recomendações
```

**Spotify:**
```http
GET  /api/spotify/status          # Status da integração
GET  /api/spotify/buscar-artista  # Buscar no Spotify
POST /api/spotify/importar-artista # Importar para grafo
```

**Documentação Interativa:**
```
http://localhost:8000/docs
```

---

## 🛠️ Desenvolvimento

### Stack Tecnológica

**Backend:**
- Python 3.11
- FastAPI (API REST)
- Spotipy (Spotify API)
- Grafos com Matriz de Adjacência

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS + shadcn/ui

### Estrutura do Projeto

```
Amplify-3/
├── backend/
│   ├── api.py              # API REST (20+ endpoints)
│   ├── main.py             # Lógica de negócio
│   ├── grafoMatriz.py      # Implementação do grafo
│   ├── requirements.txt    # Dependências Python
│   └── .env.example        # Template de configuração
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppDashboard.tsx          # Dashboard principal
│   │   │   ├── SpotifyIntegration.tsx    # Integração Spotify
│   │   │   └── ...
│   │   └── services/
│   │       └── api.ts      # Cliente da API
│   ├── package.json
│   └── vite.config.ts
├── quick-start.sh          # Inicialização rápida
├── start.sh                # Inicialização completa
├── stop.sh                 # Parar sistema
└── README.md               # Este arquivo
```

### Scripts de Automação

```bash
# Início rápido (recomendado)
./quick-start.sh

# Início completo com logs
./start.sh

# Parar sistema
./stop.sh
```

### Executar Testes

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Build para Produção

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
npm run build
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Buscar e Importar Artista

```bash
# Via Frontend: Aba Spotify → Digite "Coldplay" → Importar

# Via API:
curl -X POST "http://localhost:8000/api/spotify/importar-artista" \
  -H "Content-Type: application/json" \
  -d '{"artista_nome": "Coldplay"}'
```

### Exemplo 2: Listar Músicas

```bash
# Via Frontend: Aba Spotify → Músicas Importadas → Atualizar

# Via API:
curl "http://localhost:8000/api/musicas"
```

### Exemplo 3: Ver Estatísticas do Grafo

```bash
# Via Frontend: Aba Spotify → Visualizar Grafo

# Via API:
curl "http://localhost:8000/api/grafo/info"
```

---

## 📚 Conceitos Técnicos

### Grafos

Um **grafo** é uma estrutura de dados composta por:
- **Vértices (V):** Nós do grafo (músicas, artistas, gêneros)
- **Arestas (E):** Conexões entre vértices

**Representação:** Matriz de Adjacência NxN
```python
adj[i][j] = peso da aresta entre vértice i e j
adj[i][j] = 0 se não há conexão
```

### Algoritmo de Jaccard

Calcula similaridade entre duas músicas:

```python
def jaccard(musica_A, musica_B):
    conexoes_A = set(vizinhos de A)
    conexoes_B = set(vizinhos de B)
    
    intersecao = conexoes_A & conexoes_B
    uniao = conexoes_A | conexoes_B
    
    return len(intersecao) / len(uniao)
```

**Exemplo:**
- Música A: {Coldplay, Pop, Rock}
- Música B: {Coldplay, Pop, Alternative}
- Similaridade: 2/4 = 0.5 (50%)

---

## 🐛 Solução de Problemas

### Backend não inicia
```bash
# Verificar porta 8000
lsof -i :8000

# Matar processo
kill -9 $(lsof -t -i:8000)

# Reinstalar dependências
cd backend
pip install -r requirements.txt
```

### Frontend não carrega
```bash
# Verificar porta 5173
lsof -i :5173

# Limpar e reinstalar
cd frontend
rm -rf node_modules .vite
npm install
npm run dev
```

### Spotify não funciona
1. Verifique se `.env` existe em `backend/`
2. Verifique credenciais em https://developer.spotify.com/dashboard
3. Teste: `curl http://localhost:8000/api/spotify/status`

---

## 👥 Equipe

**Desenvolvido para PAED 2 - UFMS**

- Bernardo de Souza Pereira - 10312871
- Matheus Queiroz Gregorin - 10418143
- Pedro Henrique Cagnoni Guimaraes - 10417477

**Data:** Novembro 2025  
**Versão:** 1.0.0

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais na **Universidade Federal de Mato Grosso do Sul (UFMS)**.

---

## 🎉 Conclusão

O Amplify é mais que um sistema de recomendação - é uma ferramenta educativa que demonstra conceitos de:
- ✅ Estruturas de dados (Grafos)
- ✅ Algoritmos de similaridade
- ✅ APIs REST
- ✅ Integração com serviços externos (Spotify)
- ✅ Desenvolvimento Full Stack

**Status:** ✅ **100% Funcional e Pronto para Uso**

---

**Desenvolvido com ❤️ usando Grafos e Ciência de Dados**

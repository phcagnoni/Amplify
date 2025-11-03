"""
API REST para o Amplify - Sistema de Recomendação Musical
Integração entre Backend (Python/Grafo) e Frontend (React)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from grafoMatriz import TGrafoND

# Inicializa o FastAPI
app = FastAPI(
    title="Amplify API",
    description="API de Recomendação Musical baseada em Grafos",
    version="1.0.0"
)

# Configuração de CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite e outros
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa o grafo global
grafo = TGrafoND()

# ==================== MODELOS PYDANTIC ====================

class VerticeCreate(BaseModel):
    nome: str
    tipo: str  # "musica", "artista", "genero"

class ArestaCreate(BaseModel):
    vertice1: str  # Nome do vértice
    vertice2: str  # Nome do vértice
    peso: float = 1.0

class LoginRequest(BaseModel):
    email: str
    password: str

class RecomendacaoRequest(BaseModel):
    usuario_id: Optional[str] = None
    genero: Optional[str] = None
    artista: Optional[str] = None
    limite: int = 10

class MusicaInfo(BaseModel):
    id: int
    nome: str
    artistas: List[str] = []
    generos: List[str] = []

class SpotifyImportRequest(BaseModel):
    artista_nome: str

# ==================== ENDPOINTS DE AUTENTICAÇÃO ====================

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Endpoint de login (mock - implementar autenticação real depois)"""
    # TODO: Implementar autenticação real com banco de dados
    if request.email and request.password:
        return {
            "success": True,
            "user": {
                "id": "user_123",
                "name": "Usuário Amplify",
                "email": request.email
            },
            "token": "mock_token_123456"
        }
    raise HTTPException(status_code=401, detail="Credenciais inválidas")

@app.post("/api/auth/register")
async def register(request: LoginRequest):
    """Endpoint de registro (mock)"""
    # TODO: Implementar registro real
    return {
        "success": True,
        "message": "Usuário registrado com sucesso",
        "user": {
            "id": "user_new",
            "email": request.email
        }
    }

# ==================== ENDPOINTS DO GRAFO ====================

@app.get("/api/grafo/info")
async def get_grafo_info():
    """Retorna informações gerais do grafo"""
    return {
        "vertices": grafo.n,
        "arestas": grafo.m,
        "vertices_por_tipo": {
            tipo: len(vertices) 
            for tipo, vertices in grafo.vertices_por_tipo.items()
        }
    }

@app.post("/api/grafo/vertices")
async def criar_vertice(vertice: VerticeCreate):
    """Cria um novo vértice no grafo"""
    try:
        id_vertice = grafo.insereV(vertice.nome, vertice.tipo)
        return {
            "success": True,
            "id": id_vertice,
            "nome": vertice.nome,
            "tipo": vertice.tipo
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/grafo/vertices")
async def listar_vertices(tipo: Optional[str] = None):
    """Lista todos os vértices ou filtra por tipo"""
    vertices = []
    
    if tipo:
        ids_vertices = grafo.vertices_por_tipo.get(tipo, set())
    else:
        ids_vertices = grafo.itens.keys()
    
    for vid in ids_vertices:
        info = grafo.itens[vid]
        vertices.append({
            "id": vid,
            "nome": info["nome"],
            "tipo": info["tipo"]
        })
    
    return {"vertices": vertices, "total": len(vertices)}

@app.get("/api/grafo/vertices/{vertice_id}")
async def get_vertice(vertice_id: int):
    """Retorna informações de um vértice específico"""
    if vertice_id not in grafo.itens:
        raise HTTPException(status_code=404, detail="Vértice não encontrado")
    
    info = grafo.itens[vertice_id]
    
    # Busca conexões
    conexoes = []
    for i in range(grafo.n):
        if grafo.adj[vertice_id][i] > 0:
            conexoes.append({
                "id": i,
                "nome": grafo.itens[i]["nome"],
                "tipo": grafo.itens[i]["tipo"],
                "peso": grafo.adj[vertice_id][i]
            })
    
    return {
        "id": vertice_id,
        "nome": info["nome"],
        "tipo": info["tipo"],
        "conexoes": conexoes,
        "total_conexoes": len(conexoes)
    }

@app.post("/api/grafo/arestas")
async def criar_aresta(aresta: ArestaCreate):
    """Cria uma aresta entre dois vértices"""
    try:
        # Busca IDs dos vértices pelos nomes
        id1 = grafo.itens_reverso.get(aresta.vertice1)
        id2 = grafo.itens_reverso.get(aresta.vertice2)
        
        if id1 is None or id2 is None:
            raise HTTPException(
                status_code=404, 
                detail="Um ou ambos os vértices não existem"
            )
        
        grafo.insereA(id1, id2, aresta.peso)
        
        return {
            "success": True,
            "vertice1": aresta.vertice1,
            "vertice2": aresta.vertice2,
            "peso": aresta.peso
        }
    except IndexError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== ENDPOINTS DE MÚSICA ====================

@app.get("/api/musicas")
async def listar_musicas(genero: Optional[str] = None, artista: Optional[str] = None):
    """Lista músicas com filtros opcionais"""
    musicas = []
    
    ids_musicas = grafo.vertices_por_tipo.get("musica", set())
    
    for mid in ids_musicas:
        info = grafo.itens[mid]
        musica_nome = info["nome"]
        
        # Busca artistas e gêneros conectados
        artistas_conectados = []
        generos_conectados = []
        
        for i in range(grafo.n):
            if grafo.adj[mid][i] > 0:
                vertice_info = grafo.itens[i]
                if vertice_info["tipo"] == "artista":
                    artistas_conectados.append(vertice_info["nome"])
                elif vertice_info["tipo"] == "genero":
                    generos_conectados.append(vertice_info["nome"])
        
        # Aplica filtros
        if genero and genero.lower() not in [g.lower() for g in generos_conectados]:
            continue
        if artista and artista.lower() not in [a.lower() for a in artistas_conectados]:
            continue
        
        musicas.append({
            "id": mid,
            "nome": musica_nome,
            "artistas": artistas_conectados,
            "generos": generos_conectados
        })
    
    return {"musicas": musicas, "total": len(musicas)}

@app.get("/api/musicas/{musica_id}")
async def get_musica(musica_id: int):
    """Retorna detalhes de uma música específica"""
    if musica_id not in grafo.itens:
        raise HTTPException(status_code=404, detail="Música não encontrada")
    
    info = grafo.itens[musica_id]
    
    if info["tipo"] != "musica":
        raise HTTPException(status_code=400, detail="ID não corresponde a uma música")
    
    # Busca artistas e gêneros
    artistas = []
    generos = []
    
    for i in range(grafo.n):
        if grafo.adj[musica_id][i] > 0:
            vertice_info = grafo.itens[i]
            if vertice_info["tipo"] == "artista":
                artistas.append({
                    "id": i,
                    "nome": vertice_info["nome"]
                })
            elif vertice_info["tipo"] == "genero":
                generos.append({
                    "id": i,
                    "nome": vertice_info["nome"]
                })
    
    return {
        "id": musica_id,
        "nome": info["nome"],
        "artistas": artistas,
        "generos": generos
    }

# ==================== ENDPOINTS DE RECOMENDAÇÃO ====================

@app.post("/api/recomendacoes")
async def gerar_recomendacoes(request: RecomendacaoRequest):
    """Gera recomendações musicais baseadas em filtros"""
    # Implementação simplificada - pode ser expandida
    recomendacoes = []
    
    ids_musicas = grafo.vertices_por_tipo.get("musica", set())
    
    for mid in list(ids_musicas)[:request.limite]:
        info = grafo.itens[mid]
        
        # Busca conexões
        artistas = []
        generos = []
        
        for i in range(grafo.n):
            if grafo.adj[mid][i] > 0:
                vertice_info = grafo.itens[i]
                if vertice_info["tipo"] == "artista":
                    artistas.append(vertice_info["nome"])
                elif vertice_info["tipo"] == "genero":
                    generos.append(vertice_info["nome"])
        
        # Aplica filtros
        if request.genero and request.genero.lower() not in [g.lower() for g in generos]:
            continue
        if request.artista and request.artista.lower() not in [a.lower() for a in artistas]:
            continue
        
        recomendacoes.append({
            "id": mid,
            "nome": info["nome"],
            "artistas": artistas,
            "generos": generos,
            "score": 0.85  # Mock score - implementar algoritmo real
        })
    
    return {
        "recomendacoes": recomendacoes[:request.limite],
        "total": len(recomendacoes)
    }

# ==================== ENDPOINTS DE SPOTIFY ====================

@app.post("/api/spotify/importar-artista")
async def importar_artista(request: SpotifyImportRequest):
    """Importa um artista do Spotify para o grafo"""
    try:
        from main import importar_artista_spotify, sp
        
        if not sp:
            raise HTTPException(
                status_code=503, 
                detail="API do Spotify não está configurada. Configure CLIENT_ID e CLIENT_SECRET no main.py"
            )
        
        # Captura informações antes da importação
        vertices_antes = grafo.n
        
        importar_artista_spotify(grafo, request.artista_nome)
        
        vertices_depois = grafo.n
        novos_vertices = vertices_depois - vertices_antes
        
        return {
            "success": True,
            "message": f"Artista '{request.artista_nome}' importado com sucesso",
            "detalhes": {
                "novos_vertices": novos_vertices,
                "total_vertices": vertices_depois
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao importar artista: {str(e)}")

@app.get("/api/spotify/buscar-artista")
async def buscar_artista_spotify(nome: str):
    """Busca um artista no Spotify"""
    try:
        from main import sp
        
        if not sp:
            raise HTTPException(
                status_code=503,
                detail="API do Spotify não configurada"
            )
        
        resultados = sp.search(q=f'artist:{nome}', type='artist', limit=5)
        
        artistas = []
        for artista in resultados['artists']['items']:
            artistas.append({
                "id": artista['id'],
                "nome": artista['name'],
                "generos": artista['genres'],
                "popularidade": artista['popularity'],
                "imagem": artista['images'][0]['url'] if artista['images'] else None
            })
        
        return {
            "artistas": artistas,
            "total": len(artistas)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/spotify/top-tracks/{artista_id}")
async def get_top_tracks(artista_id: str):
    """Obtém as músicas mais populares de um artista"""
    try:
        from main import sp
        
        if not sp:
            raise HTTPException(
                status_code=503,
                detail="API do Spotify não configurada"
            )
        
        top_tracks = sp.artist_top_tracks(artista_id)
        
        musicas = []
        for track in top_tracks['tracks']:
            musicas.append({
                "id": track['id'],
                "nome": track['name'],
                "album": track['album']['name'],
                "duracao_ms": track['duration_ms'],
                "popularidade": track['popularity'],
                "preview_url": track['preview_url']
            })
        
        return {
            "musicas": musicas,
            "total": len(musicas)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/spotify/status")
async def spotify_status():
    """Verifica o status da integração com Spotify"""
    try:
        from main import sp, CLIENT_ID, CLIENT_SECRET
        
        configurado = CLIENT_ID != "Inserir_Client_ID" and CLIENT_SECRET != "Inserir_Client_Secret"
        
        return {
            "configurado": configurado,
            "conectado": sp is not None,
            "mensagem": "Spotify configurado e conectado" if sp else "Spotify não configurado. Edite main.py com suas credenciais."
        }
    except Exception as e:
        return {
            "configurado": False,
            "conectado": False,
            "mensagem": str(e)
        }

# ==================== ENDPOINTS DE ARQUIVO ====================

@app.post("/api/grafo/salvar")
async def salvar_grafo(caminho: str = "Grafo.txt"):
    """Salva o grafo em arquivo"""
    try:
        grafo.gravar_grafo_arquivo(caminho)
        return {
            "success": True,
            "message": f"Grafo salvo em '{caminho}'"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/grafo/carregar")
async def carregar_grafo(caminho: str = "Grafo.txt"):
    """Carrega o grafo de um arquivo"""
    try:
        global grafo
        grafo = TGrafoND()
        # TODO: Implementar método de carregamento do arquivo
        return {
            "success": True,
            "message": f"Grafo carregado de '{caminho}'"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ENDPOINT DE SAÚDE ====================

@app.get("/")
async def root():
    """Endpoint raiz - health check"""
    return {
        "status": "online",
        "service": "Amplify API",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    """Verifica status da API"""
    return {
        "status": "healthy",
        "grafo": {
            "vertices": grafo.n,
            "arestas": grafo.m
        }
    }

# ==================== ENDPOINTS DE DEMONSTRAÇÃO ====================

@app.post("/api/demo/inicializar")
async def inicializar_dados_demo():
    """Inicializa o grafo com dados de demonstração para apresentação"""
    try:
        # Limpa o grafo
        global grafo
        grafo = TGrafoND()
        
        # Adiciona artistas
        artistas = [
            "The Beatles", "Queen", "Pink Floyd", "Led Zeppelin",
            "Coldplay", "Imagine Dragons", "Arctic Monkeys"
        ]
        ids_artistas = {}
        for artista in artistas:
            ids_artistas[artista] = grafo.insereV(artista, "artista")
        
        # Adiciona gêneros
        generos = ["Rock", "Pop", "Alternative", "Classic Rock", "Progressive Rock"]
        ids_generos = {}
        for genero in generos:
            ids_generos[genero] = grafo.insereV(genero, "genero")
        
        # Adiciona músicas com conexões
        musicas_data = [
            {"nome": "Hey Jude", "artista": "The Beatles", "generos": ["Rock", "Pop"]},
            {"nome": "Let It Be", "artista": "The Beatles", "generos": ["Rock", "Pop"]},
            {"nome": "Bohemian Rhapsody", "artista": "Queen", "generos": ["Rock", "Progressive Rock"]},
            {"nome": "We Will Rock You", "artista": "Queen", "generos": ["Rock"]},
            {"nome": "Wish You Were Here", "artista": "Pink Floyd", "generos": ["Progressive Rock", "Rock"]},
            {"nome": "Comfortably Numb", "artista": "Pink Floyd", "generos": ["Progressive Rock", "Rock"]},
            {"nome": "Stairway to Heaven", "artista": "Led Zeppelin", "generos": ["Classic Rock", "Rock"]},
            {"nome": "Kashmir", "artista": "Led Zeppelin", "generos": ["Classic Rock", "Rock"]},
            {"nome": "Fix You", "artista": "Coldplay", "generos": ["Pop", "Alternative"]},
            {"nome": "Viva La Vida", "artista": "Coldplay", "generos": ["Pop", "Alternative"]},
            {"nome": "Radioactive", "artista": "Imagine Dragons", "generos": ["Alternative", "Rock"]},
            {"nome": "Demons", "artista": "Imagine Dragons", "generos": ["Alternative", "Pop"]},
            {"nome": "Do I Wanna Know?", "artista": "Arctic Monkeys", "generos": ["Alternative", "Rock"]},
            {"nome": "R U Mine?", "artista": "Arctic Monkeys", "generos": ["Alternative", "Rock"]}
        ]
        
        for musica_info in musicas_data:
            # Cria vértice da música
            id_musica = grafo.insereV(musica_info["nome"], "musica")
            
            # Conecta com artista
            id_artista = ids_artistas[musica_info["artista"]]
            grafo.insereA(id_musica, id_artista)
            
            # Conecta com gêneros
            for genero in musica_info["generos"]:
                id_genero = ids_generos[genero]
                grafo.insereA(id_musica, id_genero)
        
        return {
            "success": True,
            "message": "Dados de demonstração inicializados com sucesso!",
            "detalhes": {
                "vertices": grafo.n,
                "arestas": grafo.m,
                "artistas": len(artistas),
                "generos": len(generos),
                "musicas": len(musicas_data)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao inicializar: {str(e)}")

@app.get("/api/recomendacoes/{musica_nome}")
async def recomendar_por_musica(musica_nome: str, limite: int = 5):
    """Gera recomendações baseadas em uma música usando similaridade de Jaccard"""
    try:
        from main import recomendar_musicas
        
        # Busca recomendações usando o algoritmo do grafo
        recomendacoes_ids = recomendar_musicas(grafo, musica_nome, limite)
        
        if not recomendacoes_ids:
            return {
                "musica_base": musica_nome,
                "recomendacoes": [],
                "message": "Música não encontrada ou sem conexões"
            }
        
        # Formata as recomendações
        recomendacoes = []
        for musica_nome_rec, score in recomendacoes_ids:
            # A função recomendar_musicas retorna (nome_musica, score)
            # Precisamos buscar o ID da música pelo nome
            if musica_nome_rec not in grafo.itens_reverso:
                continue
                
            musica_id = grafo.itens_reverso[musica_nome_rec]
            info = grafo.itens[musica_id]
            
            # Busca artista e gêneros
            artistas = []
            generos = []
            for i in range(grafo.n):
                if grafo.adj[musica_id][i] > 0:
                    vertice = grafo.itens[i]
                    if vertice["tipo"] == "artista":
                        artistas.append(vertice["nome"])
                    elif vertice["tipo"] == "genero":
                        generos.append(vertice["nome"])
            
            recomendacoes.append({
                "id": musica_id,
                "nome": info["nome"],
                "artistas": artistas,
                "generos": generos,
                "score_similaridade": round(score, 1)  # Converte para percentual
            })
        
        return {
            "musica_base": musica_nome,
            "recomendacoes": recomendacoes,
            "total": len(recomendacoes)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar recomendações: {str(e)}")

# ==================== ENDPOINT DE ARQUIVO ====================

# ==================== INICIALIZAÇÃO ====================

if __name__ == "__main__":
    print(" Iniciando Amplify API...")
    print(" API disponível em: http://localhost:8000")
    print(" Documentação em: http://localhost:8000/docs")
    
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

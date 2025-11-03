from grafoMatriz import TGrafoND

def test_inserir_aresta():
    """
    Testa se a inserção de uma aresta funciona corretamente
    em um grafo não direcionado.
    """
    # 1. Preparação (Setup)
    grafo = TGrafoND(n=4) # Cria um grafo pequeno com 4 vértices
    
    # 2. Ação (Act)
    grafo.insereA(0, 2)
    
    # 3. Verificação (Assert)
    # Verifica se a aresta existe em ambas as direções
    assert grafo.adj[0][2] == 1.0
    assert grafo.adj[2][0] == 1.0
    # Verifica se o número de arestas foi incrementado
    assert grafo.m == 1
    # Verifica se não criou uma aresta onde não deveria
    assert grafo.adj[0][1] == 0.0

def test_remover_vertice_simples():
    """
    Testa a remoção de um vértice e a atualização da matriz.
    """
    # 1. Preparação
    grafo = TGrafoND(n=3)
    grafo.itens = {
            0: {"nome": "MusicaA", "tipo": "musica"},
            1: {"nome": "MusicaB", "tipo": "musica"},
            2: {"nome": "MusicaC", "tipo": "musica"}
        }
    grafo.itens_reverso = {"MusicaA": 0, "MusicaB": 1, "MusicaC": 2}
    grafo.insereA(0, 1)
    grafo.insereA(1, 2)
    
    # 2. Ação
    grafo.removeV(1) # Remove o vértice do meio
    
    # 3. Verificação
    assert grafo.n == 2 # O número de vértices deve ser 2
    assert grafo.m == 0 # Todas as arestas ligadas a '1' devem ter sido removidas
    # Verifica se os vértices restantes foram remapeados
    assert grafo.get_nome_item(0) == "MusicaA"
    assert grafo.get_nome_item(1) == "MusicaC"
    # Verifica se não há mais conexão
    assert grafo.adj[0][1] == 0.0

'''' 
Amplify

Nomes e RA:
Bernardo de Souza Pereira - 10312871
Matheus Queiroz Gregorin - 10418143
Pedro Henrique Cagnoni Guimaraes - 10417477

O projeto utiliza matriz de adjacência para representar grafos.
'''

import os
from pathlib import Path
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# --- CONFIGURAÇÃO SPOTIPY COM SUPORTE A .env ---
# Tenta carregar variáveis de ambiente do arquivo .env
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)
        print("✓ Arquivo .env carregado com sucesso")
except ImportError:
    print("⚠ python-dotenv não instalado. Usando variáveis de ambiente do sistema.")

# Busca credenciais (primeiro .env, depois variáveis de ambiente do sistema)
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID", "Inserir_Client_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET", "Inserir_Client_Secret")

# Valida se as credenciais foram configuradas
if CLIENT_ID == "Inserir_Client_ID" or CLIENT_SECRET == "Inserir_Client_Secret":
    print("\n⚠ SPOTIFY NÃO CONFIGURADO ⚠")
    print("Para habilitar a integração com Spotify:")
    print("1. Copie backend/.env.example para backend/.env")
    print("2. Edite backend/.env com suas credenciais")
    print("3. Obtenha credenciais em: https://developer.spotify.com/dashboard\n")
    sp = None
else:
    try:
        auth_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
        sp = spotipy.Spotify(auth_manager=auth_manager)
        print("✓ Spotify autenticado com sucesso!")
    except Exception as e:
        print(f"✗ Erro ao autenticar com Spotify: {e}")
        sp = None

from grafoMatriz import TGrafoND

def importar_artista_spotify(grafo, artista_nome):

    if not sp:
        print(" API do Spotify não autenticada")
        return
    
    print(f"\n Buscando por '{artista_nome}' no Spotify")

    try:
        resultados = sp.search(q=f'artist:{artista_nome}', type='artist', limit=1)
        if not resultados:
            print(f" Artista '{artista_nome}' não encontrado.")
            return
        artista_data = resultados['artists']['items'][0]
        nome_artista_real = artista_data['name']

        id_artista = grafo.insereV(nome_artista_real, "artista")

        ids_generos = set()
        for genero_nome in artista_data['genres']:
            genero = genero_nome.title()
            id_genero = grafo.insereV(genero_nome, "genero")
            ids_generos.add(id_genero)

            grafo.insereA(id_artista, id_genero)
        
        print(f" Artista '{nome_artista_real}' e {len(ids_generos)} gêneros processados")

        top_tracks = sp.artist_top_tracks(artista_data['id'])

        musicas_importadas = 0
        for track in top_tracks['tracks']:
            musica_nome = track['name']

            id_musica = grafo.insereV(musica_nome, "musica")

            grafo.insereA(id_musica, id_artista)

            for id_genero in ids_generos:
                grafo.insereA(id_musica, id_genero)

            musicas_importadas += 1

        print(f" Importação de '{nome_artista_real}' concluída")
        print(f" {musicas_importadas} músicas importadas")
    except Exception as e:
        print(f" Erro durante a importação do Spotify: {e}")


def recomendar_musicas(grafo, nome_musica_base, top_n = 5):
    # Recomendacao de musicas baseada no teorema de Jaccard

    if nome_musica_base not in grafo.itens_reverso:
        print(f" Erro: Musica '{nome_musica_base}' não encontrada")
        return []
    
    musica_base_id = grafo.itens_reverso[nome_musica_base]

    if grafo.itens[musica_base_id]["tipo"] != "musica":
        print(f"Erro '{nome_musica_base}' não é uma música")
        return []
    
    perfil_base = grafo.obter_vizinhos(musica_base_id)

    if not perfil_base:
        print(f"Música '{nome_musica_base}' não tem conexões")
        return []
    
    scores_similaridade = []

    for musica_id in grafo.vertices_por_tipo["musica"]:
        if musica_id == musica_base_id:
            continue
        perfil_outra = grafo.obter_vizinhos(musica_id)
        if not perfil_outra:
            continue

        intersecao = perfil_base.intersection(perfil_outra)
        uniao = perfil_base.union(perfil_outra)

        if not uniao:
            jaccard_score = 0.0
        else:
            jaccard_score = len(intersecao)/len(uniao)
        
        if jaccard_score > 0:
            nome_outra_musica = grafo.get_nome_item(musica_id)
            scores_similaridade.append((nome_outra_musica, jaccard_score))
    
    scores_similaridade.sort(key=lambda item: item[1], reverse = True)
    return scores_similaridade[:top_n]

def mostrar_menu():
    """Exibe o menu de opções"""
    print("\n" + "=" * 50)
    print("       SISTEMA DE GRAFOS - MENU")
    print("=" * 50)
    print("a) Ler dados do arquivo grafo.txt")
    print("b) Gravar dados no arquivo grafo.txt")
    print("c) Inserir vértice (Manual)")
    print("d) Inserir aresta (Manual)")
    print("e) Remover vértice")
    print("f) Remover aresta")
    print("g) Mostrar conteúdo do arquivo")
    print("h) Mostrar grafo (Matriz)")
    print("i) Apresentar conexidade do grafo")
    print("j) Importar Artista do Spotify")
    print("k) Recomendar Músicas")
    print("l) Encerrar a aplicação")
    print("=" * 50)

def main():
    """Função principal com menu interativo"""
    grafo = TGrafoND()
    
    print(" SISTEMA DE GRAFOS MUSICAIS")
    print("Projeto Teoria dos Grafos - Amplify")
    
    while True:
        mostrar_menu()
        
        try:
            # Atualizado para (a-l) com base no seu novo menu
            opcao = input("\nEscolha uma opção (a-l): ").strip().lower()
            
            if opcao == 'a':
                # Ler dados do arquivo grafo.txt
                try:
                    grafo.arquivo_para_matriz_adjacencia("Grafo.txt")
                    print(" Arquivo lido com sucesso!")
                except FileNotFoundError:
                    print(" Erro: Arquivo 'Grafo.txt' não encontrado.")
                except Exception as e:
                    print(f" Erro ao ler arquivo: {e}")
                    
            elif opcao == 'b':
                # Gravar dados no arquivo grafo.txt
                try:
                    grafo.gravar_grafo_arquivo("Grafo.txt")
                except Exception as e:
                    print(f" Erro ao gravar arquivo: {e}")
                
            elif opcao == 'c':
                # Inserir vértice
                try:
                    nome_vertice = input("Digite o nome do vértice: ").strip()
                    tipo_vertice = input("Digite o tipo (musica/artista/genero): ").strip().lower()

                    # Valida o tipo e usa "desconhecido" como padrão
                    if tipo_vertice not in ["musica", "artista", "genero"]:
                        print("   Aviso: Tipo inválido, usando 'desconhecido'.")
                        tipo_vertice = "desconhecido"
                        
                    if nome_vertice:
                        grafo.insereV(nome_vertice, tipo_vertice) 
                    else:
                        print(" Nome do vértice não pode estar vazio.")
                except Exception as e:
                    print(f" Erro ao inserir vértice: {e}")
        
            elif opcao == 'd':
                # Inserir aresta
                try:
                    v1 = int(input("Digite o primeiro vértice: "))
                    v2 = int(input("Digite o segundo vértice: "))
                    
                    grafo.insereA(v1, v2)
                    nome1 = grafo.get_nome_item(v1) #
                    nome2 = grafo.get_nome_item(v2) #
                    print(f" Aresta inserida: {v1}({nome1}) <-> {v2}({nome2})")
                    
                except ValueError:
                    print(" Erro: Digite números válidos.")
                except IndexError:
                    print(" Erro: Vértice inválido.")
                except Exception as e:
                    print(f" Erro ao inserir aresta: {e}")
                    
            elif opcao == 'e':
                # Remover vértice
                try:
                    vertice = int(input("Digite o vértice a ser removido: "))
                    nome = grafo.get_nome_item(vertice)
                    grafo.removeV(vertice)
                except ValueError:
                    print(" Erro: Digite um número válido.")
                except IndexError:
                    print(" Erro: Vértice inválido.")
                except Exception as e:
                    print(f" Erro ao remover vértice: {e}")
                    
            elif opcao == 'f':
                # Remover aresta
                try:
                    v1 = int(input("Digite o primeiro vértice: "))
                    v2 = int(input("Digite o segundo vértice: "))
                    
                    nome1 = grafo.get_nome_item(v1)
                    nome2 = grafo.get_nome_item(v2)
                    
                    grafo.removeA(v1, v2)
                    print(f" Aresta removida: {v1}({nome1}) <-> {v2}({nome2})")
                    
                except ValueError:
                    print(" Erro: Digite números válidos.")
                except IndexError:
                    print(" Erro: Vértice inválido.")
                except Exception as e:
                    print(f" Erro ao remover aresta: {e}")
                    
            elif opcao == 'g':
                # Mostrar conteúdo do arquivo
                try:
                    print("\n OPÇÕES DE VISUALIZAÇÃO DO ARQUIVO:")
                    print("1. Visão geral do arquivo")
                    print("2. Conexões detalhadas")
                    
                    sub_opcao = input("Escolha (1-2): ").strip()
                    
                    if sub_opcao == '1':
                        grafo.mostrar_conteudo_arquivo("Grafo.txt")
                    elif sub_opcao == '2':
                        limite = input("Quantos vértices mostrar? (padrão 20): ").strip()
                        limite = int(limite) if limite.isdigit() else 20
                        grafo.mostrar_conexoes_detalhadas("Grafo.txt", limite)
                    else:
                        print(" Opção inválida.")
                        
                except Exception as e:
                    print(f" Erro ao mostrar conteúdo do arquivo: {e}")
                    
            elif opcao == 'h':
                # Mostrar grafo
                grafo.show_matriz_paginada()
                    
            elif opcao == 'i':
                # Apresentar conexidade do grafo
                print(f"\n ANÁLISE DE CONEXIDADE:")
                conexidade = grafo.conexidade()
                if conexidade == 0:
                    print("O grafo é conexo")
                else:
                    print("O grafo é desconexo")

            elif opcao == 'j':
                # Importar artista do Spotify
                # Verifica se a variável 'sp' foi inicializada com sucesso
                if not sp: 
                    print(" API do Spotify não foi inicializada.")
                else:
                    nome_artista = input("Digite o nome do artista para importar: ").strip()
                    if nome_artista:
                        importar_artista_spotify(grafo, nome_artista)
                    else:
                        print(" Nome do artista não pode ser vazio.")

            elif opcao == 'k':
                # Recomendar Músicas
                nome_musica = input("Digite o nome da música para recomendar: ").strip()
                if nome_musica:
                    recomendacoes = recomendar_musicas(grafo, nome_musica, top_n=5)
                    if recomendacoes:
                        print(f"\n--- Recomendações para '{nome_musica}' ---")
                        for i, (musica, similaridade) in enumerate(recomendacoes):
                            print(f"{i+1}. {musica} (Similaridade: {similaridade*100:.2f}%)")
                    else:
                        print(f"Nenhuma recomendação encontrada para '{nome_musica}'.")
                else:
                    print(" Nome da música não pode ser vazio.")
                    
            elif opcao == 'l':
                # Encerrar
                print("\n Encerrando aplicação...")
                print("Obrigado por usar o AmpliFy!")
                break
                
            else:
                print(" Opção inválida! Escolha uma letra de 'a' a 'l'.")
                
        except KeyboardInterrupt:
            print("\n\n Aplicação encerrada pelo usuário.")
            break
        except Exception as e:
            print(f" Erro inesperado: {e}")
        
        # Pausa para o usuário ver o resultado
        input("\nPressione Enter para continuar...")

if __name__ == "__main__":
    main()




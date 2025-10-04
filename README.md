# AmpliFy - Sistema de Recomendação de Músicas

## 1. Visão Geral do Projeto

O Amplify é um sistema de recomendação de músicas baseado em grafos, que utiliza conexões inteligentes entre faixas para oferecer indicações mais relevantes e personalizadas. A proposta surge a partir da constatação de uma falha recorrente nos aplicativos de música mais populares: suas recomendações muitas vezes são superficiais, repetitivas e pouco precisas, deixando de explorar toda a diversidade musical disponível.
Nosso objetivo é inovar nesse setor, aplicando conceitos de ciência de dados e teoria dos grafos para criar recomendações que realmente façam sentido para cada usuário. O sistema será disponibilizado em um site web intuitivo e acessível, que alia facilidade de uso a tecnologias avançadas de processamento e análise de similaridade musical. Dessa forma, os usuários poderão descobrir músicas diferentes, mas que compartilham características próximas ao seu gosto pessoal, promovendo uma experiência mais rica, personalizada e satisfatória.
Além disso, a solução busca expandir horizontes musicais, indo além das recomendações tradicionais e repetitivas, incentivando a descoberta de novos estilos, artistas e sonoridades, sempre respeitando as preferências individuais e incentivando a cultura.

O projeto não se limita ao entretenimento, possuindo também um forte foco educacional e cultural. O sistema será adaptado para gerar playlists focadas em gêneros musicais brasileiros, servindo como uma ferramenta pedagógica para engajar jovens com o patrimônio cultural nacional.

Este projeto é desenvolvido em grupo para praticar o desenvolvimento colaborativo de sistemas [cite: 1464] e passará por todas as etapas da engenharia de software, desde a concepção e modelagem até o desenvolvimento, testes e implantação[cite: 1455].

## 2. Tecnologias Utilizadas

* **Linguagem de Programação:** Python
* **Gerenciamento de Versões:** Git e GitHub
* **Testes Automatizados:** Pytest
* **Automação (CI/CD):** GitHub Actions

## 3. Arquitetura e Pipeline de CI/CD

Foi feita a construção de um pipeline, configurado via GitHub Actions, que automatiza o ciclo de vida da aplicação, garantindo a qualidade e agilizando a entrega de novas versões.

### Fluxo do Pipeline

O pipeline é dividido em dois cenários principais:

1.  **Integração Contínua (CI):** Acionado a cada `push` ou `pull request` para a branch `main`. O objetivo é validar a integridade e qualidade do código. As etapas são:
    * Instalação de dependências.
    * Execução da suíte de testes automatizados com Pytest.

2.  **Entrega Contínua (CD):** Acionada a cada `push` de uma nova `tag` (ex: `v1.0.0`). O objetivo é implantar uma nova versão da aplicação no ambiente de nuvem.
    * Primeiro, executa todo o fluxo de CI para garantir que a versão é estável.
    * Se a CI for bem-sucedida, o pipeline se conecta à nuvem e realiza o deploy da aplicação.

### Representação Visual do Pipeline (CI + CD)
<img width="1150" height="461" alt="image" src="https://github.com/user-attachments/assets/8ad7c21d-c355-4e21-bcca-36551981fdd0" />

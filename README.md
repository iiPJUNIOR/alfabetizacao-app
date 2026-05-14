# Plataforma de Apoio à Alfabetização

Esta aplicação foi criada para auxiliar professores durante o processo de alfabetização remota. Ela permite que o professor envie palavras (ou sílabas) em tempo real para a tela do aluno, com uma interface limpa, focada e acolhedora.

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion (animações CSS personalizadas), Lucide React (ícones).
- **Backend**: Node.js, Express, Socket.IO (para comunicação em tempo real).

## Estrutura do Projeto

O projeto é dividido em duas pastas principais:
- `frontend/`: Contém a aplicação web construída com Next.js (App Router).
- `backend/`: Contém o servidor Socket.IO responsável por gerenciar as salas e o tempo real.

## Como Executar

Você precisará de dois terminais abertos.

### 1. Executando o Backend

Abra um terminal na pasta `backend`:
```bash
cd backend
node index.js
```
O servidor será iniciado na porta **3001**.

### 2. Executando o Frontend

Abra outro terminal na pasta `frontend`:
```bash
cd frontend
npm run dev
```
A aplicação web estará disponível em **http://localhost:3000**.

## Fluxo de Uso

1. **Professor**:
   - Acesse `http://localhost:3000`
   - Clique em "Professor"
   - Digite seu nome e crie um "Código da Sala" (ex: `AULA123`)
   - Aguarde os alunos entrarem e gerencie as palavras enviadas.
   - **Dica:** Para separar as sílabas visualmente na tela do aluno, basta digitar espaços entre as sílabas (ex: `CA SA`).

2. **Aluno**:
   - O aluno acessa `http://localhost:3000` e clica em "Aluno".
   - Digita o nome e o "Código da Sala" fornecido pelo professor.
   - Clica em "Estou pronto". A partir deste momento, o aluno não precisa fazer mais nada, apenas ler as palavras que aparecem na tela de forma acolhedora e animada.

# Backend — Bloco de Notas Camuflado

API REST em Node.js/Express com MySQL 8.4. O backend não contém Dockerfile, Docker Compose ou arquivos de configuração Docker. O banco é iniciado diretamente pelo terminal usando `docker run`.

## Inicialização rápida

1. Na raiz do repositório, crie o volume: `docker volume create bloco_notas_mysql_data`.
2. Inicie o MySQL usando o comando específico do seu terminal descrito na seção **Como iniciar o banco de dados com Docker** do [README principal](../README.md). O comando monta `database/init/` para execução automática dos scripts SQL.
3. Entre nesta pasta (`backend`), copie `.env.example` para `.env` e configure as credenciais para corresponder às utilizadas no container.
4. Instale dependências: `npm install`.
5. Inicie: `npm run dev`.
6. Teste: `GET http://localhost:3333/health`.

## Scripts SQL

Os arquivos em `database/init/` são executados em ordem alfabética na primeira inicialização de um volume vazio. Cada entidade possui seu próprio arquivo SQL. Não remova o volume em ambiente com dados que deseja preservar.

## Documentação

Veja `docs/API.md` para endpoints, exemplos de payload, autenticação por senha + PIN e regras de acesso. O [README principal](../README.md) contém o procedimento completo para criar, verificar, parar e reiniciar o container MySQL.

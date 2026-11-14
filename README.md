# Projeto Integrador — Bloco de Notas Camuflado

**Tema:** Aplicativo de apoio camuflado para mulheres em situação de violência.  
**Aplicativo mobile:** React Native + Expo.  
**API:** Node.js + Express.  
**Banco de dados:** MySQL 8.4 (executado em container Docker; sem arquivos Docker dentro da API).  
**Data Science:** Python + scikit-learn (notebook em `dataScience/`), resultado exibido no app.

## 1. Sobre o projeto

O aplicativo mantém uma interface de bloco de notas comum e oferece uma área restrita de apoio, com contatos de confiança, diário sigiloso e solicitação de alerta. A área restrita é desbloqueada por um PIN separado da senha de login.

## 2. Estado atual (Entrega final — Etapas 3 e 4)

Todas as telas consomem a API real; não há dados simulados (`mockData`, `MOCK_NOTES` ou arrays fixos).

| Parte | Situação |
|---|---|
| Login e cadastro (`LoginScreen`, `RegisterScreen`) | `POST /auth/login` e `POST /auth/register`, com loading e mensagens de erro da API |
| Notas do disfarce (`NotesListScreen`, `NoteEditorScreen`) | CRUD real em `/notas` via `NotesContext` |
| Gatilho camuflado | PIN (4 a 8 números) digitado na **barra de busca** da lista de notas + tecla de confirmar → `POST /auth/unlock` → abre a Área de Apoio. PIN errado não mostra erro: o texto só filtra as notas |
| Saída Rápida | Botão "Sair" em **todas** as telas da Área de Apoio (inclusive os formulários de novo contato e novo registro) bloqueia na hora (`POST /auth/lock` em segundo plano) e volta à lista de notas carregada da API |
| Contatos de apoio e Registros sigilosos | CRUD real em `/contatos` e `/registros` |
| Alerta silencioso | Registra a solicitação em `POST /alertas` (não envia SMS/WhatsApp) |
| Data Science | Card "Indicador de risco estimado" no `SecretHub` (`GET /indicador-risco`) com aviso de estimativa acadêmica |

O token fica **apenas em memória**: ao fechar o app é preciso entrar de novo. Isso evita deixar credenciais gravadas no aparelho.

## 2.1 Base pública e Data Science

- **Base:** notificações de violência contra a mulher — SES/MG (SINAN), 2026. Link oficial: https://dados.mg.gov.br/dataset/violencia_ses (dados abertos de saúde pública / uso acadêmico). Arquivos em `dataScience/sciencedata/`.
- **Pergunta do modelo:** dado o perfil de um caso, qual a chance de a violência **já ter ocorrido outras vezes** (`out_vezes`)?
- **Método:** Regressão Logística e Random Forest, separação 80/20 estratificada, **validação cruzada estratificada de 5 folds** (média ± desvio-padrão) e avaliação no teste.
- **Métricas (Regressão Logística):**

| Métrica | Validação cruzada (5 folds) | Teste |
|---|---|---|
| Acurácia | 61,8% ± 0,8 | 62,5% |
| Precisão | 61,5% ± 0,6 | 62,4% |
| Recall | 80,1% ± 0,7 | 79,1% |
| F1-Score | 69,6% ± 0,6 | 69,8% |
| AUC-ROC | 0,643 ± 0,009 | 0,648 |

  Um classificador que sempre responde "Sim" acerta 54,6%; o modelo supera esse piso de forma **moderada**. A Random Forest chega a AUC 0,68 no teste. Detalhes, matriz de confusão e gráficos estão no notebook.
- **Como o app usa o modelo:** o notebook exporta `backend/data/modelo_ds.json`; a API aplica a fórmula ao perfil derivado dos registros da usuária e devolve Baixo / Moderado / Alto. O app só coleta o tipo da ocorrência, então apenas `viol_fisic` e `viol_psico` variam; as demais variáveis entram pela média da base.
- **Limites:** o indicador mede a chance de repetição em casos parecidos, **não a gravidade nem o perigo atual**; uma faixa baixa não significa ausência de risco. Há subnotificação e viés de preenchimento na base.

> **Aviso:** este indicador é uma estimativa estritamente acadêmica gerada por modelo estatístico/aprendizado de máquina a partir de dados públicos (SES/MG - SINAN) e não substitui avaliação profissional, policial ou médica. Ligue **180** (Central de Atendimento à Mulher) ou **190** (emergência).

## 3. Estrutura da API e banco

```text
backend/
├── src/
│   ├── middleware/       # autenticação e tratamento de erros
│   ├── routes/           # rotas REST por recurso (auth, notas, contatos, registros, alertas, indicador-risco)
│   ├── utils/            # validações, erros HTTP e aplicação do modelo de Data Science
│   ├── app.js
│   ├── config.js
│   ├── database.js
│   └── server.js
├── data/
│   └── modelo_ds.json     # parâmetros e métricas do modelo (gerado pelo notebook)
├── database/
│   ├── init/              # scripts SQL executados em ordem
│   └── SCHEMA.md          # documentação do modelo relacional
├── .env.example
└── package.json
```

### Entidades

- `USUARIO`: perfil, telefone, hash da senha e hash do PIN.
- `NOTA_DISFARCE`: notas comuns do bloco de notas.
- `CONTATO_APOIO`: contatos de confiança, relação e prioridade.
- `REGISTRO_SIGILOSO`: descrição, tipo e data/hora do episódio.
- `ALERTA_EMERGENCIA`: histórico de solicitações de alerta e coordenadas opcionais.

**Relacionamentos:** `USUARIO` 1:N `NOTA_DISFARCE`, 1:N `CONTATO_APOIO`, 1:N `REGISTRO_SIGILOSO` e 1:N `ALERTA_EMERGENCIA`. Cada tabela filha tem a chave estrangeira `id_usuario` com `ON DELETE CASCADE`, e a API sempre filtra pelo usuário do token, então uma conta nunca lê, altera ou apaga dados de outra. O indicador de risco cruza `USUARIO` → `REGISTRO_SIGILOSO` para montar o perfil.

As quatro primeiras entidades correspondem à modelagem da documentação. `senha_hash`, datas de atualização, relação/prioridade e `ALERTA_EMERGENCIA` foram acrescentados para suportar o fluxo real da aplicação. A senha de login e o PIN são armazenados como hashes bcrypt, nunca em texto puro.

## 4. Como iniciar o banco de dados com Docker

O projeto **não possui Dockerfile, docker-compose.yml ou outros arquivos de configuração Docker**. O container do MySQL é criado diretamente pelo comando `docker run`, e este README contém todo o procedimento.

### Pré-requisitos

- Docker Desktop instalado e em execução (Windows, macOS ou Linux).
- Terminal aberto na pasta raiz do repositório (a pasta que contém `backend/`).

### Passo 1 — Criar o volume persistente

O volume mantém os dados mesmo quando o container é parado ou removido:

```bash
docker volume create bloco_notas_mysql_data
```

### Passo 2 — Iniciar o MySQL

Escolha o comando adequado ao terminal utilizado. O comando monta a pasta `backend/database/init` diretamente no diretório de inicialização do MySQL. Assim, os arquivos SQL são executados automaticamente na primeira inicialização do volume.

**Windows PowerShell:**

```powershell
docker run -d --name bloco-notas-mysql `
  -p 3306:3306 `
  -e MYSQL_ROOT_PASSWORD="123456" `
  -e MYSQL_DATABASE="bloco_notas" `
  -e MYSQL_USER="bloco_app" `
  -e MYSQL_PASSWORD="123456" `
  -e TZ="America/Sao_Paulo" `
  -v bloco_notas_mysql_data:/var/lib/mysql `
  -v "${PWD}/backend/database/init:/docker-entrypoint-initdb.d:ro" `
  --health-cmd="mysqladmin ping -h localhost -uroot -p123456" `
  --health-interval=10s --health-timeout=5s --health-retries=10 `
  mysql:8.4
```

**Linux / macOS / Git Bash:**

```bash
docker run -d --name bloco-notas-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD='uma_senha_root_local_forte' \
  -e MYSQL_DATABASE='bloco_notas' \
  -e MYSQL_USER='bloco_app' \
  -e MYSQL_PASSWORD='uma_senha_local_forte' \
  -e TZ='America/Sao_Paulo' \
  -v bloco_notas_mysql_data:/var/lib/mysql \
  -v "$(pwd)/backend/database/init:/docker-entrypoint-initdb.d:ro" \
  --health-cmd='mysqladmin ping -h localhost -uroot -puma_senha_root_local_forte' \
  --health-interval=10s --health-timeout=5s --health-retries=10 \
  mysql:8.4
```

Substitua as senhas de exemplo por senhas próprias. Mantenha a senha de `MYSQL_PASSWORD` igual a `DB_PASSWORD` no arquivo `backend/.env`.

### Passo 3 — Verificar a inicialização

```bash
docker ps
docker logs -f bloco-notas-mysql
```

Aguarde o MySQL concluir a inicialização. Para sair da visualização dos logs, pressione `Ctrl+C`; isso não para o container. Também é possível consultar o estado de saúde com:

```bash
docker inspect --format='{{.State.Health.Status}}' bloco-notas-mysql
```

### Passo 4 — Conferir as tabelas

```bash
docker exec -it bloco-notas-mysql mysql -u bloco_app -p bloco_notas
```

Digite a senha definida em `MYSQL_PASSWORD`. No prompt do MySQL:

```sql
SHOW TABLES;
DESCRIBE USUARIO;
DESCRIBE NOTA_DISFARCE;
DESCRIBE CONTATO_APOIO;
DESCRIBE REGISTRO_SIGILOSO;
DESCRIBE ALERTA_EMERGENCIA;
EXIT;
```

### Passo 5 — Configurar e iniciar a API

Abra outro terminal e entre na pasta `backend`:

```bash
cd backend
```

Copie `.env.example` para `.env` (PowerShell: `Copy-Item .env.example .env`; Linux/macOS: `cp .env.example .env`) e configure as variáveis abaixo. Use a mesma senha definida em `MYSQL_PASSWORD` no passo anterior:

```env
PORT=3333
CORS_ORIGIN=*
JWT_SECRET=123456789123456789123456789123456789
JWT_EXPIRES_IN=2h
BCRYPT_ROUNDS=12
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=bloco_notas
DB_USER=bloco_app
DB_PASSWORD=123456
DB_CONNECTION_LIMIT=10
```

Instale as dependências e inicie a API:

```bash
npm install
npm run dev
```

Para iniciar sem modo de desenvolvimento, use `npm start`. A API ficará disponível em `http://localhost:3333`; teste `http://localhost:3333/health`.

### Passo 6 — Parar, iniciar ou remover o container

Parar o banco sem apagar os dados:

```bash
docker stop bloco-notas-mysql
```

Iniciar novamente o mesmo container:

```bash
docker start bloco-notas-mysql
```

Remover somente o container (o volume com os dados é preservado):

```bash
docker rm -f bloco-notas-mysql
```

Para criar novamente o container após removê-lo, repita o comando do Passo 2. O volume `bloco_notas_mysql_data` continuará contendo os dados existentes.

**Atenção:** os scripts SQL em `backend/database/init/` são executados automaticamente apenas quando o banco é inicializado pela primeira vez em um volume vazio. Alterar um arquivo SQL depois disso não modifica tabelas já existentes. Para recriar o banco do zero e apagar permanentemente os dados locais, remova também o volume:

```bash
docker volume rm bloco_notas_mysql_data
```

Execute esse último comando somente se tiver certeza de que pode perder todos os dados armazenados.

## 5. Executar o aplicativo React Native contra a API

Ordem completa para rodar o sistema de ponta a ponta:

```bash
# 1) Banco: siga a seção 4 (docker run) e confira as tabelas.

# 2) Back-end (terminal 1)
cd backend
cp .env.example .env        # ajuste DB_PASSWORD se necessário
npm install && npm start    # http://localhost:3333/health

# 3) App Expo (terminal 2, na raiz do repositório)
npm install && npx expo start
```

O endereço da API fica em `src/services/api.js` e depende de onde o app roda:

- Android Emulator: `http://10.0.2.2:3333/api` (padrão).
- iOS Simulator: `http://localhost:3333/api` (padrão).
- Celular físico: defina `EXPO_PUBLIC_API_URL=http://IP_DO_SEU_COMPUTADOR:3333/api` (veja `.env.example`; celular e computador na mesma rede Wi-Fi) antes de rodar `npx expo start`.

Fluxo de autenticação em duas etapas: `POST /api/auth/login` retorna um token sem acesso à área restrita; `POST /api/auth/unlock` valida o PIN e retorna um token com permissão para contatos, registros, alertas e indicador; `POST /api/auth/lock` volta ao token normal (Saída Rápida). O app cuida da troca de token em `src/config/AuthContext.js`. O token restrito expira conforme `JWT_EXPIRES_IN`.

### Roteiro de teste de ponta a ponta

1. Criar conta (telefone, senha com 8+ caracteres, PIN de 4 a 8 números diferente da senha) → abre a lista de notas.
2. Criar, editar, buscar e excluir notas (tudo gravado na API).
3. Na busca, digitar o PIN e confirmar no teclado → abre a Área de Apoio.
4. Cadastrar contato e registro; voltar ao Início e conferir o card do indicador (com o aviso acadêmico).
5. Tocar em **Sair** → retorna imediatamente à lista de notas vinda da API.

## 6. Endpoints da API

Todas as rotas usam prefixo `/api`. Salvo cadastro, login, healthcheck e desbloqueio, envie JSON com `Content-Type: application/json`.

### Autenticação e perfil

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/health` | Público | Estado da API |
| POST | `/auth/register` | Público | Cria usuário |
| POST | `/auth/login` | Público | Autentica telefone e senha |
| POST | `/auth/unlock` | Token de login | Valida PIN e emite token restrito |
| POST | `/auth/lock` | Token válido | Volta ao token normal (Saída Rápida) |
| GET | `/auth/me` | Token válido | Consulta perfil |
| PATCH | `/auth/me` | Token válido | Atualiza nome e/ou telefone |
| POST | `/auth/change-password` | Token válido | Altera senha de login |
| POST | `/auth/change-pin` | Token válido | Altera PIN do cofre |

Exemplo de cadastro:

```json
{
  "nome": "Ana",
  "telefone": "(43) 99999-9999",
  "senha": "umaSenhaSegura123",
  "codigoAcesso": "4826"
}
```

Exemplo de login: `{"telefone":"(43) 99999-9999","senha":"umaSenhaSegura123"}`. Desbloqueio: `{"codigoAcesso":"4826"}`.

### Notas (disfarce)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/notas` | Lista notas; aceita busca opcional `?q=texto` |
| POST | `/notas` | Cria nota (`title`, `content`) |
| GET | `/notas/:id` | Consulta uma nota |
| PUT | `/notas/:id` | Atualiza nota (`title`, `content`) |
| DELETE | `/notas/:id` | Exclui nota |

### Área restrita — exige token desbloqueado

| Método | Rota | Descrição |
|---|---|---|
| GET | `/contatos` | Lista contatos da rede de apoio |
| GET | `/contatos/:id` | Consulta um contato (404 se não for do usuário) |
| POST | `/contatos` | Cria contato (`name`, `phone`, `relation?`, `receiveAlerts?`, `priority?`) |
| PUT | `/contatos/:id` | Atualiza contato |
| DELETE | `/contatos/:id` | Exclui contato |
| GET | `/registros` | Lista registros sigilosos |
| POST | `/registros` | Cria registro (`description`, `date`, `type?`) |
| GET | `/registros/:id` | Consulta registro |
| PUT | `/registros/:id` | Atualiza registro |
| DELETE | `/registros/:id` | Exclui registro |
| POST | `/alertas` | Registra solicitação de alerta (`mensagem?`, `latitude?`, `longitude?`) |
| GET | `/alertas` | Lista solicitações anteriores |
| GET | `/indicador-risco` | Indicador do modelo de Data Science (Baixo/Moderado/Alto), métricas e aviso acadêmico |

Exemplo de contato:

```json
{
  "name": "Pessoa de confiança",
  "phone": "(43) 98888-7777",
  "relation": "Amiga",
  "receiveAlerts": true,
  "priority": 1
}
```

Exemplo de registro:

```json
{
  "description": "Descrição do episódio...",
  "type": "Ameaça verbal",
  "date": "2026-10-24T18:30:00.000Z"
}
```

Exemplo de solicitação de alerta:

```json
{
  "mensagem": "Preciso de ajuda. Entre em contato comigo.",
  "latitude": -23.3103,
  "longitude": -51.1628
}
```

A API valida que latitude e longitude sejam informadas juntas. A localização é opcional.

## 7. Segurança e limites conhecidos

- Senhas e PINs são armazenados com bcrypt; tokens JWT têm expiração.
- As consultas são parametrizadas e cada CRUD filtra pelo ID do usuário autenticado, evitando acesso aos dados de outra conta.
- Contatos, registros e alertas exigem token com a área restrita desbloqueada.
- Há cabeçalhos de segurança, limite de requisições nas rotas de autenticação e limite de tamanho do corpo JSON.
- Use HTTPS, segredo JWT forte, CORS restrito, backups protegidos e gestão segura de credenciais em produção.
- **O endpoint de alerta apenas grava a solicitação no banco. Ele não envia SMS, WhatsApp, e-mail nem localização para terceiros.** Para envio real, será necessário integrar um provedor, definir consentimento e testar o fluxo com cuidado.
- O aplicativo guarda o token apenas em memória (nada é gravado no aparelho). Se for persistir a sessão no futuro, use `expo-secure-store` e avalie o risco antes de usar AsyncStorage.
- O indicador de risco é uma estimativa acadêmica com poder preditivo moderado (AUC ≈ 0,65): não deve ser usado para decisões reais.
- Este projeto é um protótipo acadêmico, não substitui serviços de emergência ou uma avaliação profissional de segurança.

## 8. Matriz de responsabilidades (Entrega 4)

> Grupo **NoteS**. Preencha a coluna "Responsável" antes de entregar: o histórico de commits do GitHub deve confirmar a autoria.

| Entregável | Arquivos principais | Responsável |
|---|---|---|
| Back-end Node.js/Express e rotas REST | `backend/src/` | _a preencher_ |
| Modelagem do banco SQL e relacionamentos | `backend/database/` | _a preencher_ |
| Camada de disfarce com API (login, cadastro, notas, gatilho do PIN) | `src/screens/Login`, `Register`, `NotesList`, `NoteEditor`, `src/config/NotesContext.js` | _a preencher_ |
| Área de Apoio (contatos, registros, alerta, Saída Rápida) | `src/screens/SecretHub`, `Contacts`, `Records` | _a preencher_ |
| Data Science: qualidade dos dados e tratamento | `dataScience/` (seções 3 e 4) | Matheus Henrique Evaristo Souza |
| Data Science: EDA e plano de modelagem | `dataScience/` (seções 5 e 6) | Gabriel de Paiva Messias Silva |
| Data Science: modelagem e validação cruzada | `dataScience/` (seção 7) | _a preencher_ |
| Integração do modelo no app | `backend/src/routes/indicator.routes.js`, `src/components/RiskIndicatorCard.js` | _a preencher_ |
| Documentação e `USO_IA.md` | `README.md`, `USO_IA.md` | _a preencher_ |

### Exigências da entrega → onde estão

| Exigência | Onde está |
|---|---|
| Telas do disfarce integradas à API, sem dados mocados | `src/screens/` (Login, Register, NotesList, NoteEditor), `src/config/NotesContext.js`, `src/services/api.js` |
| Gatilho camuflado (PIN na busca) e Saída Rápida | `NotesListScreen`, `src/config/useQuickExit.js`, `src/components/BackHeader.js` |
| API REST (GET, GET por id, POST, PUT, DELETE) com validação e erros 400/404/500 | `backend/src/routes/`, `backend/docs/API.md` |
| Governança da base (link oficial SES/MG) | `dataScience/README.md` e seção 1 do notebook |
| Modelo supervisionado, validação cruzada estratificada (5 folds) e métricas completas | `dataScience/Entrega2_DS_Modelo.ipynb`, seção 7 |
| Dependências do notebook | `dataScience/requirements.txt` |
| Resultado do modelo exibido no app com aviso acadêmico | `GET /indicador-risco`, `src/components/RiskIndicatorCard.js`, seção 7.7 do notebook |
| Uso de IA | `USO_IA.md` |

## 9. Documentação adicional

- `backend/README.md`: instruções específicas da API e banco.
- `backend/docs/API.md`: referência das rotas, autenticação e exemplos.
- `backend/database/init/` e `backend/database/SCHEMA.md`: esquema SQL por entidade.
- `dataScience/README.md`: base, método, métricas e como reexecutar o notebook.
- `USO_IA.md`: registro do uso de Inteligência Artificial.

# Projeto Integrador — Bloco de Notas Camuflado

**Tema:** Aplicativo de apoio camuflado para mulheres em situação de violência.  
**Aplicativo mobile:** React Native + Expo.  
**API:** Node.js + Express.  
**Banco de dados:** MySQL 8.4 (executado em container Docker; sem arquivos Docker dentro da API).

## 1. Sobre o projeto

O aplicativo mantém uma interface de bloco de notas comum e oferece uma área restrita de apoio, com contatos de confiança, diário sigiloso e solicitação de alerta. A área restrita é desbloqueada por um PIN separado da senha de login.

## 2. Estado atual do aplicativo mobile

A implementação mobile já contém as telas de cadastro/login, lista e editor de notas, painel de apoio, contatos e registros. Entretanto, na versão recebida, as notas ainda são dados simulados (`MOCK_NOTES`), os contatos e registros ficam apenas no estado em memória dos respectivos Contexts, e o login/cadastro navega sem autenticar no servidor. O botão de alerta também contém um TODO para envio real. A API entregue nesta versão cria a camada de persistência e os endpoints; a conexão das telas React Native com esses endpoints ainda precisa ser feita.

## 3. Estrutura da API e banco

```text
backend/
├── src/
│   ├── middleware/       # autenticação e tratamento de erros
│   ├── routes/           # rotas REST por recurso
│   ├── utils/            # validações e erros HTTP
│   ├── app.js
│   ├── config.js
│   ├── database.js
│   └── server.js
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
  --health-cmd="mysqladmin ping -h localhost -uroot -puma_senha_root_local_forte" `
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

O endereço depende de onde o app está rodando:

- Android Emulator: `http://10.0.2.2:3333`.
- iOS Simulator: `http://localhost:3333`.
- Celular físico: `http://IP_LOCAL_DO_SEU_COMPUTADOR:3333` (celular e computador na mesma rede Wi-Fi).

Centralize a URL em uma configuração do app e envie o token recebido no login no cabeçalho `Authorization: Bearer TOKEN`. Exemplo básico:

```javascript
const API_URL = 'http://10.0.2.2:3333'; // Android Emulator

export async function apiRequest(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Não foi possível concluir a solicitação.');
  }
  return response.status === 204 ? null : response.json();
}
```

O fluxo de autenticação é dividido em duas etapas: `POST /api/auth/login` retorna um token ainda sem acesso à área restrita; `POST /api/auth/unlock` valida o PIN e retorna um novo token com permissão para contatos, registros e alertas. Após desbloquear, substitua o token anterior pelo novo. O token de área restrita também expira conforme `JWT_EXPIRES_IN`.

## 6. Endpoints da API

Todas as rotas usam prefixo `/api`. Salvo cadastro, login, healthcheck e desbloqueio, envie JSON com `Content-Type: application/json`.

### Autenticação e perfil

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/health` | Público | Estado da API |
| POST | `/auth/register` | Público | Cria usuário |
| POST | `/auth/login` | Público | Autentica telefone e senha |
| POST | `/auth/unlock` | Token de login | Valida PIN e emite token restrito |
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
- O aplicativo mobile ainda precisa trocar seus dados simulados/Context em memória por chamadas à API e guardar tokens de forma segura (por exemplo, SecureStore). Não armazene token em AsyncStorage sem avaliar o risco.
- Este projeto é um protótipo acadêmico, não substitui serviços de emergência ou uma avaliação profissional de segurança.

## 8. Documentação adicional

- `backend/README.md`: instruções específicas da API e banco.
- `backend/docs/API.md`: referência das rotas, autenticação e exemplos.
- `backend/database/init/`: esquema SQL separado por entidade.

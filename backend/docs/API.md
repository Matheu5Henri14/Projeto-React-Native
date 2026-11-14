# Referência da API

Base URL local: `http://localhost:3333/api`. Respostas são JSON, exceto exclusões bem-sucedidas (`204 No Content`). Erros usam `{ "error": "mensagem" }`.

## Autorização

Envie `Authorization: Bearer <token>`. O login emite token normal; o PIN é validado em `/auth/unlock`, que emite outro token com claim `unlocked=true`. Substitua o token antigo pelo novo para usar `/contatos`, `/registros` e `/alertas`. Os endpoints de notas aceitam token normal.

## Endpoints

| Método | Caminho | Permissão | Corpo / resultado |
|---|---|---|---|
| GET | `/health` | Público | `{status, service}` |
| POST | `/auth/register` | Público | `{nome, telefone, senha, codigoAcesso}` |
| POST | `/auth/login` | Público | `{telefone, senha}` |
| POST | `/auth/unlock` | Token normal | `{codigoAcesso}` |
| POST | `/auth/lock` | Token | Sem corpo. Devolve `{unlocked:false, token}` com token normal (Saída Rápida) |
| GET | `/auth/me` | Token | Perfil e estado `unlocked` |
| PATCH | `/auth/me` | Token | `{nome? , telefone?}` |
| POST | `/auth/change-password` | Token | `{senhaAtual, novaSenha}` |
| POST | `/auth/change-pin` | Token | `{pinAtual, novoPin}` |
| GET | `/notas?q=termo` | Token | Lista/busca notas |
| POST | `/notas` | Token | `{title, content?}` |
| GET | `/notas/:id` | Token | Consulta nota |
| PUT | `/notas/:id` | Token | `{title, content?}` |
| DELETE | `/notas/:id` | Token | Remove nota |
| GET | `/contatos` | Desbloqueado | Lista contatos |
| GET | `/contatos/:id` | Desbloqueado | Consulta um contato (404 se não for do usuário) |
| POST | `/contatos` | Desbloqueado | `{name, phone, relation?, receiveAlerts?, priority?}` |
| PUT | `/contatos/:id` | Desbloqueado | Mesmo corpo de criação |
| DELETE | `/contatos/:id` | Desbloqueado | Remove contato |
| GET | `/registros` | Desbloqueado | Lista registros |
| POST | `/registros` | Desbloqueado | `{description, date, type?}` |
| GET | `/registros/:id` | Desbloqueado | Consulta registro |
| PUT | `/registros/:id` | Desbloqueado | Mesmo corpo de criação |
| DELETE | `/registros/:id` | Desbloqueado | Remove registro |
| POST | `/alertas` | Desbloqueado | `{mensagem?, latitude?, longitude?}` |
| GET | `/alertas` | Desbloqueado | Histórico de solicitações |
| GET | `/indicador-risco` | Desbloqueado | Indicador do modelo de Data Science (Baixo/Moderado/Alto) + métricas + aviso acadêmico |

## Indicador de risco (modelo de Data Science)

`GET /indicador-risco` lê os registros sigilosos da usuária, monta um perfil (`viol_fisic` e `viol_psico` a partir do tipo do registro; demais variáveis entram pela média da base) e aplica a Regressão Logística exportada por `dataScience/Entrega2_DS_Modelo.ipynb` em `backend/data/modelo_ds.json`.

Resposta (resumo):

```json
{
  "disponivel": true,
  "nivel": "Moderado",
  "probabilidadeEstimada": 52.7,
  "registrosAnalisados": 3,
  "variaveisUsadas": [{ "variavel": "viol_fisic", "valor": "Não" }],
  "mensagem": "Estimativa da chance de a violência já ter ocorrido outras vezes ...",
  "ressalva": "Mede a chance estimada de repetição, não a gravidade ...",
  "aviso": "Estimativa estritamente acadêmica gerada por modelo estatístico ...",
  "modelo": { "tipo": "LogisticRegression (scikit-learn)", "validacaoCruzada": { "folds": 5 }, "teste": {} }
}
```

Sem registros, devolve `disponivel: false` e `nivel: null`. O resultado é uma **estimativa acadêmica** e não substitui avaliação profissional, policial ou médica.

## Validações principais

- Telefone: 10 ou 11 dígitos (com DDD), aceitando máscara na entrada.
- Senha: mínimo de 8 caracteres.
- PIN: 4 a 8 dígitos numéricos e diferente da senha.
- Contato: prioridade de 1 a 5; `receiveAlerts` controla se o contato faz parte da lista de destinatários pretendidos.
- Registro: data válida, não futura; descrição obrigatória.
- Coordenadas: latitude entre -90 e 90; longitude entre -180 e 180; devem ser enviadas juntas.
- Recursos sempre pertencem ao usuário identificado pelo token. Um ID de outro usuário não permite leitura, edição ou exclusão.

## Exemplos cURL

Cadastro:

```bash
curl -X POST http://localhost:3333/api/auth/register \\
  -H 'Content-Type: application/json' \\
  -d '{"nome":"Ana","telefone":"(43) 99999-9999","senha":"senhaForte123","codigoAcesso":"4826"}'
```

Login:

```bash
curl -X POST http://localhost:3333/api/auth/login \\
  -H 'Content-Type: application/json' \\
  -d '{"telefone":"(43) 99999-9999","senha":"senhaForte123"}'
```

Criar nota (substitua TOKEN):

```bash
curl -X POST http://localhost:3333/api/notas \\
  -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' \\
  -d '{"title":"Lista de compras","content":"Leite, pão e café"}'
```

## Resposta de alerta: importante

`POST /alertas` persiste uma solicitação e retorna `status: "registrado"`. Não realiza envio de mensagens. A integração com SMS/WhatsApp e eventual serviço de geolocalização deve ser implementada separadamente, com autorização explícita, credenciais protegidas e testes próprios.

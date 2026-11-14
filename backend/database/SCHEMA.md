# Esquema relacional do banco

Banco: `bloco_notas` — MySQL 8.4 / InnoDB / UTF-8 (`utf8mb4`). Os scripts executáveis estão separados em `init/` e são aplicados em ordem alfabética.

## Diagrama lógico

```text
                         ┌──────────────────────┐
                         │        USUARIO        │
                         │ PK id_usuario        │
                         └──────────┬───────────┘
             ┌─────────────────────┼───────────────────────┬──────────────────┐
             │ 1:N                 │ 1:N                   │ 1:N              │ 1:N
┌────────────▼──────────┐ ┌────────▼───────────┐ ┌─────────▼────────────┐ ┌──▼──────────────────┐
│    NOTA_DISFARCE      │ │   CONTATO_APOIO    │ │  REGISTRO_SIGILOSO   │ │  ALERTA_EMERGENCIA  │
│ PK id_nota            │ │ PK id_contato      │ │ PK id_registro       │ │ PK id_alerta        │
│ FK id_usuario         │ │ FK id_usuario      │ │ FK id_usuario        │ │ FK id_usuario       │
└───────────────────────┘ └────────────────────┘ └──────────────────────┘ └─────────────────────┘
```

## Tabelas e finalidade

- `USUARIO`: identificação, telefone único, `senha_hash` para autenticação e `senha_cofre` para PIN; ambos armazenam hash bcrypt. `ativo` permite desativar a conta.
- `NOTA_DISFARCE`: notas comuns, título e conteúdo, com datas de criação/atualização.
- `CONTATO_APOIO`: nome, telefone, relação, prioridade de 1 a 5 e `receber_alertas` para indicar se a pessoa deve ser considerada na rede de alerta.
- `REGISTRO_SIGILOSO`: descrição, tipo e data/hora do fato, além das datas de criação/atualização.
- `ALERTA_EMERGENCIA`: registro da solicitação, mensagem opcional, coordenadas opcionais, estado de processamento e data.

## Integridade e exclusão

Todas as tabelas filhas possuem FK para `USUARIO(id_usuario)` com `ON DELETE CASCADE`. Os endpoints também filtram por `id_usuario` do token. Telefones são únicos por usuário; IDs são auto incremento. Índices apoiam consultas por usuário e data.

## Ordem dos scripts

1. `01_usuarios.sql`
2. `02_notas_disfarce.sql`
3. `03_contatos_apoio.sql`
4. `04_registros_sigilosos.sql`
5. `05_alertas.sql`
6. `06_relacionamentos.sql` (documentação complementar)

A documentação inicial descrevia quatro tabelas. `senha_hash` foi incluída porque a tela mobile existente possui senha de login além do PIN; `ALERTA_EMERGENCIA` foi incluída para persistir a solicitação de alerta prevista na tela inicial. `receber_alertas` corresponde ao seletor “Receber meus alertas” já existente no formulário de contatos.

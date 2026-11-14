# Data Science — Violência contra a Mulher (SES/MG 2026)

Pacote de Data Science do Projeto Integrador (Entregas 2, 3 e 4), no padrão do exemplo Hotel Aurora:
`Entrega2_DS_Modelo.ipynb` (notebook **executado do início ao fim**), `README.md` e `requirements.txt`.

## Fonte dos dados

- **Base:** notificações de violência contra a mulher — Secretaria de Estado de Saúde de Minas Gerais (SES/MG - SINAN), 2026.
- **Link oficial:** https://dados.mg.gov.br/dataset/violencia_ses
- **Licença:** dados abertos de saúde pública / uso acadêmico.
- **Arquivos:** `sciencedata/dados_violencia_mulheres_ses_2026.csv` (bruto, 38.760 linhas) e `sciencedata/dados_tratados.csv` (tratado, 38.624 linhas).
- **LGPD:** a base não traz identificadores diretos (nome, CPF, endereço). Não cruze muitas colunas para tentar identificar pessoas.

## Conteúdo do notebook

1. Governança, ética e LGPD (ficha da base com o link oficial)
2. Carga e dicionário de dados
3. Diagnóstico de qualidade (5 dimensões)
4. Tratamento (padronização, nulos, duplicatas, imputação, outliers)
5. Análise exploratória (EDA)
6. Plano da modelagem
7. **Modelagem preditiva com validação cruzada (Entregas 3 e 4)**, incluindo 7.7 (conferência com a API)
8. Conclusões e checklist

## Modelo (seção 7)

- **Alvo:** `out_vezes` — a violência já havia ocorrido outras vezes? (1 = Sim, 0 = Não). Linhas sem resposta ficam fora do treino (29.869 linhas com alvo).
- **Variáveis:** idade, raça/cor, local, lesão autoprovocada, tipos de violência (física/psicológica/sexual), nº de envolvidos, sexo do autor, orientação sexual e identidade de gênero. Datas e município ficam de fora.
- **Modelos:** Regressão Logística e Random Forest (scikit-learn), mais um baseline (classe majoritária).
- **Validação:** separação 80/20 estratificada **antes** de escalonar/codificar; `StratifiedKFold` com 5 folds no treino, reportando média ± desvio-padrão; avaliação final no teste (acurácia, precisão, recall, F1, AUC-ROC, matriz de confusão e curva ROC).
- **Resultado (teste, Regressão Logística):** acurácia 62,5%, precisão 62,4%, recall 79,1%, F1 69,8%, AUC 0,65. O baseline acerta 54,6%. Ou seja: **há sinal, mas moderado**. Random Forest tem AUC 0,68.
- **Faixas de risco** (Baixo / Moderado / Alto): tercis da probabilidade prevista no treino; no teste a taxa real de repetição sobe de 39,5% (Baixo) para 58,7% (Moderado) e 66,9% (Alto).

## Exigências → onde estão

| Exigência | Onde está |
|---|---|
| Link oficial da base | Seção 1 do notebook e este README |
| Modelo supervisionado + baseline | Seção 7 (Baseline, Regressão Logística, Random Forest) |
| Validação cruzada | Seção 7, `StratifiedKFold` com 5 folds (média ± desvio-padrão) |
| Métricas e matriz de confusão | Seção 7 (acurácia, precisão, recall, F1, AUC, matriz, curva ROC) |
| Dependências | `requirements.txt` |
| Notebook executado | Todas as células têm saída gravada |
| Integração com o app | Seção 7.7 e `backend/data/modelo_ds.json` |

## Integração com o aplicativo

A última célula grava `../backend/data/modelo_ds.json` (coeficientes da Regressão Logística, frequências por categoria, cortes das faixas e todas as métricas). A seção 7.7 do notebook confere a integração: para 4 perfis de uso do app, a probabilidade calculada pelo `scikit-learn` e a calculada pela fórmula da API são idênticas (diferença máxima 0,0), e o card do app mostra esses mesmos números. A API (`GET /api/indicador-risco`) aplica essa fórmula ao perfil derivado dos registros da usuária, e o app exibe o resultado no card do `SecretHub`, sempre com o **aviso de estimativa acadêmica**.

> **Aviso:** o indicador é uma estimativa estatística a partir de dados públicos de notificação. Mede a chance de repetição em casos parecidos, não a gravidade nem o perigo atual, e **não substitui** avaliação profissional, policial ou médica. Em risco: **190**; orientação: **180**.

## Como executar

```bash
cd dataScience
python -m venv .venv
# Windows: .venv\Scripts\activate   |   Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
jupyter notebook Entrega2_DS_Modelo.ipynb
```

Execute todas as células (*Run All*) a partir da pasta `dataScience/`, pois os caminhos são relativos. No Google Colab, envie o CSV quando a célula de carga pedir. Após rodar, confira que `backend/data/modelo_ds.json` foi atualizado.

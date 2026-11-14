# Registro de Uso de Inteligência Artificial (USO_IA.md)

Este documento regista o uso de ferramentas de Inteligência Artificial (ChatGPT, Gemini, Claude, etc.) no apoio ao desenvolvimento do Projeto Integrador, conforme as diretrizes da disciplina.

## 1. Ferramentas Utilizadas pela Equipa
- **ChatGPT / Gemini:** Utilizados na Entrega 1 para auxiliar na estruturação lógica do DER, modelagem de tabelas e definição do conceito do disfarce, e na Entrega 2 para apoiar a criação da arquitetura de componentes em React Native (Expo), estilização com Flexbox, listas (`FlatList`), configuração de rotas (`Stack Navigator`) e lógica do mecanismo de entrada do disfarce.

## 2. Prompts e Aprendizados Registados

### Exemplo 1 - Modelagem de Dados (DER)
- **Prompt Inicial:** "Crie tabelas SQL para um app de apoio à mulher vítima de violência."
- **Problema Encontrado:** O resultado veio muito genérico e sem especificar os tipos de dados restritos ou chaves estrangeiras adequadas para um sistema mobile seguro.
- **Prompt Ajustado:** "Crie o DER detalhado com os campos para um app de bloco de notas camuflado que guarda contactos de emergência e registos sigilosos. Utilize tipos de dados como INT, VARCHAR(n), TEXT e DATETIME, definindo explicitamente as chaves primárias (PK) e estrangeiras (FK)."
- **Aprendizado da Equipa:** Especificar o contexto de segurança e os tipos de dados exatos evitou retrabalho na modelagem e garantiu que o DER ficasse pronto para a estruturação lógica.

### Exemplo 2 - Componentização e Telas do Disfarce (Entrega 2 - Telas 1, 2 e 3)
- **Prompt Inicial:** "Crie o código em React Native para uma tela de cadastro e login de um bloco de notas."
- **Problema Encontrado:** O código gerado inicialmente concentrava todos os inputs, botões e estilos num único ficheiro monolítico, sem seguir a estrutura de pastas (`src/components` e `src/screens`) e sem fidelidade visual ao protótipo do Figma.
- **Prompt Ajustado:** "Quero um código em React Native (Expo) que faça exatamente igual às imagens do protótipo no Figma (Tela 1 - Cadastro, Tela 2 - Login e Tela 3 - Lista de Notas do Bloco de Notas) e esteja dividido em componentes reutilizáveis (`CustomInput`, `PrimaryButton`, `PrototypeAlert` e `NoteCard`), utilizando Flexbox, `FlatList` com busca e ajuste de `SafeAreaView` para Android."
- **Aprendizado da Equipa:** Enviar a referência visual do protótipo junto com a exigência de componentização permitiu reaproveitar os mesmos componentes de input, botão e alerta em várias telas, reduzindo código duplicado e facilitando a manutenção na árvore de pastas do projeto.

### Exemplo 3 - Mecanismo de Entrada do Disfarce e Teclado Numérico (Entrega 2 - Tela 4)
- **Prompt Inicial:** "Como mudar de tela quando o utilizador digitar uma senha numa nota no React Native?"
- **Problema Encontrado:** A sugestão inicial utilizava um campo `TextInput` comum com botão de submissão visível, o que quebrava a camuflagem da nota mestre ("Lembretes") definida no protótipo.
- **Prompt Ajustado:** "Implemente a Tela 4 (Editor de Notas / Tela de Acesso) conforme o Figma, criando um componente de teclado numérico (`NumericKeypad`) na parte inferior que preenche o PIN mascarado (`• • • •`) no final da nota mestre e aciona automaticamente o `navigation.navigate('SupportArea')` ao completar os 4 dígitos."
- **Aprendizado da Equipa:** Controlar o estado local do PIN (`useState`) verificando o comprimento da string a cada dígito inserido permitiu criar uma transição fluida e discreta do disfarce para a Área de Apoio usando o React Navigation.

---

# Entregas 3 e 4 (Entrega Final)

## 3. Ferramentas utilizadas nas Entregas 3 e 4
- **Claude (Anthropic):** usado nesta etapa final para (a) revisar o repositório unificado e levantar o que faltava, (b) integrar as telas do disfarce com a API real, (c) completar o notebook de Data Science com validação cruzada, (d) criar o endpoint do indicador e o card no app, e (e) atualizar `README.md` e este arquivo.
- **Outras ferramentas (ChatGPT, Gemini, etc.):** _o grupo deve registrar aqui, e na seção 4, qualquer outro uso de IA na criação da API Node.js/Express e do banco (Entrega 3), com os prompts reais utilizados._

> Antes do commit, o grupo deve ler, executar e conferir todo o código gerado por IA, e confirmar a autoria de cada parte na matriz de responsabilidades do `README.md`.

## 4. Entrega 3 (API Node.js/Express e banco) — a preencher pelo grupo
Registre aqui os prompts, os problemas encontrados e os aprendizados do uso de IA na API (rotas REST, middlewares, validação, scripts SQL), no mesmo formato dos exemplos 1 a 3.

## 5. Prompts e Aprendizados — Entrega 4 (integração mobile e Data Science)

### Exemplo 5 - Integração das telas do disfarce com a API
- **Prompt Inicial (resumo):** "Integre as telas `LoginScreen`, `RegisterScreen`, `NotesListScreen` e `NoteEditorScreen` com o `AuthContext` e o `api.js` para fazerem CRUD real em `/auth` e `/notas`, removendo dados mocados e preservando o gatilho do PIN e o Quick Exit." (enviado junto com o PDF de especificação e o `.zip` do repositório).
- **Problemas encontrados na revisão:** (1) `App.js` renderizava `AppTabs` direto, sem o `AppNavigator`, então Login, Notas e a Saída Rápida nunca eram alcançados; (2) `NoteEditorScreen` era totalmente simulado e já iniciava com o PIN `1234`, abrindo a Área de Apoio sem digitar nada; (3) o `AuthContext` chamava `POST /auth/lock`, rota que não existia na API; (4) o package.json trazia uma dependência `scipy` do npm sem uso.
- **Solução:** criação do `NotesContext` (GET/POST/PUT/DELETE em `/notas`), editor com título e texto reais, gatilho do PIN movido para a barra de busca (confirmando no teclado, com erro silencioso para não revelar a área restrita), rota `/auth/lock` no back-end e saída instantânea (o bloqueio local acontece antes da resposta da rede).
- **Aprendizado da Equipa:** Pedir à IA que **leia o código existente antes de alterar** revelou falhas de integração que o PDF de contexto não listava. Testar o fluxo completo (cadastro → notas → PIN → Área de Apoio → Sair) é obrigatório; só compilar não basta.

### Exemplo 6 - Modelo de Data Science com validação cruzada
- **Prompt Inicial (resumo):** "Atualize o notebook com modelo supervisionado, `StratifiedKFold` de 5 folds, métricas completas e matriz de confusão, execute tudo e adicione `requirements.txt` e o link da fonte SES/MG."
- **Problema Encontrado:** O primeiro cálculo do indicador para o app preenchia as variáveis não coletadas com "Não informado", categoria que na base está associada a repetição, o que gerava probabilidades irreais (cerca de 0,75 a 0,88) e classificava todo mundo como risco Alto. Também apareceu um resultado perigoso: um perfil só com agressão física saía na faixa Baixo.
- **Solução:** variáveis não coletadas entram pela média ponderada pela frequência da base de treino (valor esperado do coeficiente), e o notebook passou a exportar essas frequências. O card do app e a API trazem uma ressalva: o indicador mede a chance de repetição em casos parecidos, **não a gravidade**, e uma faixa baixa não significa ausência de risco. A conferência numérica entre o cálculo da API e o `scikit-learn` deu o mesmo resultado.
- **Aprendizado da Equipa:** O modelo tem poder moderado (AUC ≈ 0,65) e as métricas devem ser apresentadas com honestidade. Validar a saída do modelo com perfis reais de uso evita falsa sensação de segurança, que o próprio plano da seção 6 do notebook apontava como risco.

### Exemplo 7 - Documentação
- **Prompt (resumo):** "Atualize `README.md` (resumo da base, execução, endpoints, relacionamentos, métricas e matriz de responsabilidades) e `USO_IA.md`."
- **Observação:** a coluna de responsáveis da matriz ficou em branco, pois a IA não sabe quem fez cada parte; foram mantidos apenas os dois nomes já registrados no notebook. Os trechos sobre a Entrega 3 neste arquivo ficaram para o grupo preencher.

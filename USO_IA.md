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
# API de Currículo Express

> Node.js, Express, PostgreSQL

Este projeto é uma API RESTful completa para um aplicativo de "Currículo Express". Ele permite que usuários se registrem, criem "blocos" de currículo reutilizáveis (educação, experiência, etc.) e os montem em múltiplos currículos customizados.

A API é construída com uma arquitetura em camadas, autenticação JWT segura e relacionamentos complexos (1:N e N:M) gerenciados pelo Sequelize.

## Funcionalidades Principais

- **Autenticação JWT**: Sistema completo de registro (`/register`) e login (`/login`) com senhas hasheadas (bcrypt) e tokens JWT.
- **Arquitetura Reutilizável (1:N)**: Usuários possuem seus próprios "blocos" de Education, Experience, Skill, Project, e Statement.
- **Montagem de Currículo (N:M)**: Um Curriculum é um "container" que pode ser montado usando qualquer combinação dos blocos do usuário.
- **Segurança**: Rotas protegidas por middleware que verificam o token JWT e garantem que um usuário só possa acessar ou modificar seus próprios dados.
- **IA (Gemini)**: Endpoint bônus (`/api/ai/generate-statement`) que utiliza a IA do Google (Gemini) para analisar um currículo montado e gerar um Statement (resumo) otimizado para uma descrição de vaga.

## Fluxo de Uso (Como Montar um Currículo)

Este é o fluxo de requisições recomendado no Postman para montar um currículo completo do zero.

> ⚠️ **Importante**: Lembre-se de configurar o Bearer Token após o Passo 2 para todas as requisições seguintes!

### Passo 1: Registrar um Novo Usuário

Crie sua conta.

**POST** `/api/auth/register`

```json
{
    "name": "Seu Nome",
    "email": "seu@email.com",
    "password": "sua-senha"
}
```

### Passo 2: Fazer Login

Obtenha seu token de autenticação.

**POST** `/api/auth/login`

```json
{
    "email": "seu@email.com",
    "password": "sua-senha"
}
```

**Ação**: Copie o token da resposta.

### Passo 3: Criar os "Blocos" (1:N)

Crie os itens que você quer adicionar ao seu currículo. (Guarde os ids gerados).

- **POST** `/api/educations`

    ```json
    { "institution": "...", "degree": "...", ... }
    ```

- **POST** `/api/experiences`

    ```json
    { "company": "...", "title": "...", ... }
    ```

- **POST** `/api/skills`

    ```json
    { "name": "TypeScript", "level": "Avançado" }
    ```

- **POST** `/api/projects`

    ```json
    { "name": "API de Currículo", ... }
    ```

### Passo 4: Criar um Statement (Resumo)

Todo currículo precisa de um resumo associado. Crie pelo menos um.

**POST** `/api/statements`

```json
{
    "title": "Resumo Padrão (Backend)",
    "text": "Desenvolvedor focado em performance..."
}
```

**Ação**: Guarde o id deste statement (ex: `statementId`).

### Passo 5: Criar o "Container" do Currículo (Curriculum)

Crie o currículo em si, associando o Statement do passo anterior.

**POST** `/api/curriculums`

```json
{
    "title": "Currículo Vaga Dev Pleno",
    "statementId": "ID_DO_STATEMENT_DO_PASSO_4"
}
```

**Ação**: Guarde o id deste currículo (ex: `curriculumId`).

### Passo 6: Montar o Currículo (N:M)

Associe os "blocos" do Passo 3 ao "container" do Passo 5.

> 📝 **Nota**: Estas requisições não possuem body!

- **POST** `/api/curriculums/:curriculumId/educations/:educationId`
- **POST** `/api/curriculums/:curriculumId/experiences/:experienceId`
- **POST** `/api/curriculums/:curriculumId/skills/:skillId`

### Passo 7: Ver o Resultado

Busque o currículo completo pelo seu ID.

**GET** `/api/curriculums/:curriculumId`

**Resultado**: Você verá um JSON completo com o statement e os arrays educations, experiences, etc., preenchidos.

## Funcionalidade Bônus: Gerar Statement com IA

Após montar um currículo (Passo 6), você pode pedir à IA para gerar um novo Statement otimizado.

**POST** `/api/ai/generate-statement`

```json
{
    "curriculumId": "ID_DO_CURRICULO_MONTADO",
    "title": "Statement Otimizado (Vaga X)",
    "jobDescription": "Descrição da vaga para a qual você quer aplicar..."
}
```

**Resultado**: A IA irá analisar seu currículo e a vaga, e criar um novo Statement na sua conta.

## Documentação da API (Endpoints)

> 🔒 Todas as rotas (exceto `/auth`) são protegidas e requerem um Bearer Token.

### Autenticação (`/api/auth`)

- **POST** `/register` - Registra um novo usuário
- **POST** `/login` - Faz login e retorna um JWT

### Educações (`/api/educations`)

- **POST** `/` - Cria uma nova educação
- **GET** `/` - Lista todas as educações do usuário
- **GET** `/:id` - Busca uma educação específica
- **PUT** `/:id` - Atualiza uma educação
- **DELETE** `/:id` - Remove uma educação

### Experiências (`/api/experiences`)

- **POST** `/` - Cria uma nova experiência
- **GET** `/` - Lista todas as experiências do usuário
- **GET** `/:id` - Busca uma experiência específica
- **PUT** `/:id` - Atualiza uma experiência
- **DELETE** `/:id` - Remove uma experiência

### Habilidades (`/api/skills`)

- **POST** `/` - Cria uma nova habilidade
- **GET** `/` - Lista todas as habilidades do usuário
- **GET** `/:id` - Busca uma habilidade específica
- **PUT** `/:id` - Atualiza uma habilidade
- **DELETE** `/:id` - Remove uma habilidade

### Projetos (`/api/projects`)

- **POST** `/` - Cria um novo projeto
- **GET** `/` - Lista todos os projetos do usuário
- **GET** `/:id` - Busca um projeto específico
- **PUT** `/:id` - Atualiza um projeto
- **DELETE** `/:id` - Remove um projeto

### Statements (`/api/statements`)

- **POST** `/` - Cria um novo statement
- **GET** `/` - Lista todos os statements do usuário
- **GET** `/:id` - Busca um statement específico
- **PUT** `/:id` - Atualiza um statement
- **DELETE** `/:id` - Remove um statement

### Currículos (`/api/curriculums`)

- **POST** `/` - Cria um novo currículo
- **GET** `/` - Lista todos os currículos do usuário
- **GET** `/:id` - Busca um currículo específico (com todos os blocos associados)
- **PUT** `/:id` - Atualiza um currículo
- **DELETE** `/:id` - Remove um currículo
- **POST** `/:curriculumId/educations/:educationId` - Associa uma educação ao currículo
- **POST** `/:curriculumId/experiences/:experienceId` - Associa uma experiência ao currículo
- **POST** `/:curriculumId/skills/:skillId` - Associa uma habilidade ao currículo
- **POST** `/:curriculumId/projects/:projectId` - Associa um projeto ao currículo
- **DELETE** `/:curriculumId/educations/:educationId` - Remove associação de educação
- **DELETE** `/:curriculumId/experiences/:experienceId` - Remove associação de experiência
- **DELETE** `/:curriculumId/skills/:skillId` - Remove associação de habilidade
- **DELETE** `/:curriculumId/projects/:projectId` - Remove associação de projeto

### IA (`/api/ai`)

- **POST** `/generate-statement` - Gera um statement otimizado usando IA (Gemini)

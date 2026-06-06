# Sistema de Gestão de Ocorrências - Campus ESMAD

API REST para gestão de ocorrências no Campus da ESMAD, no âmbito do ODS 11 – Cidades e Comunidades Sustentáveis.

## 📋 Descrição

Sistema que permite à comunidade académica reportar, acompanhar e monitorizar problemas relacionados com sustentabilidade, manutenção e qualidade de vida no espaço do Campus.

## 🚀 Tecnologias

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v5.2.1
- **ORM:** Sequelize v6.37.8
- **Database:** MySQL (Railway-hosted)
- **Authentication:** JWT (jsonwebtoken v9.0.3)
- **Password Hashing:** bcrypt v6.0.0
- **Environment:** dotenv v17.4.2

## 📦 Instalação

```bash
# Clonar repositório
git clone https://github.com/Mikuasovsky/TrabalhoIndividualPW2.git
cd TrabalhoIndividualPW2

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as tuas credenciais

# Iniciar servidor
npm start
```

## 🔐 Variáveis de Ambiente

```env
DB_HOST=host
DB_PORT=3306
DB_NAME=database_name
DB_USER=username
DB_PASSWORD=password
JWT_SECRET=your_secret_key
```

## 🌐 API Endpoints

### Autenticação
- `POST /api/users/register` - Registo de utilizador
- `POST /api/sessions` - Login

### Ocorrências
- `POST /api/occurrences` - Criar ocorrência
- `GET /api/occurrences` - Listar ocorrências
- `GET /api/occurrences/:id` - Buscar ocorrência por ID
- `PUT /api/occurrences/:id` - Atualizar ocorrência
- `DELETE /api/occurrences/:id` - Apagar ocorrência
- `PUT /api/occurrences/:id/status` - Atualizar status
- `PUT /api/occurrences/:id/priority` - Atualizar prioridade
- `GET /api/occurrences/stats` - Estatísticas (admin)

### Comentários
- `POST /api/occurrences/:id/comments` - Adicionar comentário
- `GET /api/occurrences/:id/comments` - Listar comentários
- `POST /api/comments/:id/flags` - Sinalizar comentário

### Utilizadores (Admin)
- `GET /api/users` - Listar utilizadores
- `PUT /api/users/:id/suspend` - Suspender utilizador

### Funcionários (Admin)
- `PUT /api/employees/:id/validate` - Validar funcionário

### Categorias (Admin)
- `POST /api/categories` - Criar categoria
- `GET /api/categories` - Listar categorias

### Statuses (Admin)
- `POST /api/statuses` - Criar status
- `GET /api/statuses` - Listar statuses

### Locais (Admin)
- `POST /api/locations` - Criar local
- `GET /api/locations` - Listar locais

## 👥 Perfis de Utilizador

### Utilizador (Estudante/Docente)
- Cria ocorrências
- Consulta/comenta ocorrências não resolvidas
- Sinaliza comentários indevidos nas suas ocorrências
- Edita/apaga ocorrências próprias (antes de tratamento)

### Funcionário
- Altera estado das ocorrências
- Regista informação sobre tratamento
- Altera prioridade de ocorrências
- Sinaliza comentários indevidos

### Administrador
- Valida registo de funcionários
- Suspende utilizadores
- Remove ocorrências/comentários
- Consulta estatísticas globais
- Parametriza categorias e estados

## 📊 Estatísticas

- Ocorrências por categoria
- Ocorrências por status
- Ocorrências por edifício
- Tempo médio de resolução
- Evolução mensal de ocorrências

## 📚 Documentação

[Postman Collection](https://miguelsilva-8022870.postman.co/workspace/Miguel-Silva's-Workspace~348d5ec1-2788-45d3-80ae-dd7848837d25/collection/43379762-141fe4e9-7032-430c-9da6-7e5c703bb2fd?action=share&source=copy-link&creator=43379762)

## 🗄️ Estrutura da Base de Dados

```
User (id, name, email, password, role, is_suspended, is_validated)
  └─ Employee (id, user_id)
  └─ Occurrence (created_by)
  └─ Comment (user_id)

Category (id, name, description)
  └─ Occurrence (category_id)

Status (id, name, is_final)
  └─ Occurrence (current_status_id)

Location (id, building, floor, room, description, latitude, longitude)
  └─ Occurrence (location_id)

Occurrence (id, title, description, priority, created_by, category_id, location_id, current_status_id, treatment_description, resolution_date_expected, resolution_date_actual, is_deleted)
  ├─ OccurrencePhoto
  ├─ OccurrenceStatusHistory
  ├─ OccurrencePriorityHistory
  └─ Comment

Comment (id, text, user_id, occurrence_id, is_deleted)
  └─ CommentFlag
```

## 🏗️ Arquitetura

- **MVC Pattern:** Controllers, Models, Routes
- **Middleware:** JWT verification, Role-based authorization
- **Soft Delete:** Ocorrências e comentários são soft deleted
- **History Tracking:** Histórico de alterações de status e prioridade

## 📝 Notas

- Usa ES Modules (import/export)
- Password mínimo de 10 caracteres
- Email institucional obrigatório (@esmad.ipp.pt)
- Token JWT expira após 15 minutos
- Histórico de status e prioridade é criado automaticamente

## 📄 Licença

ISC

# Guia de Testes - API REST

## 📋 Pré-requisitos
- Servidor a correr em `http://localhost:3000`
- Postman ou similar para testar

---

## 1. Autenticação

### 1.1 Registo de Utilizador (User)
```
POST /api/users/register
Body:
{
  "name": "João Silva",
  "email": "12345@esmad.ipp.pt",
  "password": "password123"
}
```
**Esperado:** 201 Created + dados do utilizador (role: "user")

### 1.2 Registo de Funcionário (Employee)
```
POST /api/users/register
Body:
{
  "name": "Maria Santos",
  "email": "maria@esmad.ipp.pt",
  "password": "password123"
}
```
**Esperado:** 201 Created + dados do utilizador (role: "employee", is_validated: false)

### 1.3 Login (User)
```
POST /api/sessions
Body:
{
  "email": "12345@esmad.ipp.pt",
  "password": "password123"
}
```
**Esperado:** 200 OK + token + dados do utilizador
**Copiar o token** para usar nos próximos testes.

### 1.4 Login (Admin)
```
POST /api/sessions
Body:
{
  "email": "admin@esmad.ipp.pt",
  "password": "admin123"
}
```
**Esperado:** 200 OK + token + dados do utilizador
**Copiar o token** para usar nos testes de admin.

---

## 2. Ocorrências (User)

### 2.1 Criar Ocorrência
```
POST /api/occurrences
Headers: Authorization: Bearer <token_user>
Body:
{
  "title": "Lixo acumulado no corredor",
  "description": "Há lixo acumulado no corredor do 2º piso",
  "priority": "media",
  "category_id": 1,
  "location_id": 1
}
```
**Esperado:** 201 Created + ocorrência criada
**Guardar o ID** da ocorrência criada.

### 2.2 Listar Ocorrências
```
GET /api/occurrences
Headers: Authorization: Bearer <token_user>
```
**Esperado:** 200 OK + lista de ocorrências

### 2.3 Buscar Ocorrência por ID
```
GET /api/occurrences/:id
Headers: Authorization: Bearer <token_user>
```
**Esperado:** 200 OK + detalhes da ocorrência

### 2.4 Adicionar Comentário
```
POST /api/occurrences/:id/comments
Headers: Authorization: Bearer <token_user>
Body:
{
  "content": "Já reportei isto várias vezes"
}
```
**Esperado:** 201 Created + comentário criado

### 2.5 Listar Comentários
```
GET /api/occurrences/:id/comments
Headers: Authorization: Bearer <token_user>
```
**Esperado:** 200 OK + lista de comentários

### 2.6 Atualizar Ocorrência (antes de tratamento)
```
PUT /api/occurrences/:id
Headers: Authorization: Bearer <token_user>
Body:
{
  "description": "Descrição atualizada"
}
```
**Esperado:** 200 OK + ocorrência atualizada

### 2.7 Apagar Ocorrência (antes de tratamento)
```
DELETE /api/occurrences/:id
Headers: Authorization: Bearer <token_user>
```
**Esperado:** 200 OK + mensagem de sucesso

---

## 3. Ocorrências (Funcionário)

### 3.1 Criar Ocorrência (Funcionário também pode)
```
POST /api/occurrences
Headers: Authorization: Bearer <token_employee>
Body:
{
  "title": "Lâmpada queimada",
  "description": "Lâmpada do corredor queimada",
  "priority": "baixa",
  "category_id": 2,
  "location_id": 1
}
```
**Esperado:** 201 Created
**Guardar o ID** da ocorrência criada.

### 3.2 Atualizar Status
```
PUT /api/occurrences/:id/status
Headers: Authorization: Bearer <token_employee>
Body:
{
  "status_id": 2
}
```
**Esperado:** 200 OK + mensagem de sucesso

### 3.3 Atualizar Prioridade
```
PUT /api/occurrences/:id/priority
Headers: Authorization: Bearer <token_employee>
Body:
{
  "priority": "alta"
}
```
**Esperado:** 200 OK + mensagem de sucesso

### 3.4 Sinalizar Comentário
```
POST /api/comments/:commentId/flags
Headers: Authorization: Bearer <token_employee>
Body:
{
  "reason": "Comentário ofensivo"
}
```
**Esperado:** 201 Created + flag criada

---

## 4. Estatísticas (Admin)

### 4.1 Ocorrências por Categoria
```
GET /api/occurrences/stats?group_by=category
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + dados agrupados por categoria

### 4.2 Ocorrências por Status
```
GET /api/occurrences/stats?group_by=status
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + dados agrupados por status

### 4.3 Ocorrências por Edifício
```
GET /api/occurrences/stats?group_by=building
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + dados agrupados por building

### 4.4 Tempo Médio de Resolução
```
GET /api/occurrences/stats?stats=average_resolution_time
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + tempo médio em dias

### 4.5 Evolução Mensal
```
GET /api/occurrences/stats?stats=monthly_evolution&year=2025
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + dados por mês

---

## 5. Gestão de Utilizadores (Admin)

### 5.1 Validar Funcionário
```
PUT /api/employees/:id/validate
Headers: Authorization: Bearer <token_admin>
Body:
{
  "is_validated": true
}
```
**Esperado:** 200 OK + funcionário validado

### 5.2 Suspender Utilizador
```
PUT /api/users/:id/suspend
Headers: Authorization: Bearer <token_admin>
Body:
{
  "is_suspended": true
}
```
**Esperado:** 200 OK + utilizador suspenso

### 5.3 Listar Utilizadores
```
GET /api/users
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + lista de utilizadores

---

## 6. Categorias (Admin)

### 6.1 Criar Categoria
```
POST /api/categories
Headers: Authorization: Bearer <token_admin>
Body:
{
  "name": "Acessibilidade",
  "description": "Problemas de acessibilidade"
}
```
**Esperado:** 201 Created + categoria criada

### 6.2 Listar Categorias
```
GET /api/categories
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + lista de categorias

---

## 7. Statuses (Admin)

### 7.1 Criar Status
```
POST /api/statuses
Headers: Authorization: Bearer <token_admin>
Body:
{
  "name": "Em análise",
  "is_final": false
}
```
**Esperado:** 201 Created + status criado

### 7.2 Listar Statuses
```
GET /api/statuses
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + lista de statuses

---

## 8. Locais (Admin)

### 8.1 Criar Local
```
POST /api/locations
Headers: Authorization: Bearer <token_admin>
Body:
{
  "building": "Edifício A",
  "floor": "2",
  "room": "202",
  "description": "Sala de aula",
  "latitude": 41.123,
  "longitude": -8.456
}
```
**Esperado:** 201 Created + local criado

### 8.2 Listar Locais
```
GET /api/locations
Headers: Authorization: Bearer <token_admin>
```
**Esperado:** 200 OK + lista de locais

---

## 9. Testes de Erro

### 9.1 Login com credenciais inválidas
```
POST /api/sessions
Body:
{
  "email": "nao@existe.pt",
  "password": "wrong"
}
```
**Esperado:** 401 Unauthorized

### 9.2 Acesso sem token
```
GET /api/occurrences
```
**Esperado:** 401 Unauthorized

### 9.3 User tenta acessar estatísticas
```
GET /api/occurrences/stats?group_by=category
Headers: Authorization: Bearer <token_user>
```
**Esperado:** 403 Forbidden

### 9.4 User tenta suspender utilizador
```
PUT /api/users/:id/suspend
Headers: Authorization: Bearer <token_user>
```
**Esperado:** 403 Forbidden

### 9.5 User sinaliza comentário em ocorrência não criada por ele
```
POST /api/comments/:commentId/flags
Headers: Authorization: Bearer <token_user>
Body:
{
  "reason": "Teste"
}
```
**Esperado:** 403 Forbidden

---

## ✅ Checklist de Validação

- [ ] Autenticação funciona (registo e login)
- [ ] Users podem criar ocorrências
- [ ] Users podem comentar nas suas ocorrências
- [ ] Users só podem editar/apagar as suas ocorrências (antes de tratamento)
- [ ] Users só podem sinalizar comentários nas suas ocorrências
- [ ] Employees podem atualizar status e prioridade
- [ ] Employees podem sinalizar qualquer comentário
- [ ] Admin pode validar funcionários
- [ ] Admin pode suspender utilizadores
- [ ] Admin pode consultar estatísticas
- [ ] Admin pode gerir categorias, statuses e locais
- [ ] Estatísticas funcionam com diferentes query parameters
- [ ] Soft delete funciona (ocorrências apagadas não aparecem)
- [ ] Histórico de status e prioridade é criado
- [ ] Tokens expiram após 15 minutos
- [ ] Mensagens de erro estão em português correto

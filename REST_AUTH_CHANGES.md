# Refatoração REST - PW2

## 📋 Resumo das Alterações

Transformar endpoints não-RESTful para RESTful seguindo os princípios ensinados na disciplina PW2.

### Parte 1: Autenticação

**Antes:**
- `POST /auth/register` - Não RESTful
- `POST /auth/login` - Não RESTful

**Depois:**
- `POST /users/register` - RESTful (criar recurso User)
- `POST /sessions` - RESTful (criar recurso Session)

### Parte 2: Estatísticas

**Antes:**
- `GET /api/statistics/occurrences-by-category` - Não RESTful
- `GET /api/statistics/occurrences-by-status` - Não RESTful
- `GET /api/statistics/occurrences-by-building` - Não RESTful
- `GET /api/statistics/average-resolution-time` - Não RESTful
- `GET /api/statistics/monthly-evolution` - Não RESTful

**Depois:**
- `GET /api/occurrences/stats?group_by=category` - RESTful
- `GET /api/occurrences/stats?group_by=status` - RESTful
- `GET /api/occurrences/stats?group_by=building` - RESTful
- `GET /api/occurrences/stats?stats=average_resolution_time` - RESTful
- `GET /api/occurrences/stats?stats=monthly_evolution&year=2025` - RESTful

---

## 📁 Ficheiros Alterados (Parte 1: Autenticação)

### 1. Criado: `src/routes/sessions.routes.js`

**Código completo:**
```javascript
import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// POST /sessions - Login (criar sessão)
router.post("/", AuthController.login);

export default router;
```

**Explicação:**
- Novo ficheiro de rotas para gestão de sessões
- Endpoint `POST /sessions` usa a lógica existente do `AuthController.login`
- Segue princípio REST: criar recurso Session através de POST
- Reaproveita toda a lógica de autenticação existente (JWT, bcrypt, validações)

---

### 2. Alterado: `src/routes/users.routes.js`

**Código completo:**
```javascript
import { Router } from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";
import {
	verifyToken,
	requireAdmin,
	requireSelfOrAdmin
} from "../middlewares/auth.js";

const router = Router();

// POST /users - Registo público (sem autenticação)
router.post("/register", AuthController.register);

// Endpoints protegidos (requer autenticação)
router.post("/", verifyToken, requireAdmin, UserController.create);
router.get("/", verifyToken, requireAdmin, UserController.getAll);
router.get("/:id", verifyToken, requireSelfOrAdmin, UserController.getById);
router.put("/:id", verifyToken, requireSelfOrAdmin, UserController.update);
router.delete("/:id", verifyToken, requireAdmin, UserController.delete);
router.patch("/:id", verifyToken, requireAdmin, UserController.suspend);

export default router;
```

**Alterações:**
- Adicionado `import AuthController from "../controllers/AuthController.js"`
- Adicionado endpoint `POST /users/register` sem middleware de autenticação
- Este endpoint usa a lógica existente do `AuthController.register`
- Mantidos todos os endpoints protegidos existentes (sem alterações)
- Comentários para distinguir endpoints públicos de protegidos

**Explicação:**
- Segue princípio REST: criar recurso User através de POST
- Endpoint público permite registo sem autenticação prévia
- Reaproveita toda a lógica de registo existente (validações, role detection, bcrypt)
- Não altera a estrutura MVC nem a lógica de negócio

---

### 3. Alterado: `src/routes/index.js`

**Código completo:**
```javascript
import { Router } from "express";

import sessionRoutes from "./sessions.routes.js";
import userRoutes from "./users.routes.js";
import employeeRoutes from "./employees.routes.js";
import categoryRoutes from "./categories.routes.js";
import statusRoutes from "./statuses.routes.js";
import locationRoutes from "./locations.routes.js";
import occurrenceRoutes from "./occurrences.routes.js";
import commentRoutes from "./comments.routes.js";
import statsRoutes from "./stats.routes.js";

const router = Router();

router.use("/sessions", sessionRoutes);
router.use("/users", userRoutes);
router.use("/employees", employeeRoutes);
router.use("/categories", categoryRoutes);
router.use("/statuses", statusRoutes);
router.use("/locations", locationRoutes);
router.use("/occurrences", occurrenceRoutes);
router.use("/comments", commentRoutes);
router.use("/statistics", statsRoutes);

export default router;
```

**Alterações:**
- Removido: `import authRoutes from "./auth.routes.js"`
- Adicionado: `import sessionRoutes from "./sessions.routes.js"`
- Removido: `router.use("/auth", authRoutes)`
- Adicionado: `router.use("/sessions", sessionRoutes)`

**Explicação:**
- Remove rota `/auth` não RESTful
- Adiciona rota `/sessions` RESTful
- Mantém todas as outras rotas inalteradas
- Preserva compatibilidade com o resto da aplicação

---

### 4. Removido: `src/routes/auth.routes.js`

**Explicação:**
- Ficheiro removido pois a funcionalidade foi redistribuída
- Lógica de login movida para `/sessions`
- Lógica de registo movida para `/users/register`
- Mantém o controller `AuthController.js` intacto (lógica reaproveitada)

---

## � Ficheiros Alterados (Parte 2: Estatísticas)

### 5. Alterado: `src/controllers/OccurrenceController.js`

**Alterações:**
- Adicionado `import { Op, Sequelize } from "sequelize"`
- Adicionado método `getStats` para estatísticas RESTful

**Código do método adicionado:**
```javascript
// Estatísticas - RESTful com query parameters
async getStats(req, res) {
  try {
    const { group_by, stats, year } = req.query;

    // Agrupamento por categoria
    if (group_by === "category") {
      const data = await Occurrence.findAll({
        where: { is_deleted: false },
        attributes: [
          "category_id",
          [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
        ],
        include: [{ model: Category, attributes: ["id", "name"] }],
        group: ["category_id", "Category.id"],
        order: [[Sequelize.literal("count"), "DESC"]]
      });
      return res.json(data);
    }

    // Agrupamento por status
    if (group_by === "status") {
      const data = await Occurrence.findAll({
        where: { is_deleted: false },
        attributes: [
          "current_status_id",
          [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
        ],
        include: [{ model: Status, attributes: ["id", "name"] }],
        group: ["current_status_id", "Status.id"],
        order: [[Sequelize.literal("count"), "DESC"]]
      });
      return res.json(data);
    }

    // Agrupamento por building
    if (group_by === "building") {
      const data = await Occurrence.findAll({
        where: { is_deleted: false },
        attributes: [
          [Sequelize.col("Location.building"), "building"],
          [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
        ],
        include: [{ model: Location, attributes: [] }],
        group: ["Location.building"],
        order: [[Sequelize.literal("count"), "DESC"]],
        raw: true
      });
      return res.json(data);
    }

    // Tempo médio de resolução
    if (stats === "average_resolution_time") {
      const data = await Occurrence.findAll({
        where: {
          is_deleted: false,
          resolution_date_actual: { [Op.ne]: null }
        },
        attributes: [
          [
            Sequelize.fn(
              "AVG",
              Sequelize.literal(
                "TIMESTAMPDIFF(DAY, createdAt, resolution_date_actual)"
              )
            ),
            "avg_days"
          ],
          [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
        ],
        raw: true
      });
      return res.json(data[0]);
    }

    // Evolução mensal
    if (stats === "monthly_evolution") {
      const where = { is_deleted: false };
      if (year) {
        where.createdAt = {
          [Sequelize.Op.between]: [
            new Date(`${year}-01-01T00:00:00Z`),
            new Date(`${year}-12-31T23:59:59Z`)
          ]
        };
      }

      const data = await Occurrence.findAll({
        where,
        attributes: [
          [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
        ],
        group: ["month"],
        order: [[Sequelize.literal("month"), "ASC"]],
        raw: true
      });
      return res.json(data);
    }

    return res.status(400).json({ 
      error: "Parâmetro inválido. Use: group_by=category|status|building ou stats=average_resolution_time|monthly_evolution" 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao obter estatísticas" });
  }
}
```

**Explicação:**
- Lógica do StatsController movida para OccurrenceController
- Usa query parameters em vez de endpoints separados
- Mantém toda a lógica de agregação do Sequelize
- Apenas admin pode aceder (middleware requireAdmin)

---

### 6. Alterado: `src/routes/occurrences.routes.js`

**Alterações:**
- Adicionado `import { requireAdmin }` aos middlewares
- Adicionado rota `GET /stats` para estatísticas

**Código adicionado:**
```javascript
// Estatísticas RESTful (admin only)
router.get(
  "/stats",
  verifyToken,
  requireAdmin,
  OccurrenceController.getStats
);
```

**Explicação:**
- Novo endpoint RESTful para estatísticas
- Usa query parameters para diferentes tipos de estatísticas
- Protegido com middleware requireAdmin

---

### 7. Removido: `src/routes/stats.routes.js`

**Explicação:**
- Ficheiro removido pois a funcionalidade foi movida para occurrences
- Estatísticas agora são um sub-recurso de occurrences

---

### 8. Removido: `src/controllers/StatsController.js`

**Explicação:**
- Controller removido pois a lógica foi movida para OccurrenceController
- Mantém a mesma lógica de negócio, apenas reorganizada

---

### 9. Alterado: `src/routes/index.js`

**Alterações:**
- Removido: `import statsRoutes from "./stats.routes.js"`
- Removido: `router.use("/statistics", statsRoutes)`

**Explicação:**
- Remove rota `/statistics` não RESTful
- Estatísticas agora acessíveis via `/occurrences/stats`

---

##  Compatibilidade Mantida

### Não Alterado:
- ✅ Models Sequelize (User, Employee, etc.)
- ✅ Middleware JWT (verifyToken, requireAdmin, requireRole, etc.)
- ✅ Permissões e roles (user, employee, admin)
- ✅ Lógica de geração de tokens (AuthController.login)
- ✅ Lógica de hashing de passwords (bcrypt)
- ✅ AuthController.js (lógica reaproveitada)
- ✅ UserController.js (sem alterações)
- ✅ Demais controllers (sem alterações)
- ✅ Demais rotas (sem alterações)
- ✅ Estrutura MVC (controllers, routes, models, middlewares, config, associations)

### Lógica Reaproveitada:
- ✅ `AuthController.register` → usado em `POST /users/register`
- ✅ `AuthController.login` → usado em `POST /sessions`
- ✅ Lógica de estatísticas do StatsController → movida para OccurrenceController
- ✅ Validações de email institucional
- ✅ Detecção automática de role
- ✅ Criação de Employee para roles employee
- ✅ Verificação de conta suspensa
- ✅ Verificação de validação de employee
- ✅ Geração de JWT token
- ✅ Hashing de passwords com bcrypt
- ✅ Agregações Sequelize para estatísticas

---

## 🎯 Princípios REST Aplicados

### 1. Recursos como Substantivos
- **Antes:** `/auth`, `/statistics` (verbos/ações)
- **Depois:** `/users`, `/sessions`, `/occurrences/stats` (recursos/substantivos)

### 2. Verbos HTTP Adequados
- `POST /users/register` - Criar recurso User
- `POST /sessions` - Criar recurso Session
- `GET /occurrences/stats` - Obter estatísticas do recurso Occurrence

### 3. Query Parameters para Filtros
- `?group_by=category` - Agrupar por categoria
- `?group_by=status` - Agrupar por status
- `?group_by=building` - Agrupar por building
- `?stats=average_resolution_time` - Estatística de tempo médio
- `?stats=monthly_evolution&year=2025` - Evolução mensal

### 4. Separation of Concerns
- Registo = gestão de Users
- Login = gestão de Sessions
- Estatísticas = sub-recurso de Occurrences
- Cada recurso tem a sua rota dedicada

---

## 📊 Novos Endpoints

### Registo de Utilizador
```
POST /api/users/register
Body: { name, email, password }
Response: { user } (sem password)
```

### Login
```
POST /api/sessions
Body: { email, password }
Response: { token, user }
```

### Estatísticas (Admin only)
```
GET /api/occurrences/stats?group_by=category
GET /api/occurrences/stats?group_by=status
GET /api/occurrences/stats?group_by=building
GET /api/occurrences/stats?stats=average_resolution_time
GET /api/occurrences/stats?stats=monthly_evolution&year=2025
```

---

## ✅ Verificação

A aplicação mantém-se:
- ✅ Funcional (mesma lógica de negócio)
- ✅ RESTful (princípios REST aplicados)
- ✅ Coerente com PW2 (tecnologias lecionadas)
- ✅ Compatível (resto da aplicação inalterado)
- ✅ Simples (sem complexidade desnecessária)

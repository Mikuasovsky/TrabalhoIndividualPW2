// Importação da biblioteca JWT para verificação de tokens
import jwt from "jsonwebtoken";

// Middleware para verificar se o token JWT é válido
// É usado em rotas que requerem autenticação
export const verifyToken = (req, res, next) => {
  try {
    // Verifica se a chave secreta JWT está configurada
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET nao configurado" });
    }

    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token em falta" });
    }

    // Verifica se o formato é "Bearer <token>"
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Formato invalido. Use: Bearer <token>" });
    }

    // Verifica a validade do token usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Guarda os dados do utilizador no request para uso posterior
    req.user = decoded;
    return next();
  } catch (error) {
    // Tratamento de erros específicos do JWT
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token invalido" });
    }
    console.error(error);
    return res.status(401).json({ error: "Erro ao verificar token" });
  }
};

// Middleware que requer role de admin
// Usado em rotas que só administradores podem acessar
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Permissao de admin necessaria" });
  }
  return next();
};

// Middleware que requer um role específico
// Recebe o role como parâmetro e verifica se o utilizador tem esse role
export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: `Permissao de ${role} necessaria` });
  }
  return next();
};

// Middleware que requer qualquer um dos roles especificados
// Recebe um array de roles e verifica se o utilizador tem pelo menos um
export const requireAnyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: "Permissao insuficiente" });
  }
  return next();
};

// Middleware que permite acesso se for o próprio utilizador ou admin
// Usado para permitir que utilizadores editem os seus próprios dados
export const requireSelfOrAdmin = (req, res, next) => {
  const userId = String(req.user?.sub || "");      // ID do utilizador no token
  const paramId = String(req.params.id || "");      // ID nos parâmetros da rota

  // Se não for admin e não for o próprio utilizador, nega acesso
  if (req.user?.role !== "admin" && userId !== paramId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  return next();
};

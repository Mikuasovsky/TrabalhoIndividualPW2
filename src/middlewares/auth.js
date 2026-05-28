import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET nao configurado" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token em falta" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Formato invalido. Use: Bearer <token>" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
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

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Permissao de admin necessaria" });
  }
  return next();
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: `Permissao de ${role} necessaria` });
  }
  return next();
};

export const requireAnyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: "Permissao insuficiente" });
  }
  return next();
};

export const requireSelfOrAdmin = (req, res, next) => {
  const userId = String(req.user?.sub || "");
  const paramId = String(req.params.id || "");

  if (req.user?.role !== "admin" && userId !== paramId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  return next();
};

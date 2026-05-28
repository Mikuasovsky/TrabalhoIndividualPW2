import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const safeUser = (user) => {
  const data = user.toJSON();
  delete data.password;
  return data;
};

const normalizeRole = (role) => {
  if (!role) return "student";
  if (role === "student" || role === "employee") return role;
  return null;
};

export default {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body || {};

      const trimmedEmail = typeof email === "string" ? email.trim() : "";

      if (!name || !trimmedEmail || !password) {
        return res.status(400).json({ error: "Nome, email e password sao obrigatorios" });
      }

      const normalizedRole = normalizeRole(role);
      if (!normalizedRole) {
        return res.status(400).json({ error: "Role invalido" });
      }

      if (normalizedRole === "student") {
        const institutionalPattern = /@(?:[^\s@]+\.)?ipp\.pt$/i;
        if (!institutionalPattern.test(trimmedEmail)) {
          return res.status(400).json({ error: "Email institucional obrigatorio" });
        }
      }

      const existingUser = await User.findOne({ where: { email: trimmedEmail } });
      if (existingUser) {
        return res.status(409).json({ error: "Email ja registado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const isValidated = normalizedRole !== "employee";

      const user = await User.create({
        name,
        email: trimmedEmail,
        password: hashedPassword,
        role: normalizedRole,
        is_validated: isValidated
      });

      res.status(201).json(safeUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao registar user" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body || {};

      const trimmedEmail = typeof email === "string" ? email.trim() : "";

      if (!trimmedEmail || !password) {
        return res.status(400).json({ error: "Email e password sao obrigatorios" });
      }

      const user = await User.findOne({ where: { email: trimmedEmail } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais invalidas" });
      }

      if (user.is_suspended) {
        return res.status(403).json({ error: "Conta suspensa" });
      }

      if (user.role === "employee" && !user.is_validated) {
        return res.status(403).json({ error: "Conta pendente de validacao" });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT_SECRET nao configurado" });
      }

      const token = jwt.sign(
        { sub: String(user.id), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: token, user: safeUser(user) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao autenticar user" });
    }
  }
};

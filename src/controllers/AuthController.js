// Importação do bcrypt para hash de passwords
import bcrypt from "bcrypt";
// Importação do JWT para geração de tokens de autenticação
import jwt from "jsonwebtoken";
// Importação dos modelos User e Employee
import User from "../models/User.js";
import Employee from "../models/Employee.js";

// Função auxiliar para remover a password do objeto de utilizador antes de enviar ao cliente
const safeUser = (user) => {
  const data = user.toJSON();
  delete data.password;
  return data;
};

// Função auxiliar para determinar o role do utilizador com base no email
// Prefixo numérico (ex: 12345@esmad.ipp.pt) -> user (estudante)
// Prefixo alfabético (ex: joao@esmad.ipp.pt) -> employee (funcionário)
const resolveRoleFromEmail = (email) => {
  const match = email.match(/^([^@]+)@/);
  if (!match) return null;
  const prefix = match[1];
  if (/^\d+$/.test(prefix)) return "user";
  if (/^[a-zA-Z]/.test(prefix)) return "employee";
  return null;
};

export default {
  // Método de registo de utilizador
  async register(req, res) {
    try {
      const { name, email, password } = req.body || {};

      const trimmedEmail = typeof email === "string" ? email.trim() : "";

      // Validação dos campos obrigatórios
      if (!name || !trimmedEmail || !password) {
        return res.status(400).json({ error: "Nome, email e password são obrigatórios" });
      }

      // Validação do tamanho da password
      if (password.length < 10) {
        return res.status(400).json({ error: "Password deve ter pelo menos 10 caracteres" });
      }
      // Validação do email institucional
      const institutionalPattern = /@esmad\.ipp\.pt$/i;
      if (!institutionalPattern.test(trimmedEmail)) {
        return res.status(400).json({ error: "Email institucional obrigatorio" });
      }

      // Determinação automática do role com base no email
      const normalizedRole = resolveRoleFromEmail(trimmedEmail);
      if (!normalizedRole) {
        return res.status(400).json({ error: "Email institucional invalido" });
      }

      // Verificação se o email já está registado
      const existingUser = await User.findOne({ where: { email: trimmedEmail } });
      if (existingUser) {
        return res.status(409).json({ error: "Email ja registado" });
      }

      // Hash da password com bcrypt (10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);
      // Users são validados automaticamente, employees precisam de validação do admin
      const isValidated = normalizedRole !== "employee";

      // Criação do utilizador
      const user = await User.create({
        name,
        email: trimmedEmail,
        password: hashedPassword,
        role: normalizedRole,
        is_validated: isValidated
      });

      // Se for employee, cria registo na tabela Employee
      if (normalizedRole === "employee") {
        await Employee.create({ user_id: user.id });
      }

      // Retorna o utilizador sem a password
      res.status(201).json(safeUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao registar utilizador" });
    }
  },

  // Método de login
  async login(req, res) {
    try {
      const { email, password } = req.body || {};

      const trimmedEmail = typeof email === "string" ? email.trim() : "";

      // Validação dos campos obrigatórios
      if (!trimmedEmail || !password) {
        return res.status(400).json({ error: "Email e password são obrigatórios" });
      }

      // Busca do utilizador por email
      const user = await User.findOne({ where: { email: trimmedEmail } });
      // Verificação das credenciais (email existe e password corresponde)
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Credenciais invalidas" });
      }

      // Verificação se a conta está suspensa
      if (user.is_suspended) {
        return res.status(403).json({ error: "Conta suspensa" });
      }

      // Verificação se o employee está validado
      if (user.role === "employee" && !user.is_validated) {
        return res.status(403).json({ error: "Conta pendente de validacao" });
      }

      // Verificação se a chave secreta JWT está configurada
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT_SECRET nao configurado" });
      }

      // Geração do token JWT (expira em 15 minutos)
      const token = jwt.sign(
        { sub: String(user.id), role: user.role },  // Payload: ID e role do utilizador
        process.env.JWT_SECRET,                     // Chave secreta
        { expiresIn: "15m" }                        // Tempo de expiração
      );

      // Retorna o token e os dados do utilizador (sem password)
      res.json({ token, user: safeUser(user) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao autenticar utilizador" });
    }
  }
};

import bcrypt from "bcrypt";
import User from "../models/User.js";

const safeUser = (user) => {
  const data = user.toJSON();
  delete data.password;
  return data;
};

export default {
  // Criar user
  async create(req, res) {
    try {
      const payload = { ...req.body };
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
      }

      const user = await User.create(payload);
      res.status(201).json(safeUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar utilizador" });
    }
  },

  // Listar todos os users
  async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] }
      });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar utilizadores" });
    }
  },

  // Buscar user por ID
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ["password"] }
      });

      if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar utilizador" });
    }
  },

  // Atualizar user
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      const payload = { ...req.body };
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
      }

      await user.update(payload);

      res.json(safeUser(user));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar utilizador" });
    }
  },

  // Apagar user
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      await user.destroy();

      res.json({ message: "Utilizador apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar utilizador" });
    }
  },

  async validateEmployee(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      if (user.role !== "employee") {
        return res.status(400).json({ error: "Utilizador não é funcionário" });
      }

      await user.update({ is_validated: true });

      return res.json(safeUser(user));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao validar funcionário" });
    }
  },

  async suspend(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      const isSuspended = Boolean(req.body.is_suspended);
      await user.update({ is_suspended: isSuspended });

      return res.json(safeUser(user));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao suspender utilizador" });
    }
  }
};

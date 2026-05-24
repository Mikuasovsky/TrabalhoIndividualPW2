import User from "../models/User.js";

export default {
  // Criar user
  async create(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar user" });
    }
  },

  // Listar todos os users
  async getAll(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar users" });
    }
  },

  // Buscar user por ID
  async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User não encontrado" });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar user" });
    }
  },

  // Atualizar user
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User não encontrado" });
      }

      await user.update(req.body);

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar user" });
    }
  },

  // Apagar user
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User não encontrado" });
      }

      await user.destroy();

      res.json({ message: "User apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar user" });
    }
  }
};

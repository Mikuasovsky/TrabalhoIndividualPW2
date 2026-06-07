// Importação do modelo Status
import Status from "../models/Status.js";

export default {
  // Criar status (admin only)
  async create(req, res) {
    try {
      const status = await Status.create(req.body);
      res.status(201).json(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar status" });
    }
  },

  // Listar todos os statuses
  async getAll(req, res) {
    try {
      const statuses = await Status.findAll();
      res.json(statuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar statuses" });
    }
  },

  // Buscar status por ID
  async getById(req, res) {
    try {
      const status = await Status.findByPk(req.params.id);

      if (!status) {
        return res.status(404).json({ error: "Status não encontrado" });
      }

      res.json(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar status" });
    }
  },

  // Atualizar status (admin only)
  async update(req, res) {
    try {
      const status = await Status.findByPk(req.params.id);

      if (!status) {
        return res.status(404).json({ error: "Status não encontrado" });
      }

      await status.update(req.body);
      res.json(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar status" });
    }
  },

  // Apagar status (admin only)
  async delete(req, res) {
    try {
      const status = await Status.findByPk(req.params.id);

      if (!status) {
        return res.status(404).json({ error: "Status não encontrado" });
      }

      await status.destroy();
      res.json({ message: "Status apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar status" });
    }
  }
};

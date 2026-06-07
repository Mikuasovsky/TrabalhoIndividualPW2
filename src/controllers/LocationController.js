// Importação do modelo Location
import Location from "../models/Location.js";

export default {
  // Criar local (admin/employee)
  async create(req, res) {
    try {
      const location = await Location.create(req.body);
      res.status(201).json(location);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar local" });
    }
  },

  // Listar todos os locais
  async getAll(req, res) {
    try {
      const locations = await Location.findAll();
      res.json(locations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar locais" });
    }
  },

  // Buscar local por ID
  async getById(req, res) {
    try {
      const location = await Location.findByPk(req.params.id);

      if (!location) {
        return res.status(404).json({ error: "Local não encontrado" });
      }

      res.json(location);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar local" });
    }
  },

  // Atualizar local (admin/employee)
  async update(req, res) {
    try {
      const location = await Location.findByPk(req.params.id);

      if (!location) {
        return res.status(404).json({ error: "Local não encontrado" });
      }

      await location.update(req.body);
      res.json(location);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar local" });
    }
  },

  // Apagar local (admin/employee)
  async delete(req, res) {
    try {
      const location = await Location.findByPk(req.params.id);

      if (!location) {
        return res.status(404).json({ error: "Local não encontrado" });
      }

      await location.destroy();
      res.json({ message: "Local apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar local" });
    }
  }
};

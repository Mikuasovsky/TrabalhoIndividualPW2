import Location from "../models/Location.js";

export default {
  async create(req, res) {
    try {
      const location = await Location.create(req.body);
      res.status(201).json(location);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar local" });
    }
  },

  async getAll(req, res) {
    try {
      const locations = await Location.findAll();
      res.json(locations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar locais" });
    }
  },

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

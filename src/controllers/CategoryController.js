import Category from "../models/Category.js";

export default {
  async create(req, res) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  },

  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar categorias" });
    }
  },

  async getById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar categoria" });
    }
  },

  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      await category.update(req.body);
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  },

  async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      await category.destroy();
      res.json({ message: "Categoria apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar categoria" });
    }
  }
};

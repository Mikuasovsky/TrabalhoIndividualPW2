import Comment from "../models/Comment.js";

export default {
  async create(req, res) {
    try {
      const comment = await Comment.create({
        text: req.body.text,
        user_id: req.body.user_id,
        occurrence_id: req.params.id
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar comentário" });
    }
  },

  async getAll(req, res) {
    try {
      const comments = await Comment.findAll({
        where: { occurrence_id: req.params.id }
      });

      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar comentários" });
    }
  },

  async delete(req, res) {
    try {
      const comment = await Comment.findByPk(req.params.commentId);

      if (!comment) {
        return res.status(404).json({ error: "Comentário não encontrado" });
      }

      await comment.destroy();

      res.json({ message: "Comentário removido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao remover comentário" });
    }
  }
};

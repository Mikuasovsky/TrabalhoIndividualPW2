import Comment from "../models/Comment.js";
import Occurrence from "../models/Occurrence.js";
import Status from "../models/Status.js";

const isClosedStatus = (status) => {
  const name = (status?.name || "").toLowerCase();
  return ["resolvida", "resolved", "rejeitada", "rejected"].includes(name);
};

export default {
  async create(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id, {
        include: [{ model: Status }]
      });

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      if (req.user?.role === "student" && isClosedStatus(occurrence.Status)) {
        return res.status(403).json({ error: "Ocorrência já resolvida" });
      }

      const comment = await Comment.create({
        text: req.body.text,
        user_id: req.user?.sub,
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
      const occurrence = await Occurrence.findByPk(req.params.id);
      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      const comments = await Comment.findAll({
        where: { occurrence_id: req.params.id, is_deleted: false }
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

      await comment.update({ is_deleted: true });

      res.json({ message: "Comentário removido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao remover comentário" });
    }
  }
};

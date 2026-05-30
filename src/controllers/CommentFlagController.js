import CommentFlag from "../models/CommentFlag.js";
import Comment from "../models/Comment.js";
import Occurrence from "../models/Occurrence.js";

export default {
  async create(req, res) {
    try {
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ error: "Motivo obrigatorio" });
      }

      const commentId = req.params.commentId || req.params.id;
      const comment = await Comment.findByPk(commentId);
      if (!comment || comment.is_deleted) {
        return res.status(404).json({ error: "Comentário não encontrado" });
      }

      const occurrence = await Occurrence.findByPk(comment.occurrence_id);
      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      if (req.user?.role === "user") {
        if (String(occurrence.created_by) !== String(req.user?.sub || "")) {
          return res.status(403).json({ error: "Acesso negado" });
        }
      }

      const flag = await CommentFlag.create({
        comment_id: comment.id,
        user_id: req.user?.sub,
        reason
      });

      return res.status(201).json(flag);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao sinalizar comentário" });
    }
  }
};

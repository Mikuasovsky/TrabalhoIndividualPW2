import Occurrence from "../models/Occurrence.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import Status from "../models/Status.js";
import OccurrenceStatusHistory from "../models/OccurrenceStatusHistory.js";
import OccurrencePriorityHistory from "../models/OccurrencePriorityHistory.js";
import Comment from "../models/Comment.js";

const isClosedStatus = (status) => {
  const name = (status?.name || "").toLowerCase();
  return ["resolvida", "resolved", "rejeitada", "rejected"].includes(name);
};

export default {
  // Criar ocorrência
  async create(req, res) {
    try {
      const userId = String(req.user?.sub || "");

      const occurrence = await Occurrence.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        created_by: userId,
        category_id: req.body.category_id,
        location_id: req.body.location_id,
        current_status_id: req.body.current_status_id
      });

      // Histórico inicial de status
      await OccurrenceStatusHistory.create({
        occurrence_id: occurrence.id,
        status_id: req.body.current_status_id
      });

      // Histórico inicial de prioridade
      await OccurrencePriorityHistory.create({
        occurrence_id: occurrence.id,
        priority: req.body.priority
      });

      res.status(201).json(occurrence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar ocorrência" });
    }
  },

  // Listar todas as ocorrências
  async getAll(req, res) {
    try {
      const occurrences = await Occurrence.findAll({
        where: { is_deleted: false },
        include: [
          { model: User },
          { model: Category },
          { model: Location },
          { model: Status },
          { model: Comment, where: { is_deleted: false }, required: false }
        ]
      });
      const role = req.user?.role;
      if (role === "student") {
        const filtered = occurrences.filter(
          (occurrence) => !isClosedStatus(occurrence.Status)
        );
        return res.json(filtered);
      }

      return res.json(occurrences);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar ocorrências" });
    }
  },

  // Buscar ocorrência por ID
  async getById(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id, {
        include: [
          { model: User },
          { model: Category },
          { model: Location },
          { model: Status },
          { model: Comment, where: { is_deleted: false }, required: false }
        ]
      });

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      if (req.user?.role === "student" && isClosedStatus(occurrence.Status)) {
        return res.status(403).json({ error: "Ocorrência já resolvida" });
      }

      return res.json(occurrence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar ocorrência" });
    }
  },

  // Atualizar ocorrência
  async update(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      const userId = String(req.user?.sub || "");
      const isAdmin = req.user?.role === "admin";

      if (!isAdmin && String(occurrence.created_by) !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      if (!isAdmin) {
        const historyCount = await OccurrenceStatusHistory.count({
          where: { occurrence_id: occurrence.id }
        });
        if (historyCount > 1) {
          return res.status(403).json({ error: "Ocorrência já tratada" });
        }
      }

      await occurrence.update(req.body);

      return res.json(occurrence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar ocorrência" });
    }
  },

  // Apagar ocorrência
  async delete(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      const userId = String(req.user?.sub || "");
      const isAdmin = req.user?.role === "admin";

      if (!isAdmin && String(occurrence.created_by) !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      if (!isAdmin) {
        const historyCount = await OccurrenceStatusHistory.count({
          where: { occurrence_id: occurrence.id }
        });
        if (historyCount > 1) {
          return res.status(403).json({ error: "Ocorrência já tratada" });
        }
      }

      await occurrence.update({ is_deleted: true });

      return res.json({ message: "Ocorrência apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar ocorrência" });
    }
  },

  // Atualizar status
  async updateStatus(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      occurrence.current_status_id = req.body.status_id;
      await occurrence.save();

      await OccurrenceStatusHistory.create({
        occurrence_id: occurrence.id,
        status_id: req.body.status_id
      });

      const status = await Status.findByPk(req.body.status_id);
      if (status && isClosedStatus(status)) {
        await occurrence.update({ resolution_date_actual: new Date() });
      }

      res.json({ message: "Status atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar status" });
    }
  },

  // Atualizar prioridade
  async updatePriority(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      occurrence.priority = req.body.priority;
      await occurrence.save();

      await OccurrencePriorityHistory.create({
        occurrence_id: occurrence.id,
        priority: req.body.priority
      });

      res.json({ message: "Prioridade atualizada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar prioridade" });
    }
  },

  async updateTreatment(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      const payload = {
        treatment_description: req.body.treatment_description,
        resolution_date_expected: req.body.resolution_date_expected,
        resolution_date_actual: req.body.resolution_date_actual
      };

      await occurrence.update(payload);

      return res.json(occurrence);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar tratamento" });
    }
  }
};

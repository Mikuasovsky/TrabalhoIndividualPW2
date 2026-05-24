import Occurrence from "../models/Occurrence.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import Status from "../models/Status.js";
import OccurrenceStatusHistory from "../models/OccurrenceStatusHistory.js";
import OccurrencePriorityHistory from "../models/OccurrencePriorityHistory.js";
import Comment from "../models/Comment.js";

export default {
  // Criar ocorrência
  async create(req, res) {
    try {
      const occurrence = await Occurrence.create({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        created_by: req.body.created_by,
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
        include: [
          { model: User },
          { model: Category },
          { model: Location },
          { model: Status },
          { model: Comment }
        ]
      });

      res.json(occurrences);
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
          { model: Comment }
        ]
      });

      if (!occurrence) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      res.json(occurrence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar ocorrência" });
    }
  },

  // Atualizar ocorrência
  async update(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      await occurrence.update(req.body);

      res.json(occurrence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar ocorrência" });
    }
  },

  // Apagar ocorrência
  async delete(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      await occurrence.destroy();

      res.json({ message: "Ocorrência apagada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar ocorrência" });
    }
  },

  // Atualizar status
  async updateStatus(req, res) {
    try {
      const occurrence = await Occurrence.findByPk(req.params.id);

      if (!occurrence) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      occurrence.current_status_id = req.body.status_id;
      await occurrence.save();

      await OccurrenceStatusHistory.create({
        occurrence_id: occurrence.id,
        status_id: req.body.status_id
      });

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

      if (!occurrence) {
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
  }
};

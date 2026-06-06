import { Op, Sequelize } from "sequelize";
import Occurrence from "../models/Occurrence.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import Status from "../models/Status.js";
import OccurrenceStatusHistory from "../models/OccurrenceStatusHistory.js";
import OccurrencePriorityHistory from "../models/OccurrencePriorityHistory.js";
import Comment from "../models/Comment.js";
import OccurrencePhoto from "../models/OccurrencePhoto.js";

const isClosedStatus = (status) => {
  const name = (status?.name || "").toLowerCase();
  return ["resolvida", "resolved", "rejeitada", "rejected"].includes(name);
};

const normalizePriority = (value) => {
  if (!value) return value;
  const normalized = String(value).toLowerCase();
  const map = {
    low: "baixa",
    medium: "media",
    high: "alta",
    critical: "critica"
  };
  return map[normalized] || normalized;
};

export default {
  // Criar ocorrência
  async create(req, res) {
    try {
      const userId = String(req.user?.sub || "");

      const priority = normalizePriority(req.body.priority) || "baixa";

      const occurrence = await Occurrence.create({
        title: req.body.title,
        description: req.body.description,
        priority,
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
        priority
      });

      if (Array.isArray(req.body.photos)) {
        const photos = req.body.photos
          .filter((url) => Boolean(url))
          .map((url) => ({ occurrence_id: occurrence.id, url }));

        if (photos.length > 0) {
          await OccurrencePhoto.bulkCreate(photos);
        }
      }

      res.status(201).json(occurrence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar ocorrência" });
    }
  },

  // Listar todas as ocorrências
  async getAll(req, res) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const offset = (page - 1) * limit;

      const where = { is_deleted: false };
      if (req.query.status_id) {
        where.current_status_id = req.query.status_id;
      }
      if (req.query.category_id) {
        where.category_id = req.query.category_id;
      }

      const locationInclude = {
        model: Location,
        ...(req.query.building
          ? { where: { building: { [Op.eq]: req.query.building } } }
          : {})
      };

      const { rows, count } = await Occurrence.findAndCountAll({
        where,
        include: [
          { model: User },
          { model: Category },
          locationInclude,
          { model: Status },
          { model: Comment, where: { is_deleted: false }, required: false }
        ],
        distinct: true,
        limit,
        offset
      });

      const role = req.user?.role;
      const data = role === "user"
        ? rows.filter((occurrence) => !isClosedStatus(occurrence.Status))
        : rows;

      return res.json({
        data,
        pagination: {
          page,
          limit,
          total: count
        },
        links: {
          self: {
            href: `/occurrences?page=${page}&limit=${limit}`
          }
        }
      });
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

      if (req.user?.role === "user" && isClosedStatus(occurrence.Status)) {
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

      const statusId = req.body.new_status_id || req.body.status_id;
      const note = req.body.note;
      const expectedDate = req.body.expected_resolution_date;
      const resolvedAt = req.body.resolved_at;

      if (!statusId) {
        return res.status(400).json({ error: "status_id obrigatorio" });
      }

      const currentStatus = await Status.findByPk(occurrence.current_status_id);
      if (currentStatus?.is_final && String(occurrence.current_status_id) !== String(statusId)) {
        return res.status(400).json({ error: "Transicao de status invalida" });
      }

      occurrence.current_status_id = statusId;
      await occurrence.save();

      await OccurrenceStatusHistory.create({
        occurrence_id: occurrence.id,
        status_id: statusId
      });

      const status = await Status.findByPk(statusId);
      const resolutionDateActual = resolvedAt
        || (status && isClosedStatus(status) ? new Date() : undefined);

      await occurrence.update({
        treatment_description: note || occurrence.treatment_description,
        resolution_date_expected: expectedDate || occurrence.resolution_date_expected,
        resolution_date_actual: resolutionDateActual || occurrence.resolution_date_actual
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

      if (!occurrence || occurrence.is_deleted) {
        return res.status(404).json({ error: "Ocorrência não encontrada" });
      }

      const priority = normalizePriority(req.body.priority);
      if (!priority) {
        return res.status(400).json({ error: "Prioridade obrigatoria" });
      }

      occurrence.priority = priority;
      await occurrence.save();

      await OccurrencePriorityHistory.create({
        occurrence_id: occurrence.id,
        priority
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
  },

  // Estatísticas - RESTful com query parameters
  async getStats(req, res) {
    try {
      const { group_by, stats, year } = req.query;

      // Agrupamento por categoria
      if (group_by === "category") {
        const data = await Occurrence.findAll({
          where: { is_deleted: false },
          attributes: [
            "category_id",
            [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
          ],
          include: [{ model: Category, attributes: ["id", "name"] }],
          group: ["category_id", "Category.id"],
          order: [[Sequelize.literal("count"), "DESC"]]
        });
        return res.json(data);
      }

      // Agrupamento por status
      if (group_by === "status") {
        const data = await Occurrence.findAll({
          where: { is_deleted: false },
          attributes: [
            "current_status_id",
            [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
          ],
          include: [{ model: Status, attributes: ["id", "name"] }],
          group: ["current_status_id", "Status.id"],
          order: [[Sequelize.literal("count"), "DESC"]]
        });
        return res.json(data);
      }

      // Agrupamento por building
      if (group_by === "building") {
        const data = await Occurrence.findAll({
          where: { is_deleted: false },
          attributes: [
            [Sequelize.col("Location.building"), "building"],
            [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
          ],
          include: [{ model: Location, attributes: [] }],
          group: ["Location.building"],
          order: [[Sequelize.literal("count"), "DESC"]],
          raw: true
        });
        return res.json(data);
      }

      // Tempo médio de resolução
      if (stats === "average_resolution_time") {
        const data = await Occurrence.findAll({
          where: {
            is_deleted: false,
            resolution_date_actual: { [Op.ne]: null }
          },
          attributes: [
            [
              Sequelize.fn(
                "AVG",
                Sequelize.literal(
                  "TIMESTAMPDIFF(DAY, createdAt, resolution_date_actual)"
                )
              ),
              "avg_days"
            ],
            [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
          ],
          raw: true
        });
        return res.json(data[0]);
      }

      // Evolução mensal
      if (stats === "monthly_evolution") {
        const where = { is_deleted: false };
        if (year) {
          where.createdAt = {
            [Sequelize.Op.between]: [
              new Date(`${year}-01-01T00:00:00Z`),
              new Date(`${year}-12-31T23:59:59Z`)
            ]
          };
        }

        const data = await Occurrence.findAll({
          where,
          attributes: [
            [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
            [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
          ],
          group: ["month"],
          order: [[Sequelize.literal("month"), "ASC"]],
          raw: true
        });
        return res.json(data);
      }

      // Se não houver parâmetro de estatística, retorna erro
      return res.status(400).json({ 
        error: "Parâmetro inválido. Use: group_by=category|status|building ou stats=average_resolution_time|monthly_evolution" 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  }
};

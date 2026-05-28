import { Sequelize } from "sequelize";
import Occurrence from "../models/Occurrence.js";
import Category from "../models/Category.js";
import Status from "../models/Status.js";
import Location from "../models/Location.js";

export default {
  async occurrencesByCategory(req, res) {
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  },

  async occurrencesByStatus(req, res) {
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  },

  async occurrencesByBuilding(req, res) {
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  },

  async averageResolutionTime(req, res) {
    try {
      const { Op } = Sequelize;
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  },

  async monthlyEvolution(req, res) {
    try {
      const data = await Occurrence.findAll({
        where: { is_deleted: false },
        attributes: [
          [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("Occurrence.id")), "count"]
        ],
        group: ["month"],
        order: [[Sequelize.literal("month"), "ASC"]],
        raw: true
      });

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao obter estatísticas" });
    }
  }
};

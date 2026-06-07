// Importação dos modelos Employee e User
import Employee from "../models/Employee.js";
import User from "../models/User.js";

export default {
  // Criar funcionário (admin only)
  async create(req, res) {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar funcionário" });
    }
  },

  // Listar todos os funcionários (admin only)
  async getAll(req, res) {
    try {
      const employees = await Employee.findAll({
        include: [{ model: User }]  // Incluir dados do utilizador associado
      });
      res.json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar funcionários" });
    }
  },

  // Buscar funcionário por ID
  async getById(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id, {
        include: [{ model: User }]
      });

      if (!employee) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar funcionário" });
    }
  },

  // Atualizar funcionário
  async update(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);

      if (!employee) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      await employee.update(req.body);
      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar funcionário" });
    }
  },

  // Apagar funcionário
  async delete(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);

      if (!employee) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      await employee.destroy();
      res.json({ message: "Funcionário apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar funcionário" });
    }
  },

  // Validar funcionário (admin only)
  async validate(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id, {
        include: [{ model: User }]
      });

      if (!employee) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      if (!employee.User) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      // Determinar se deve validar ou invalidar
      const isValidated = typeof req.body.is_validated === "boolean"
        ? req.body.is_validated
        : true;

      // Atualizar o campo is_validated do utilizador
      await employee.User.update({ is_validated: isValidated });

      return res.json({
        id: employee.User.id,
        name: employee.User.name,
        email: employee.User.email,
        role: employee.User.role,
        is_validated: employee.User.is_validated
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao validar funcionário" });
    }
  }
};

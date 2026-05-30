import Employee from "../models/Employee.js";
import User from "../models/User.js";

export default {
  async create(req, res) {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar employee" });
    }
  },

  async getAll(req, res) {
    try {
      const employees = await Employee.findAll({
        include: [{ model: User }]
      });
      res.json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar employees" });
    }
  },

  async getById(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id, {
        include: [{ model: User }]
      });

      if (!employee) {
        return res.status(404).json({ error: "Employee não encontrado" });
      }

      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar employee" });
    }
  },

  async update(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);

      if (!employee) {
        return res.status(404).json({ error: "Employee não encontrado" });
      }

      await employee.update(req.body);
      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar employee" });
    }
  },

  async delete(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);

      if (!employee) {
        return res.status(404).json({ error: "Employee não encontrado" });
      }

      await employee.destroy();
      res.json({ message: "Employee apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar employee" });
    }
  },

  async validate(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id, {
        include: [{ model: User }]
      });

      if (!employee) {
        return res.status(404).json({ error: "Employee não encontrado" });
      }

      if (!employee.User) {
        return res.status(404).json({ error: "User não encontrado" });
      }

      const isValidated = typeof req.body.is_validated === "boolean"
        ? req.body.is_validated
        : true;

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
      return res.status(500).json({ error: "Erro ao validar funcionario" });
    }
  }
};

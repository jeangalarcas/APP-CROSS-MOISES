import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de admin a todas as rotas
router.use(adminMiddleware);

// ===== BOXES =====

// Listar boxes do usuário
router.get('/boxes', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM boxes WHERE owner_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar boxes:', error);
    res.status(500).json({ error: 'Erro ao listar boxes' });
  }
});

// Criar novo box
router.post('/boxes', async (req, res) => {
  try {
    const { name, cnpj, email, phone, address, city, state, zip_code } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome do box é obrigatório' });
    }

    const boxId = uuidv4();
    const result = await query(
      `INSERT INTO boxes (id, name, cnpj, email, phone, address, city, state, zip_code, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [boxId, name, cnpj, email, phone, address, city, state, zip_code, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar box:', error);
    res.status(500).json({ error: 'Erro ao criar box' });
  }
});

// ===== PLANOS =====

// Listar planos de um box
router.get('/boxes/:boxId/plans', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM plans WHERE box_id = $1 ORDER BY price ASC',
      [req.params.boxId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar planos:', error);
    res.status(500).json({ error: 'Erro ao listar planos' });
  }
});

// Criar novo plano
router.post('/boxes/:boxId/plans', async (req, res) => {
  try {
    const { name, description, price, duration_days } = req.body;

    if (!name || !price || !duration_days) {
      return res.status(400).json({ error: 'Nome, preço e duração são obrigatórios' });
    }

    const planId = uuidv4();
    const result = await query(
      `INSERT INTO plans (id, box_id, name, description, price, duration_days)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [planId, req.params.boxId, name, description, price, duration_days]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar plano:', error);
    res.status(500).json({ error: 'Erro ao criar plano' });
  }
});

// ===== AULAS =====

// Listar aulas de um box
router.get('/boxes/:boxId/classes', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM classes WHERE box_id = $1 ORDER BY name ASC',
      [req.params.boxId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar aulas:', error);
    res.status(500).json({ error: 'Erro ao listar aulas' });
  }
});

// Criar nova aula
router.post('/boxes/:boxId/classes', async (req, res) => {
  try {
    const { name, description, capacity, duration_minutes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da aula é obrigatório' });
    }

    const classId = uuidv4();
    const result = await query(
      `INSERT INTO classes (id, box_id, name, description, capacity, duration_minutes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [classId, req.params.boxId, name, description, capacity, duration_minutes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ error: 'Erro ao criar aula' });
  }
});

// ===== AGENDAMENTOS =====

// Listar agendamentos de uma aula
router.get('/classes/:classId/schedules', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM schedules WHERE class_id = $1 ORDER BY scheduled_date ASC',
      [req.params.classId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

// Criar novo agendamento
router.post('/classes/:classId/schedules', async (req, res) => {
  try {
    const { scheduled_date, start_time, end_time, capacity } = req.body;

    if (!scheduled_date || !start_time || !end_time) {
      return res.status(400).json({ error: 'Data e horários são obrigatórios' });
    }

    const scheduleId = uuidv4();
    const result = await query(
      `INSERT INTO schedules (id, class_id, scheduled_date, start_time, end_time, capacity)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [scheduleId, req.params.classId, scheduled_date, start_time, end_time, capacity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// ===== ALUNOS =====

// Listar alunos de um box
router.get('/boxes/:boxId/students', async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, u.name, u.email, p.name as plan_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN plans p ON s.plan_id = p.id
       WHERE s.box_id = $1
       ORDER BY u.name ASC`,
      [req.params.boxId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ error: 'Erro ao listar alunos' });
  }
});

// ===== COBRANÇAS =====

// Listar cobranças pendentes
router.get('/boxes/:boxId/payments', async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, u.name, u.email
       FROM payments p
       JOIN students s ON p.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE s.box_id = $1 AND p.status = 'pending'
       ORDER BY p.due_date ASC`,
      [req.params.boxId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar cobranças:', error);
    res.status(500).json({ error: 'Erro ao listar cobranças' });
  }
});

// ===== DASHBOARD =====

// Estatísticas do box
router.get('/boxes/:boxId/stats', async (req, res) => {
  try {
    const boxId = req.params.boxId;

    const [students, activeStudents, totalRevenue, pendingPayments] = await Promise.all([
      query('SELECT COUNT(*) as count FROM students WHERE box_id = $1', [boxId]),
      query('SELECT COUNT(*) as count FROM students WHERE box_id = $1 AND status = $2', [boxId, 'active']),
      query('SELECT SUM(amount) as total FROM payments WHERE student_id IN (SELECT id FROM students WHERE box_id = $1) AND status = $2', [boxId, 'paid']),
      query('SELECT COUNT(*) as count FROM payments WHERE student_id IN (SELECT id FROM students WHERE box_id = $1) AND status = $2', [boxId, 'pending']),
    ]);

    res.json({
      totalStudents: parseInt(students.rows[0].count),
      activeStudents: parseInt(activeStudents.rows[0].count),
      totalRevenue: parseFloat(totalRevenue.rows[0].total || 0),
      pendingPayments: parseInt(pendingPayments.rows[0].count),
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
});

export default router;

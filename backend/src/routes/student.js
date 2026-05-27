import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/index.js';
import { studentMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de student a todas as rotas
router.use(studentMiddleware);

// ===== PERFIL =====

// Obter perfil do aluno
router.get('/profile', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.*, s.id as student_id, s.box_id, s.plan_id, s.status, s.enrollment_date, s.expiration_date, p.name as plan_name, p.price, b.name as box_name
       FROM users u
       LEFT JOIN students s ON u.id = s.user_id
       LEFT JOIN plans p ON s.plan_id = p.id
       LEFT JOIN boxes b ON s.box_id = b.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
});

// Atualizar perfil
router.put('/profile', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const result = await query(
      'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [name, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// ===== AULAS E AGENDAMENTOS =====

// Listar aulas disponíveis
router.get('/classes', async (req, res) => {
  try {
    // Primeiro, obter o box_id do aluno
    const studentResult = await query(
      'SELECT box_id FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const boxId = studentResult.rows[0].box_id;

    const result = await query(
      'SELECT * FROM classes WHERE box_id = $1 AND is_active = true ORDER BY name ASC',
      [boxId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar aulas:', error);
    res.status(500).json({ error: 'Erro ao listar aulas' });
  }
});

// Listar agendamentos de uma aula
router.get('/classes/:classId/schedules', async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, COUNT(r.id) as reserved_count
       FROM schedules s
       LEFT JOIN reservations r ON s.id = r.schedule_id AND r.status = 'reserved'
       WHERE s.class_id = $1 AND s.is_active = true
       GROUP BY s.id
       ORDER BY s.scheduled_date ASC`,
      [req.params.classId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

// ===== RESERVAS =====

// Listar minhas reservas
router.get('/reservations', async (req, res) => {
  try {
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const studentId = studentResult.rows[0].id;

    const result = await query(
      `SELECT r.*, c.name as class_name, s.scheduled_date, s.start_time, s.end_time
       FROM reservations r
       JOIN schedules s ON r.schedule_id = s.id
       JOIN classes c ON s.class_id = c.id
       WHERE r.student_id = $1
       ORDER BY s.scheduled_date DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({ error: 'Erro ao listar reservas' });
  }
});

// Fazer reserva
router.post('/reservations', async (req, res) => {
  try {
    const { scheduleId } = req.body;

    if (!scheduleId) {
      return res.status(400).json({ error: 'ID do agendamento é obrigatório' });
    }

    // Obter student_id
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const studentId = studentResult.rows[0].id;

    // Verificar se já existe reserva
    const existingReservation = await query(
      'SELECT id FROM reservations WHERE student_id = $1 AND schedule_id = $2',
      [studentId, scheduleId]
    );

    if (existingReservation.rows.length > 0) {
      return res.status(409).json({ error: 'Você já tem uma reserva para este horário' });
    }

    // Verificar capacidade
    const scheduleData = await query(
      'SELECT capacity FROM schedules WHERE id = $1',
      [scheduleId]
    );

    const reservedCount = await query(
      'SELECT COUNT(*) as count FROM reservations WHERE schedule_id = $1 AND status = $2',
      [scheduleId, 'reserved']
    );

    if (parseInt(reservedCount.rows[0].count) >= scheduleData.rows[0].capacity) {
      return res.status(409).json({ error: 'Capacidade máxima atingida' });
    }

    // Criar reserva
    const reservationId = uuidv4();
    const result = await query(
      `INSERT INTO reservations (id, student_id, schedule_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [reservationId, studentId, scheduleId, 'reserved']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao fazer reserva:', error);
    res.status(500).json({ error: 'Erro ao fazer reserva' });
  }
});

// Cancelar reserva
router.delete('/reservations/:reservationId', async (req, res) => {
  try {
    const result = await query(
      'UPDATE reservations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['cancelled', req.params.reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro ao cancelar reserva' });
  }
});

// ===== CHECK-IN =====

// Fazer check-in
router.post('/reservations/:reservationId/checkin', async (req, res) => {
  try {
    const result = await query(
      `UPDATE reservations SET check_in_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [req.params.reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao fazer check-in:', error);
    res.status(500).json({ error: 'Erro ao fazer check-in' });
  }
});

// ===== COBRANÇAS =====

// Listar minhas cobranças
router.get('/payments', async (req, res) => {
  try {
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const studentId = studentResult.rows[0].id;

    const result = await query(
      'SELECT * FROM payments WHERE student_id = $1 ORDER BY due_date DESC',
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar cobranças:', error);
    res.status(500).json({ error: 'Erro ao listar cobranças' });
  }
});

export default router;

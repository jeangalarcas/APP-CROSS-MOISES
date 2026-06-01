import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// Função auxiliar: Descobrir qual é o Box que este administrador gerencia
async function getAdminBoxId(userId) {
  // Primeiro, tenta ver se ele é o dono (owner) de algum box
  let result = await query('SELECT id FROM boxes WHERE owner_id = $1', [userId]);
  if (result.rows.length > 0) return result.rows[0].id;

  // Se não for o dono, vê se ele tem um box_id atrelado ao perfil dele (ex: um professor contratado)
  result = await query('SELECT box_id FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.box_id;
}

// ==========================================
// 1. GERENCIAR AULAS / WODs (Templates)
// ==========================================

// Listar todos os tipos de aulas do Box
router.get('/classes', async (req, res) => {
  try {
    const boxId = await getAdminBoxId(req.user.id);
    if (!boxId) return res.status(403).json({ error: 'Nenhum Box vinculado a este usuário.' });

    const result = await query('SELECT * FROM classes WHERE box_id = $1 ORDER BY created_at DESC', [boxId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar aulas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar aulas.' });
  }
});

// Criar um novo tipo de aula (Ex: "WOD LPO")
router.post('/classes', async (req, res) => {
  const { name, description, capacity, duration_minutes } = req.body;

  try {
    const boxId = await getAdminBoxId(req.user.id);
    if (!boxId) return res.status(403).json({ error: 'Nenhum Box vinculado a este usuário.' });

    const sql = `
      INSERT INTO classes (box_id, name, description, capacity, duration_minutes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [boxId, name, description, capacity || 20, duration_minutes || 60]);
    
    res.status(201).json({ message: 'Aula criada com sucesso!', class: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ error: 'Erro ao cadastrar nova aula.' });
  }
});

// ==========================================
// 2. GERENCIAR A AGENDA (Horários reais)
// ==========================================

// Listar a agenda do Box
router.get('/schedules', async (req, res) => {
  try {
    const boxId = await getAdminBoxId(req.user.id);
    if (!boxId) return res.status(403).json({ error: 'Nenhum Box vinculado a este usuário.' });

    const sql = `
      SELECT 
        s.*, 
        c.name AS class_name,
        (SELECT COUNT(*) FROM reservations r WHERE r.schedule_id = s.id) AS booked_spots
      FROM schedules s
      JOIN classes c ON s.class_id = c.id
      WHERE c.box_id = $1
      ORDER BY s.scheduled_date DESC, s.start_time DESC
    `;
    const result = await query(sql, [boxId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agenda:', error);
    res.status(500).json({ error: 'Erro interno ao buscar agenda.' });
  }
});

// Abrir um novo horário na agenda
router.post('/schedules', async (req, res) => {
  const { class_id, scheduled_date, start_time, end_time, capacity } = req.body;

  try {
    // Busca a capacidade padrão da aula se o professor não tiver definido uma específica
    let finalCapacity = capacity;
    if (!finalCapacity) {
      const classResult = await query('SELECT capacity FROM classes WHERE id = $1', [class_id]);
      finalCapacity = classResult.rows[0]?.capacity || 20;
    }

    const sql = `
      INSERT INTO schedules (class_id, scheduled_date, start_time, end_time, capacity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [class_id, scheduled_date, start_time, end_time, finalCapacity]);
    
    res.status(201).json({ message: 'Horário aberto com sucesso!', schedule: result.rows[0] });
  } catch (error) {
    console.error('Erro ao abrir horário na agenda:', error);
    res.status(500).json({ error: 'Erro ao abrir novo horário.' });
  }
});

// ==========================================
// 3. VER A LISTA DE CHAMADA (Check-ins)
// ==========================================

// Ver quais alunos estão agendados para um horário específico
router.get('/schedules/:id/reservations', async (req, res) => {
  const { id } = req.params;

  try {
    const sql = `
      SELECT 
        r.id AS reservation_id,
        r.status,
        r.check_in_time,
        u.name AS student_name,
        u.email AS student_email
      FROM reservations r
      JOIN students st ON r.student_id = st.id
      JOIN users u ON st.user_id = u.id
      WHERE r.schedule_id = $1
      ORDER BY r.created_at ASC
    `;
    const result = await query(sql, [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar lista de chamada:', error);
    res.status(500).json({ error: 'Erro ao buscar alunos matriculados.' });
  }
});

export default router;
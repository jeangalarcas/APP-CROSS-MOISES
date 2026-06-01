import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// Função auxiliar: Pegar o ID de estudante do usuário logado
async function getStudentInfo(userId) {
  const result = await query('SELECT id, box_id FROM students WHERE user_id = $1', [userId]);
  return result.rows[0];
}

// ==========================================
// 1. LISTAR HORÁRIOS DISPONÍVEIS (Agenda)
// ==========================================
router.get('/schedules', async (req, res) => {
  try {
    const student = await getStudentInfo(req.user.id);
    if (!student) return res.status(404).json({ error: 'Perfil de aluno não encontrado.' });

    // Busca os horários do box do aluno, de hoje em diante, contando quantas vagas já foram ocupadas
    const sql = `
      SELECT 
        s.id AS schedule_id,
        s.scheduled_date,
        s.start_time,
        s.end_time,
        s.capacity AS total_capacity,
        c.name AS class_name,
        c.description,
        (SELECT COUNT(*) FROM reservations r WHERE r.schedule_id = s.id) AS reservations_count
      FROM schedules s
      JOIN classes c ON s.class_id = c.id
      WHERE c.box_id = $1 
        AND s.scheduled_date >= CURRENT_DATE
        AND s.is_active = true
      ORDER BY s.scheduled_date, s.start_time
    `;
    
    const result = await query(sql, [student.box_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar agenda:', error);
    res.status(500).json({ error: 'Erro ao buscar horários.' });
  }
});

// ==========================================
// 2. FAZER UMA RESERVA (Check-in)
// ==========================================
router.post('/reservations', async (req, res) => {
  const { schedule_id } = req.body;

  try {
    const student = await getStudentInfo(req.user.id);
    if (!student) return res.status(404).json({ error: 'Perfil de aluno não encontrado.' });

    // Tenta inserir a reserva no banco
    const sql = `
      INSERT INTO reservations (student_id, schedule_id, status)
      VALUES ($1, $2, 'reserved')
      RETURNING *
    `;
    const result = await query(sql, [student.id, schedule_id]);

    res.status(201).json({ 
      message: 'Reserva confirmada com sucesso!', 
      reservation: result.rows[0] 
    });

  } catch (error) {
    // 23505 é o código de erro do PostgreSQL para "Quebra de regra UNIQUE" (Duplicidade)
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Você já fez check-in nesta aula!' });
    }
    console.error('Erro ao fazer reserva:', error);
    res.status(500).json({ error: 'Erro interno ao processar a reserva.' });
  }
});

// ==========================================
// 3. VER MINHAS RESERVAS (Histórico do Aluno)
// ==========================================
router.get('/my-reservations', async (req, res) => {
  try {
    const student = await getStudentInfo(req.user.id);
    if (!student) return res.status(404).json({ error: 'Perfil de aluno não encontrado.' });

    const sql = `
      SELECT 
        r.id AS reservation_id,
        r.status,
        s.scheduled_date,
        s.start_time,
        c.name AS class_name
      FROM reservations r
      JOIN schedules s ON r.schedule_id = s.id
      JOIN classes c ON s.class_id = c.id
      WHERE r.student_id = $1
      ORDER BY s.scheduled_date DESC, s.start_time DESC
    `;
    
    const result = await query(sql, [student.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar reservas do aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar o seu histórico.' });
  }
});

export default router;
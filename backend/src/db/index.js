import pkg from 'pg';
const { Pool } = pkg;

let pool;

export async function initializeDatabase() {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'boxos_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  pool.on('error', (err) => {
    console.error('Erro inesperado no pool de conexões:', err);
  });

  // Testar conexão
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexão com PostgreSQL estabelecida:', result.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', error);
    throw error;
  }

  // Criar tabelas se não existirem
  await createTables();
}

async function createTables() {
  const queries = [
    // Tabela de usuários
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      box_id UUID,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabela de boxes
    `CREATE TABLE IF NOT EXISTS boxes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      cnpj VARCHAR(18) UNIQUE,
      email VARCHAR(255),
      phone VARCHAR(20),
      address VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(2),
      zip_code VARCHAR(10),
      owner_id UUID NOT NULL REFERENCES users(id),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabela de planos
    `CREATE TABLE IF NOT EXISTS plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      box_id UUID NOT NULL REFERENCES boxes(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      duration_days INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabela de alunos
    `CREATE TABLE IF NOT EXISTS students (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      box_id UUID NOT NULL REFERENCES boxes(id),
      plan_id UUID REFERENCES plans(id),
      status VARCHAR(50) DEFAULT 'active',
      enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expiration_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabela de aulas/WODs
    `CREATE TABLE IF NOT EXISTS classes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      box_id UUID NOT NULL REFERENCES boxes(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      coach_id UUID REFERENCES users(id),
      capacity INTEGER DEFAULT 20,
      duration_minutes INTEGER DEFAULT 60,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabela de agendamentos
    `CREATE TABLE IF NOT EXISTS schedules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      class_id UUID NOT NULL REFERENCES classes(id),
      scheduled_date TIMESTAMP NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      capacity INTEGER DEFAULT 20,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabela de reservas
    `CREATE TABLE IF NOT EXISTS reservations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES students(id),
      schedule_id UUID NOT NULL REFERENCES schedules(id),
      status VARCHAR(50) DEFAULT 'reserved',
      check_in_time TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, schedule_id)
    )`,

    // Tabela de cobranças
    `CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES students(id),
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      due_date DATE NOT NULL,
      paid_date DATE,
      payment_method VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Índices para performance
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_box_id ON users(box_id)`,
    `CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_students_box_id ON students(box_id)`,
    `CREATE INDEX IF NOT EXISTS idx_reservations_student_id ON reservations(student_id)`,
    `CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id)`,
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
    }
  }
}

export function getPool() {
  if (!pool) {
    throw new Error('Pool de conexões não inicializado');
  }
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    console.log('✅ Conexão com banco de dados fechada');
  }
}

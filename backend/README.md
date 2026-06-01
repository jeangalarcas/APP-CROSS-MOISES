# BoxOS Backend - API

API central do sistema BoxOS, desenvolvida com Node.js, Express e PostgreSQL.

## Funcionalidades

- **Autenticação JWT** com email/senha
- **Gestão de Boxes** (academias/estúdios)
- **Planos de Mensalidade** com duração configurável
- **Aulas e Agendamentos** com capacidade limitada
- **Reservas de Alunos** com check-in
- **Gestão de Cobranças** recorrentes
- **Dashboard Administrativo** com estatísticas
- **Controle de Acesso** por papéis (owner, admin, student)

## Requisitos

- Node.js 18+
- PostgreSQL 12+
- pnpm ou npm

## Setup Local

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com seus dados:

```bash
cp .env.example .env
```

Edite `.env`:

```env
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boxos_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=sua-chave-secreta-super-segura
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

### 3. Criar banco de dados PostgreSQL

```bash
createdb boxos_dev
```

### 4. Iniciar servidor

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3001`.

## Estrutura de Diretórios

```
backend/
├── src/
│   ├── index.js              # Entrada da aplicação
│   ├── db/
│   │   └── index.js          # Configuração PostgreSQL
│   ├── middleware/
│   │   ├── auth.js           # Autenticação JWT
│   │   └── errorHandler.js   # Tratamento de erros
│   └── routes/
│       ├── auth.js           # Login, registro, refresh token
│       ├── admin.js          # Gestão de boxes, planos, aulas
│       └── student.js        # Reservas, check-in, perfil
├── .env.example
├── package.json
└── README.md
```

## Rotas da API

### Autenticação (Público)

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token JWT

### Admin (Requer autenticação + role admin/owner)

- `GET /api/admin/boxes` - Listar boxes
- `POST /api/admin/boxes` - Criar novo box
- `GET /api/admin/boxes/:boxId/plans` - Listar planos
- `POST /api/admin/boxes/:boxId/plans` - Criar plano
- `GET /api/admin/boxes/:boxId/classes` - Listar aulas
- `POST /api/admin/boxes/:boxId/classes` - Criar aula
- `GET /api/admin/classes/:classId/schedules` - Listar agendamentos
- `POST /api/admin/classes/:classId/schedules` - Criar agendamento
- `GET /api/admin/boxes/:boxId/students` - Listar alunos
- `GET /api/admin/boxes/:boxId/payments` - Listar cobranças
- `GET /api/admin/boxes/:boxId/stats` - Estatísticas do box

### Aluno (Requer autenticação + role student)

- `GET /api/student/profile` - Obter perfil
- `PUT /api/student/profile` - Atualizar perfil
- `GET /api/student/classes` - Listar aulas disponíveis
- `GET /api/student/classes/:classId/schedules` - Listar agendamentos
- `GET /api/student/reservations` - Minhas reservas
- `POST /api/student/reservations` - Fazer reserva
- `DELETE /api/student/reservations/:reservationId` - Cancelar reserva
- `POST /api/student/reservations/:reservationId/checkin` - Check-in
- `GET /api/student/payments` - Minhas cobranças

## Autenticação

Todas as rotas protegidas requerem um header `Authorization`:

```
Authorization: Bearer <seu-token-jwt>
```

## Exemplo de Requisição

### Registro

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123",
    "name": "João Silva",
    "role": "student"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "senha123"
  }'
```

### Criar Box (Admin)

```bash
curl -X POST http://localhost:3001/api/admin/boxes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Box Funcional",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@boxfuncional.com",
    "phone": "(11) 99999-9999",
    "address": "Rua Principal, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567"
  }'
```

## Testes

```bash
pnpm test
```

## Linting e Formatação

```bash
pnpm lint
pnpm format
```

## Deploy

### Variáveis de Ambiente para Produção

Certifique-se de definir:

- `NODE_ENV=production`
- `JWT_SECRET` com uma chave forte e única
- `DB_*` com credenciais do banco de produção
- `CORS_ORIGIN` com os domínios permitidos

### Usando Docker

```bash
docker build -t boxos-backend .
docker run -p 3001:3001 --env-file .env boxos-backend
```

## Troubleshooting

### Erro de conexão com PostgreSQL

Verifique se o PostgreSQL está rodando e as credenciais em `.env` estão corretas.

### Erro de CORS

Adicione os domínios do frontend à variável `CORS_ORIGIN` em `.env`.

### Token expirado

Faça uma requisição POST para `/api/auth/refresh` com o token antigo para obter um novo.

## Licença

MIT

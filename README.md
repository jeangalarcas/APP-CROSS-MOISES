# BoxOS - Sistema Completo de Gestão para Boxes de Academia

**BoxOS** é uma plataforma completa e moderna para gerenciar academias e boxes de CrossFit, oferecendo um painel administrativo web e um portal PWA responsivo para alunos.

## 🎯 Visão Geral

O sistema é dividido em três componentes principais:

| Componente | Descrição | Tecnologia |
|---|---|---|
| **Backend API** | API RESTful com autenticação JWT, gestão de boxes, planos, aulas e cobranças | Node.js, Express, PostgreSQL |
| **Painel Admin** | Interface web para donos/gerentes gerenciarem boxes, alunos, aulas e cobranças | React 18, Tailwind CSS, Zustand |
| **Portal Aluno** | App PWA responsivo para alunos fazerem reservas, check-in e acompanhar cobranças | React 18, Tailwind CSS, PWA |

## 📁 Estrutura do Projeto

```
APP-CROSS-MOISES/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── index.js
│   │   ├── db/           # Configuração PostgreSQL
│   │   ├── middleware/   # Auth, error handling
│   │   └── routes/       # Auth, admin, student
│   ├── .env.example
│   └── package.json
├── admin/                # Painel administrativo React
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
├── aluno/                # Portal PWA do aluno
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
├── docs/                 # Documentação
├── .github/workflows/    # CI/CD
├── package.json          # Workspace root
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- pnpm 8+

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie os arquivos `.env.example` para `.env` em cada pasta:

```bash
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais PostgreSQL
```

### 3. Inicializar Banco de Dados

```bash
createdb boxos_dev
pnpm db:migrate
pnpm db:seed  # Opcional: popular com dados de teste
```

### 4. Iniciar Desenvolvimento

```bash
# Inicia backend, admin e aluno simultaneamente
pnpm dev
```

Acesse:
- **Backend**: http://localhost:3001
- **Admin**: http://localhost:3000
- **Aluno**: http://localhost:3002

## 📚 Documentação

Cada componente possui sua própria documentação detalhada:

- [Backend README](./backend/README.md) - API, rotas, autenticação
- [Admin README](./admin/README.md) - Painel administrativo
- [Aluno README](./aluno/README.md) - Portal do aluno

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Tokens)** para autenticação. Fluxo básico:

1. Usuário faz login com email/senha
2. API retorna um token JWT
3. Token é armazenado no localStorage
4. Todas as requisições incluem o token no header `Authorization: Bearer <token>`

## 👥 Papéis de Usuário

| Papel | Permissões |
|---|---|
| **Owner** | Criar/gerenciar boxes, visualizar todas as estatísticas, gerenciar admins |
| **Admin** | Gerenciar alunos, aulas, cobranças dentro de um box |
| **Student** | Fazer reservas, check-in, visualizar cobranças |

## 🗄️ Modelo de Dados

### Tabelas Principais

- **users** - Usuários do sistema (owner, admin, student)
- **boxes** - Academias/estúdios
- **plans** - Planos de mensalidade
- **classes** - Aulas (WODs, treinos)
- **schedules** - Agendamentos de aulas
- **students** - Alunos vinculados a boxes
- **reservations** - Reservas de alunos em aulas
- **payments** - Cobranças recorrentes

## 🔄 Fluxos Principais

### Fluxo de Reserva (Aluno)

1. Aluno acessa "Aulas Disponíveis"
2. Visualiza agendamentos com vagas
3. Clica em "Reservar"
4. Sistema verifica capacidade
5. Reserva é criada e confirmada

### Fluxo de Check-in (Aluno)

1. Aluno chega no box
2. Abre "Minhas Reservas"
3. Clica em "Check-in" na aula do dia
4. Sistema registra horário de chegada

### Fluxo de Gestão de Cobranças (Admin)

1. Admin acessa "Cobranças"
2. Visualiza cobranças pendentes por aluno
3. Marca como "Paga" quando receber
4. Sistema atualiza status

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia todos os serviços

# Build
pnpm build            # Build de todos os componentes

# Linting e Formatação
pnpm lint             # Lint em todos os projetos
pnpm format           # Formata código

# Testes
pnpm test             # Roda testes

# Database
pnpm db:migrate       # Executa migrações
pnpm db:seed          # Popula dados de teste
```

### Adicionar Dependências

Para adicionar uma dependência a um workspace específico:

```bash
pnpm add -F backend express
pnpm add -F admin react-router-dom
```

## 🚢 Deploy

### Deploy do Backend

O backend pode ser deployado em qualquer serviço que suporte Node.js:

- **Railway**: `railway up`
- **Render**: Conectar repositório GitHub
- **Heroku**: `git push heroku main`
- **Docker**: Incluir Dockerfile

### Deploy do Frontend (Admin + Aluno)

Os frontends são aplicações estáticas e podem ser deployados em:

- **Vercel**: Conectar repositório, build automático
- **Netlify**: Drag-and-drop ou conectar GitHub
- **AWS S3 + CloudFront**: Para maior controle
- **GitHub Pages**: Para protótipos

## 🔒 Segurança

- ✅ Senhas hasheadas com bcryptjs
- ✅ Autenticação JWT com expiração
- ✅ CORS configurável
- ✅ Rate limiting em rotas públicas
- ✅ Validação de entrada com Joi
- ✅ Helmet para headers de segurança
- ⚠️ TODO: Implementar 2FA
- ⚠️ TODO: Implementar HTTPS obrigatório

## 📋 Roadmap

### Fase 1 (Atual) - MVP
- [x] Autenticação básica
- [x] CRUD de boxes e planos
- [x] Reservas de aulas
- [x] Check-in
- [x] Gestão de cobranças
- [x] Painel administrativo
- [x] Portal do aluno

### Fase 2 - Melhorias
- [ ] Integração com Stripe para pagamentos
- [ ] Notificações por email/SMS
- [ ] Relatórios avançados
- [ ] Integração com Google Calendar
- [ ] App nativo (React Native)
- [ ] Autenticação social (Google, Apple)

### Fase 3 - Escalabilidade
- [ ] Cache com Redis
- [ ] Fila de jobs (Bull)
- [ ] Microserviços
- [ ] Análise e BI
- [ ] Marketplace de integrações

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para detalhes.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório GitHub.

---

**Desenvolvido com ❤️ para a comunidade de boxes e academias**
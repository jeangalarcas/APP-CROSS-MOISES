# BoxOS Admin - Painel Administrativo

Painel administrativo web para donos e gerentes de boxes gerenciarem suas operações.

## 🎯 Funcionalidades

- **Dashboard** com estatísticas em tempo real
- **Gestão de Boxes** - criar e editar múltiplos boxes
- **Gestão de Alunos** - visualizar, adicionar e remover alunos
- **Gestão de Aulas** - criar aulas (WODs) e agendamentos
- **Gestão de Cobranças** - acompanhar pagamentos de alunos
- **Relatórios** - visualizar métricas e performance

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 📦 Setup

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Iniciar desenvolvimento

```bash
pnpm dev
```

Acesse http://localhost:3000

## 📁 Estrutura

```
src/
├── pages/           # Páginas da aplicação
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Boxes.jsx
│   ├── Students.jsx
│   ├── Classes.jsx
│   ├── Payments.jsx
│   └── Profile.jsx
├── components/      # Componentes reutilizáveis
│   └── Layout.jsx
├── store/           # Zustand stores
│   └── authStore.js
├── App.jsx          # Roteamento principal
├── main.jsx         # Entry point
└── index.css        # Estilos globais
```

## 🔐 Autenticação

O painel usa autenticação JWT. Ao fazer login, o token é armazenado no localStorage e incluído em todas as requisições.

### Credenciais de Teste

```
Email: admin@example.com
Senha: password123
```

## 📊 Dashboard

O dashboard exibe:

- Total de alunos
- Alunos ativos
- Receita total
- Cobranças pendentes
- Gráficos de distribuição

## 🚀 Build

```bash
pnpm build
```

Saída em `dist/`

## 📝 Desenvolvimento

### Adicionar nova página

1. Crie arquivo em `src/pages/NovaPagina.jsx`
2. Importe em `src/App.jsx`
3. Adicione rota em `<Routes>`

### Adicionar novo componente

1. Crie arquivo em `src/components/NovoComponente.jsx`
2. Importe onde necessário

### Estilização

Use classes Tailwind CSS. Componentes customizados estão em `src/index.css`.

## 🔗 API Integration

Todas as requisições para a API usam o padrão:

```javascript
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const { token } = useAuthStore();

axios.get('/api/admin/boxes', {
  headers: { Authorization: `Bearer ${token}` },
});
```

## 🐛 Troubleshooting

### Erro de CORS

Verifique se o backend está rodando em `http://localhost:3001` e se a variável `VITE_API_URL` está correta.

### Token expirado

Faça logout e login novamente para obter um novo token.

### Página em branco

Verifique o console do navegador para erros. Certifique-se de que o backend está acessível.

## 📄 Licença

MIT

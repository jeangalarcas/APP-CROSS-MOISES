# BoxOS Aluno - Portal PWA do Aluno

App PWA responsivo para alunos gerenciarem suas aulas, reservas e cobranças.

## 🎯 Funcionalidades

- **Login/Registro** - Criar conta ou fazer login
- **Dashboard** - Visualizar status da mensalidade e próximas aulas
- **Aulas Disponíveis** - Listar aulas e agendamentos
- **Minhas Reservas** - Gerenciar reservas e fazer check-in
- **Cobranças** - Acompanhar pagamentos
- **Perfil** - Visualizar e editar dados pessoais
- **PWA** - Funciona offline e pode ser instalado como app

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite PWA Plugin** - Progressive Web App

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

Acesse http://localhost:3002

## 📁 Estrutura

```
src/
├── pages/           # Páginas da aplicação
│   ├── Login.jsx
│   ├── Home.jsx
│   ├── Classes.jsx
│   ├── Reservations.jsx
│   ├── Payments.jsx
│   └── Profile.jsx
├── components/      # Componentes reutilizáveis
│   └── BottomNav.jsx
├── store/           # Zustand stores
│   └── authStore.js
├── App.jsx          # Roteamento principal
├── main.jsx         # Entry point
└── index.css        # Estilos globais
```

## 📱 PWA Features

O app é uma Progressive Web App, o que significa:

- ✅ Funciona offline (com cache)
- ✅ Pode ser instalado como app (Android/iOS)
- ✅ Ícone na tela inicial
- ✅ Splash screen customizado
- ✅ Notificações push (em desenvolvimento)

### Instalar como App

**Android:**
1. Abra o app no Chrome
2. Clique em "Instalar" no menu
3. Confirme

**iOS:**
1. Abra o app no Safari
2. Clique em "Compartilhar"
3. Selecione "Adicionar à Tela Inicial"

## 🔐 Autenticação

O app usa autenticação JWT. Ao fazer login, o token é armazenado no localStorage.

### Credenciais de Teste

```
Email: aluno@example.com
Senha: password123
```

## 📊 Páginas

### Home
- Status da mensalidade
- Próximas reservas
- Quick actions

### Classes
- Lista de aulas disponíveis
- Agendamentos com vagas
- Filtros por horário

### Reservations
- Minhas reservas
- Status (reservado, cancelado, check-in)
- Opções para cancelar

### Payments
- Cobranças pendentes
- Histórico de pagamentos
- Status de cada cobrança

### Profile
- Dados pessoais
- Plano ativo
- Opção de logout

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
4. Adicione link em `src/components/BottomNav.jsx` se necessário

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

axios.get('/api/student/reservations', {
  headers: { Authorization: `Bearer ${token}` },
});
```

## 📱 Safe Area (Notch/Cutout)

O app suporta dispositivos com notch ou cutout. Use a classe `.safe-area-inset-*` quando necessário.

## 🐛 Troubleshooting

### Erro de CORS

Verifique se o backend está rodando em `http://localhost:3001` e se a variável `VITE_API_URL` está correta.

### Token expirado

Faça logout e login novamente para obter um novo token.

### Página em branco

Verifique o console do navegador para erros. Certifique-se de que o backend está acessível.

### PWA não funciona offline

Certifique-se de que o app foi instalado corretamente. O cache é gerenciado pelo Workbox.

## 🔄 Próximas Melhorias

- [ ] Notificações push
- [ ] Biometria (Face ID/Touch ID)
- [ ] QR code para check-in
- [ ] Histórico de aulas
- [ ] Integração com calendário
- [ ] Dark mode

## 📄 Licença

MIT

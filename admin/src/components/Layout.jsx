import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Home, Box, Users, Calendar, DollarSign, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-700">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Box size={24} />
            {sidebarOpen && <span>BoxOS</span>}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            icon={<Home size={20} />}
            label="Dashboard"
            open={sidebarOpen}
          />
          <NavLink
            to="/boxes"
            icon={<Box size={20} />}
            label="Boxes"
            open={sidebarOpen}
          />
          <NavLink
            to="/boxes"
            icon={<Users size={20} />}
            label="Alunos"
            open={sidebarOpen}
          />
          <NavLink
            to="/boxes"
            icon={<Calendar size={20} />}
            label="Aulas"
            open={sidebarOpen}
          />
          <NavLink
            to="/boxes"
            icon={<DollarSign size={20} />}
            label="Cobranças"
            open={sidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <NavLink
            to="/profile"
            icon={<User size={20} />}
            label="Perfil"
            open={sidebarOpen}
          />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Bem-vindo, {user?.name}</span>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label, open }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
    >
      {icon}
      {open && <span>{label}</span>}
    </Link>
  );
}

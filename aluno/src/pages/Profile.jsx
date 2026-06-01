import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Nome</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
      </div>
      <button onClick={handleLogout} className="w-full btn-danger flex items-center justify-center gap-2">
        <LogOut size={20} />
        Sair
      </button>
    </div>
  );
}

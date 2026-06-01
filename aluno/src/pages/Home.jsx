import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function Home() {
  const { user, token } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [profileRes, reservationsRes] = await Promise.all([
        axios.get(`${API_URL}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/student/reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProfile(profileRes.data);
      setReservations(reservationsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <p className="text-sm opacity-90">Bem-vindo de volta!</p>
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        {profile?.plan_name && (
          <p className="text-sm mt-2 opacity-90">Plano: {profile.plan_name}</p>
        )}
      </div>

      {/* Status */}
      {profile?.status === 'active' ? (
        <div className="card border-l-4 border-green-500 bg-green-50">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <span className="font-medium">Sua mensalidade está ativa</span>
          </div>
          {profile?.expiration_date && (
            <p className="text-sm text-green-600 mt-2">
              Válida até: {new Date(profile.expiration_date).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      ) : (
        <div className="card border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Sua mensalidade expirou</span>
          </div>
        </div>
      )}

      {/* Próximas Reservas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar size={20} />
          Próximas Reservas
        </h2>
        {reservations.length > 0 ? (
          <div className="space-y-2">
            {reservations.map((res) => (
              <div key={res.id} className="card">
                <p className="font-medium text-gray-900">{res.class_name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(res.scheduled_date).toLocaleDateString('pt-BR')} às{' '}
                  {res.start_time}
                </p>
                <div className="mt-2 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    res.status === 'reserved'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {res.status === 'reserved' ? 'Reservado' : 'Cancelado'}
                  </span>
                  {res.check_in_time && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      ✓ Check-in realizado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8 text-gray-600">
            <p>Nenhuma reserva próxima</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <a href="/classes" className="btn-primary text-center">
          Agendar Aula
        </a>
        <a href="/payments" className="btn-secondary text-center">
          Ver Cobranças
        </a>
      </div>
    </div>
  );
}

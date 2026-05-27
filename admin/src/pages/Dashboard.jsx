import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function Dashboard() {
  const { token, user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar boxes do usuário
        const boxesResponse = await axios.get(`${API_URL}/admin/boxes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (boxesResponse.data.length > 0) {
          const boxId = boxesResponse.data[0].id;
          const statsResponse = await axios.get(
            `${API_URL}/admin/boxes/${boxId}/stats`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  const chartData = [
    { name: 'Alunos Ativos', value: stats?.activeStudents || 0 },
    { name: 'Alunos Inativos', value: (stats?.totalStudents || 0) - (stats?.activeStudents || 0) },
  ];

  const COLORS = ['#3B82F6', '#EF4444'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users size={24} />}
          title="Total de Alunos"
          value={stats?.totalStudents || 0}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="Alunos Ativos"
          value={stats?.activeStudents || 0}
          color="green"
        />
        <StatCard
          icon={<DollarSign size={24} />}
          title="Receita Total"
          value={`R$ ${(stats?.totalRevenue || 0).toFixed(2)}`}
          color="purple"
        />
        <StatCard
          icon={<Calendar size={24} />}
          title="Cobranças Pendentes"
          value={stats?.pendingPayments || 0}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Distribuição de Alunos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo Financeiro
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Receita Total</span>
              <span className="text-2xl font-bold text-green-600">
                R$ {(stats?.totalRevenue || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Cobranças Pendentes</span>
              <span className="text-2xl font-bold text-red-600">
                {stats?.pendingPayments || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

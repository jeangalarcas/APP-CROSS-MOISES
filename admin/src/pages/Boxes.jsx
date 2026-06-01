import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function Boxes() {
  const { token } = useAuthStore();
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });

  useEffect(() => {
    fetchBoxes();
  }, [token]);

  const fetchBoxes = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/boxes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoxes(response.data);
    } catch (error) {
      console.error('Erro ao buscar boxes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBox = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/boxes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
      });
      setShowForm(false);
      fetchBoxes();
    } catch (error) {
      console.error('Erro ao criar box:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meus Boxes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Box
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Criar Novo Box</h2>
          <form onSubmit={handleCreateBox} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do Box"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Endereço"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Cidade"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Estado"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="CEP"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                Criar Box
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map((box) => (
          <Link key={box.id} to={`/boxes/${box.id}`}>
            <div className="card hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-900">{box.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{box.cnpj}</p>
              <p className="text-gray-600 text-sm">{box.email}</p>
              <p className="text-gray-600 text-sm">
                {box.city}, {box.state}
              </p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                  <Edit2 size={16} />
                  Editar
                </button>
                <button className="flex-1 btn-danger flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Deletar
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {boxes.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">Nenhum box criado ainda.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Criar seu primeiro box
          </button>
        </div>
      )}
    </div>
  );
}

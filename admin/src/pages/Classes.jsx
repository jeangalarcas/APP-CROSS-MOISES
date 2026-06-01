import { useState, useEffect } from 'react';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [duration, setDuration] = useState(60);

  // URL base da sua API (ajuste se você usar uma variável de ambiente global)
  const API_URL = import.meta.env.VITE_API_URL || 'https://boxos-api.onrender.com/api';
  
  // Pegar o token de autenticação salvo no login
  const token = localStorage.getItem('token'); 

  // Função para buscar as aulas cadastradas no banco
  const fetchClasses = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/classes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Falha ao buscar aulas');
      
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar as aulas assim que a tela abrir
  useEffect(() => {
    fetchClasses();
  }, []);

  // Função para salvar uma nova aula
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/admin/classes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          capacity: parseInt(capacity),
          duration_minutes: parseInt(duration)
        })
      });

      if (!response.ok) throw new Error('Erro ao criar aula');

      // Limpar formulário e recarregar a lista
      setName('');
      setDescription('');
      setCapacity(20);
      setDuration(60);
      fetchClasses();
      
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tipos de Aulas (WODs)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Esquerdo: Formulário de Cadastro */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Nova Aula</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Treino</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Crossfit WOD, LPO, Ginástica"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
              <textarea 
                rows="3"
                placeholder="Detalhes sobre o foco da aula..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Vagas</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Duração (min)</label>
                <input 
                  type="number" 
                  min="10"
                  step="5"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Salvar Aula
            </button>
          </form>
        </div>

        {/* Lado Direito: Lista de Aulas Cadastradas */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-gray-500">Carregando aulas...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : classes.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
              <p className="text-gray-500">Nenhuma aula cadastrada ainda.</p>
              <p className="text-sm text-gray-400 mt-1">Use o formulário ao lado para criar o seu primeiro template de treino.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md">
                      {cls.duration_minutes} min
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cls.description || 'Sem descrição.'}</p>
                  <div className="flex items-center text-sm font-medium text-gray-600">
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Até {cls.capacity} alunos por turma
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
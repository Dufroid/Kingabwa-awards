import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, FolderTree } from 'lucide-react';
import { Category, AwardEdition } from '../../types/index.js';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editions, setEditions] = useState<AwardEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    editionId: '',
    name: '',
    description: '',
    votingEnabled: true,
  });

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const [catRes, edRes] = await Promise.all([
        api.get('/categories'),
        api.get('/admin/editions'),
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (edRes.data.success) {
        setEditions(edRes.data.data);
        if (edRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, editionId: edRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/categories', formData);
      if (res.data.success) {
        showToast('Catégorie créée avec succès !', 'success');
        setShowModal(false);
        setFormData({ editionId: editions[0]?._id || '', name: '', description: '', votingEnabled: true });
        fetchCategories();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        showToast('Catégorie supprimée.', 'success');
        fetchCategories();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur de suppression', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Gestion des Catégories</h1>
          <p className="text-xs text-slate-400">Ajoutez, modifiez ou activez les catégories d'awards.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-gold px-4 py-2 text-xs font-bold uppercase flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900 text-gold-400 font-serif uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Nom de la catégorie</th>
              <th className="p-4">Description</th>
              <th className="p-4">Nominés</th>
              <th className="p-4">Statut Vote</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white">{cat.name}</td>
                <td className="p-4 max-w-xs truncate">{cat.description}</td>
                <td className="p-4 font-semibold text-gold-400">{cat.nomineeCount ?? 0}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    cat.votingEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {cat.votingEnabled ? 'Activé' : 'Désactivé'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-slate-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal create */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 border border-gold-400/30 space-y-4 my-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-gold-gradient">Créer une Catégorie</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs text-slate-400">
                  Annuler
                </button>
                <button type="submit" className="flex-1 btn-gold py-2 text-xs uppercase font-bold">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

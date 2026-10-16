import React, { useEffect, useState } from 'react';
import { Plus, Trash2, PencilLine, HeartHandshake } from 'lucide-react';
import api from '../../services/api.js';
import { Partner } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

const emptyForm = {
  name: '',
  logo: '',
  description: '',
  website: '',
  level: 'GOLD' as 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE',
  order: 0,
  active: true,
};

export const AdminPartners: React.FC = () => {
  const { showToast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchPartners = async () => {
    try {
      const res = await api.get('/partners?all=true');
      if (res.data.success) setPartners(res.data.data);
    } catch (err) {
      console.error('Failed to load partners admin data', err);
      showToast('Impossible de charger les partenaires.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (partner: Partner) => {
    setEditingId(partner._id);
    setFormData({
      name: partner.name,
      logo: partner.logo,
      description: partner.description || '',
      website: partner.website || '',
      level: partner.level,
      order: partner.order,
      active: partner.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        website: formData.website || '#',
        order: Number(formData.order) || 0,
      };

      if (editingId) {
        const res = await api.patch(`/partners/${editingId}`, payload);
        if (res.data.success) {
          showToast('Partenaire modifié avec succès.', 'success');
          setShowModal(false);
          resetForm();
          fetchPartners();
        }
        return;
      }

      const res = await api.post('/partners', payload);
      if (res.data.success) {
        showToast('Partenaire ajouté avec succès.', 'success');
        setShowModal(false);
        resetForm();
        fetchPartners();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de l’enregistrement.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer ce partenaire ?')) return;
    try {
      const res = await api.delete(`/partners/${id}`);
      if (res.data.success) {
        showToast('Partenaire supprimé.', 'success');
        fetchPartners();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Chargement des partenaires...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Gestion des Partenaires</h1>
          <p className="text-xs text-slate-400">Ajoutez, modifiez ou supprimez les partenaires affichés sur le site public.</p>
        </div>
        <button onClick={openCreateModal} className="btn-gold px-4 py-2 text-xs font-bold uppercase flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Partenaire</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900 text-gold-400 font-serif uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Nom</th>
              <th className="p-4">Niveau</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Ordre</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {partners.map((partner) => (
              <tr key={partner._id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white">{partner.name}</td>
                <td className="p-4">{partner.level}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${partner.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                    {partner.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="p-4">{partner.order}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEditModal(partner)} className="text-slate-400 hover:text-gold-400">Modifier</button>
                  <button onClick={() => handleDelete(partner._id)} className="text-slate-400 hover:text-red-400">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-xl w-full rounded-2xl p-6 border border-gold-400/30 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold-gradient">{editingId ? 'Modifier le partenaire' : 'Ajouter un partenaire'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom *</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Niveau</label>
                  <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as any })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="PLATINUM">PLATINUM</option>
                    <option value="GOLD">GOLD</option>
                    <option value="SILVER">SILVER</option>
                    <option value="BRONZE">BRONZE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Logo *</label>
                <input value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} required placeholder="https://..." className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Site web</label>
                  <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="https://example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ordre d'affichage</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-dark-900 px-3 py-2">
                <label className="text-xs font-semibold text-slate-300">Visible sur le site public</label>
                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="h-4 w-4 accent-gold-400" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-2 text-xs text-slate-400">Annuler</button>
                <button type="submit" className="flex-1 btn-gold py-2 text-xs uppercase font-bold flex items-center justify-center gap-2">
                  <HeartHandshake className="w-4 h-4" />
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

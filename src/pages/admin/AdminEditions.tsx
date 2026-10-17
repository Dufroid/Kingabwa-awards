import React, { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Plus, Save, PencilLine } from 'lucide-react';
import api from '../../services/api.js';
import { AwardEdition } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

const emptyForm = {
  name: '',
  year: new Date().getFullYear(),
  description: '',
  location: '',
  image: '',
  startDate: '',
  ceremonyDate: '',
  votingStartDate: '',
  votingEndDate: '',
  status: 'OPEN' as AwardEdition['status'],
};

const formatDateForInput = (value?: string | Date) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

export const AdminEditions: React.FC = () => {
  const { showToast } = useToast();
  const [editions, setEditions] = useState<AwardEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState(emptyForm);

  const fetchEditions = async () => {
    try {
      const res = await api.get('/admin/editions');
      if (res.data.success) {
        setEditions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load editions', err);
      showToast('Impossible de charger les éditions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setUploadingImage(false);
    setImagePreview('');
    setFormData({ ...emptyForm, year: new Date().getFullYear() });
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (edition: AwardEdition) => {
    setEditingId(edition._id);
    setSelectedFile(null);
    setFormData({
      name: edition.name,
      year: edition.year,
      description: edition.description,
      location: edition.location || '',
      image: edition.image || '',
      startDate: formatDateForInput(edition.startDate),
      ceremonyDate: formatDateForInput(edition.ceremonyDate),
      votingStartDate: formatDateForInput(edition.votingStartDate),
      votingEndDate: formatDateForInput(edition.votingEndDate),
      status: edition.status,
    });
    setImagePreview(edition.image || '');
    setShowModal(true);
  };

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (formData.image) {
      setImagePreview(formData.image);
      return;
    }

    setImagePreview('');
  }, [selectedFile, formData.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = formData.image?.trim() || '';

      if (selectedFile) {
        setUploadingImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);

        const uploadRes = await api.post('/admin/editions/upload-image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedImageUrl = uploadRes.data?.data?.url || uploadRes.data?.url || uploadedImageUrl;
        setFormData((prev) => ({ ...prev, image: uploadedImageUrl }));
        setUploadingImage(false);
      }

      const payload = {
        ...formData,
        image: uploadedImageUrl,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        ceremonyDate: formData.ceremonyDate ? new Date(formData.ceremonyDate).toISOString() : null,
        votingStartDate: formData.votingStartDate ? new Date(formData.votingStartDate).toISOString() : null,
        votingEndDate: formData.votingEndDate ? new Date(formData.votingEndDate).toISOString() : null,
      };

      if (editingId) {
        const res = await api.patch(`/admin/editions/${editingId}`, payload);
        if (res.data.success) {
          showToast('Édition mise à jour avec succès.', 'success');
          setShowModal(false);
          resetForm();
          fetchEditions();
        }
        return;
      }

      const res = await api.post('/admin/editions', payload);
      if (res.data.success) {
        showToast('Nouvelle édition créée avec succès.', 'success');
        setShowModal(false);
        resetForm();
        fetchEditions();
      }
    } catch (err: any) {
      setUploadingImage(false);
      showToast(err.response?.data?.message || 'Erreur lors de l’enregistrement.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Chargement des éditions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Gestion des Éditions</h1>
          <p className="text-xs text-slate-400">Mettez à jour les informations de l’édition, la date et le lieu du gala.</p>
        </div>
        <button onClick={openCreateModal} className="btn-gold px-4 py-2 text-xs font-bold uppercase flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Édition</span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {editions.map((edition) => (
          <div key={edition._id} className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            {edition.image ? (
              <img src={edition.image} alt={edition.name} className="h-40 w-full object-cover border-b border-slate-800" />
            ) : (
              <div className="h-40 w-full bg-gradient-to-br from-gold-400/20 via-dark-900 to-dark-950 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-gold-300">
                Image de l’édition
              </div>
            )}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold-300">{edition.year}</p>
                  <h2 className="font-serif text-xl font-bold text-white">{edition.name}</h2>
                </div>
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
                  {edition.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gold-400" />
                  <span>Gala : {new Date(edition.ceremonyDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span>{edition.location || 'Lieu à définir'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3">{edition.description}</p>

              <button onClick={() => openEditModal(edition)} className="w-full border border-gold-400/30 bg-gold-400/10 text-gold-200 py-2 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2">
                <PencilLine className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-card w-full max-w-2xl rounded-2xl p-6 border border-gold-400/30 space-y-4 my-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-gold-gradient">{editingId ? 'Modifier l’édition' : 'Créer une édition'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nom de l’édition *</label>
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Année *</label>
                  <input type="number" required value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea rows={3} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lieu du gala</label>
                <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="Ex. Palais des Arts, Kinshasa" />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image de l’édition</label>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-400 file:text-dark-950"
                  />
                </div>

                <input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="https://.../edition.jpg"
                />

                {imagePreview && (
                  <div className="rounded-xl border border-slate-800 bg-dark-900 p-2">
                    <img src={imagePreview} alt="Preview edition" className="h-32 w-full object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Début du vote</label>
                  <input type="datetime-local" value={formData.votingStartDate} onChange={(e) => setFormData({ ...formData, votingStartDate: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fin du vote</label>
                  <input type="datetime-local" value={formData.votingEndDate} onChange={(e) => setFormData({ ...formData, votingEndDate: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date de début</label>
                  <input type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date du gala</label>
                  <input type="datetime-local" value={formData.ceremonyDate} onChange={(e) => setFormData({ ...formData, ceremonyDate: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Statut</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as AwardEdition['status'] })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="RESULTS_PUBLISHED">RESULTS_PUBLISHED</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-2 text-xs text-slate-400">Annuler</button>
                <button type="submit" disabled={uploadingImage} className="flex-1 btn-gold py-2 text-xs uppercase font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {uploadingImage ? 'Téléchargement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

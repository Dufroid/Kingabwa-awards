import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Award, Users } from 'lucide-react';
import { Nominee, Category, AwardEdition } from '../../types/index.js';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminNominees: React.FC = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editions, setEditions] = useState<AwardEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    editionId: '',
    categoryId: '',
    fullName: '',
    profileImage: '',
  });

  const { showToast } = useToast();

  const fetchNominees = async () => {
    try {
      const [nomRes, catRes, edRes] = await Promise.all([
        api.get('/nominees'),
        api.get('/categories'),
        api.get('/admin/editions'),
      ]);
      if (nomRes.data.success) setNominees(nomRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (edRes.data.success) {
        setEditions(edRes.data.data);
        if (edRes.data.data.length > 0 && catRes.data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            editionId: edRes.data.data[0]._id,
            categoryId: catRes.data.data[0]._id,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load nominees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNominees();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (formData.profileImage) {
      setImagePreview(formData.profileImage);
      return;
    }

    setImagePreview('');
  }, [selectedFile, formData.profileImage]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = formData.profileImage;

      if (selectedFile) {
        setUploadingImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);

        const uploadRes = await api.post('/nominees/upload-image', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImageUrl = uploadRes.data?.data?.url || uploadRes.data?.url || uploadedImageUrl;
        setFormData((prev) => ({ ...prev, profileImage: uploadedImageUrl }));
        setUploadingImage(false);
      }

      const payload = {
        ...formData,
        profileImage: uploadedImageUrl,
      };

      const res = await api.post('/nominees', payload);
      if (res.data.success) {
        showToast('Candidat ajouté avec succès !', 'success');
        setShowModal(false);
        setSelectedFile(null);
        setUploadingImage(false);
        setImagePreview('');
        setFormData({
          editionId: formData.editionId,
          categoryId: formData.categoryId,
          fullName: '',
          profileImage: '',
        });
        fetchNominees();
      }
    } catch (err: any) {
      setUploadingImage(false);
      showToast(err.response?.data?.message || 'Erreur lors de la création', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer ce nominé ?')) return;
    try {
      const res = await api.delete(`/nominees/${id}`);
      if (res.data.success) {
        showToast('Nominé supprimé.', 'success');
        fetchNominees();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur de suppression', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Gestion des Nominés</h1>
          <p className="text-xs text-slate-400">Gérez les profils et suivez les votes cumulés des candidats.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-gold px-4 py-2 text-xs font-bold uppercase flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Nominé</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900 text-gold-400 font-serif uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Candidat</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Votes Cumulés</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {nominees.map((nom) => (
              <tr key={nom._id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <img src={nom.profileImage} alt={nom.fullName} className="w-10 h-10 rounded-full object-cover border border-gold-400" />
                  <span>{nom.fullName}</span>
                </td>
                <td className="p-4 font-medium text-gold-300">
                  {typeof nom.categoryId === 'object' ? nom.categoryId.name : '-'}
                </td>
                <td className="p-4 font-serif font-extrabold text-gold-gradient text-sm">{nom.voteCount || 0}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(nom._id)} className="p-1.5 text-slate-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full rounded-2xl p-6 border border-gold-400/30 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gold-gradient">Ajouter un Nominé</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Photo de profil *</label>

                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gold-500 px-4 py-2 text-[10px] font-bold uppercase text-dark-950 shadow-gold-glow transition hover:opacity-90">
                    <span>Choisir image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedFile(file);
                        if (!file) return;
                        if (!formData.profileImage) {
                          setFormData((prev) => ({ ...prev, profileImage: '' }));
                        }
                      }}
                    />
                  </label>

                  {selectedFile && (
                    <span className="text-[10px] text-slate-300">{selectedFile.name}</span>
                  )}
                </div>

                {imagePreview && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-dark-900 p-2">
                    <img
                      src={imagePreview}
                      alt="Aperçu du nominé"
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  </div>
                )}

                <p className="mt-3 text-[10px] text-slate-400">Ou colle directement une URL publique :</p>
                <input
                  type="text"
                  value={formData.profileImage}
                  onChange={(e) => {
                    setFormData({ ...formData, profileImage: e.target.value });
                    if (!e.target.value) {
                      setSelectedFile(null);
                    }
                  }}
                  placeholder="https://..."
                  className="mt-2 w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-xs text-slate-400">
                  Annuler
                </button>
                <button type="submit" disabled={uploadingImage} className="flex-1 btn-gold py-2 text-xs uppercase font-bold disabled:opacity-60">
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

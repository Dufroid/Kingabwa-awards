import React, { useEffect, useState } from 'react';
import { PencilLine, Plus, Trash2, Newspaper, CheckCircle2 } from 'lucide-react';
import api from '../../services/api.js';
import { BlogPost } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  mediaType: 'IMAGE' as 'IMAGE' | 'VIDEO' | 'PDF',
  categoryId: '',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
};

export const AdminBlog: React.FC = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        api.get('/blog/posts?all=true'),
        api.get('/blog/categories'),
      ]);

      if (postsRes.data.success) setPosts(postsRes.data.data);
      if (catsRes.data.success) setCategories(catsRes.data.data);
    } catch (err) {
      console.error('Failed to load blog admin data', err);
      showToast('Impossible de charger les articles.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ ...emptyForm, categoryId: categories[0]?._id || '' });
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploadingMedia(true);
      const res = await api.post('/blog/upload-media', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const uploadedMedia = res.data.data;
        setFormData((prev) => ({
          ...prev,
          featuredImage: uploadedMedia.url,
          mediaType: uploadedMedia.mediaType || prev.mediaType,
        }));
        showToast('Fichier uploadé vers Cloudinary avec succès.', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors du téléchargement du média.', 'error');
    } finally {
      setUploadingMedia(false);
      event.target.value = '';
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingId(post._id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      mediaType: post.mediaType || 'IMAGE',
      categoryId:
        typeof post.categoryId === 'object' && post.categoryId !== null
          ? post.categoryId._id
          : typeof post.categoryId === 'string'
            ? post.categoryId
            : '',
      tags: (post.tags || []).join(', '),
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      status: post.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        mediaType: formData.mediaType,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingId) {
        const res = await api.patch(`/blog/posts/${editingId}`, payload);
        if (res.data.success) {
          showToast('Article mis à jour avec succès.', 'success');
          setShowModal(false);
          resetForm();
          fetchData();
        }
        return;
      }

      const res = await api.post('/blog/posts', payload);
      if (res.data.success) {
        showToast('Article publié avec succès.', 'success');
        setShowModal(false);
        resetForm();
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de l’enregistrement.', 'error');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Le nom de la catégorie est requis.', 'error');
      return;
    }

    try {
      const res = await api.post('/blog/categories', { name: newCategoryName.trim() });
      if (res.data.success) {
        showToast('Catégorie ajoutée.', 'success');
        setNewCategoryName('');
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de l’ajout de la catégorie.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer cet article ?')) return;
    try {
      const res = await api.delete(`/blog/posts/${id}`);
      if (res.data.success) {
        showToast('Article supprimé.', 'success');
        fetchData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Chargement des articles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Gestion du Blog</h1>
          <p className="text-xs text-slate-400">Publiez, modifiez et supprimez les articles qui apparaissent sur le site public.</p>
        </div>
        <button onClick={openCreateModal} className="btn-gold px-4 py-2 text-xs font-bold uppercase flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Nouvel Article</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl p-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400">Types de blog</p>
            <h2 className="font-serif text-lg font-bold text-white">Catégories du blog</h2>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nouvelle catégorie"
              className="w-full sm:w-64 bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button type="button" onClick={handleCreateCategory} className="btn-gold px-4 py-2 text-[10px] font-bold uppercase">Ajouter</button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-dark-900 text-gold-400 font-serif uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Titre</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white">{post.title}</td>
                <td className="p-4">{typeof post.categoryId === 'object' && post.categoryId !== null ? post.categoryId.name : '-'}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    post.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' :
                    post.status === 'ARCHIVED' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-4">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fr-FR') : '-'}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEditModal(post)} className="text-slate-400 hover:text-gold-400">Modifier</button>
                  <button onClick={() => handleDelete(post._id)} className="text-slate-400 hover:text-red-400">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-card w-full max-w-3xl rounded-2xl p-6 border border-gold-400/30 space-y-4 my-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-gold-gradient">{editingId ? 'Modifier l’article' : 'Ajouter un article'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Titre *</label>
                  <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie *</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="">Sélectionner</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Extrait *</label>
                <textarea rows={3} required value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type de média *</label>
                  <select value={formData.mediaType} onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as 'IMAGE' | 'VIDEO' | 'PDF' })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Vidéo</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Liaison Cloudinary</label>
                  <input value={formData.featuredImage} onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })} placeholder="https://..." className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Téléverser un fichier Cloudinary</label>
                <input type="file" accept="image/*,video/*,.pdf" onChange={handleMediaUpload} className="block w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold-400 file:text-dark-950" />
                {uploadingMedia && <p className="mt-2 text-[10px] text-amber-300">Téléchargement du média en cours...</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contenu *</label>
                <textarea rows={8} required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tags</label>
                  <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" placeholder="kingabwa, gala, prestige" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Statut</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title</label>
                  <input value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                  <input value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 py-2 text-xs text-slate-400">Annuler</button>
                <button type="submit" className="flex-1 btn-gold py-2 text-xs uppercase font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
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

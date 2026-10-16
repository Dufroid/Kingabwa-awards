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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-3xl w-full rounded-2xl p-6 border border-gold-400/30 space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image à la une *</label>
                <input value={formData.featuredImage} onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })} required placeholder="https://..." className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
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

import React, { useState, useEffect } from 'react';
import { Award, Search } from 'lucide-react';
import { CategoryCard } from '../components/common/CategoryCard.js';
import { Category } from '../types/index.js';
import api from '../services/api.js';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Award className="w-4 h-4" />
          <span>Édition 2026</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Catégories des <span className="text-gold-gradient">Kingabwa Awards</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Découvrez l'ensemble des catégories d'awards et les personnalités d'exception nominées dans chaque domaine.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une catégorie..."
            className="w-full bg-dark-900 border border-gold-400/30 rounded-full px-5 py-3.5 pl-12 text-sm text-white focus:outline-none focus:border-gold-400 shadow-gold-glow"
          />
          <Search className="w-5 h-5 text-gold-400 absolute left-4 top-7" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chargement des catégories...</div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">Aucune catégorie trouvée correspondant à votre recherche.</div>
      )}

    </div>
  );
};

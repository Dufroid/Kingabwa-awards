import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Search, Clock, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost, Category } from '../types/index.js';
import api from '../services/api.js';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog/posts');
        if (res.data.success) {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load blog posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Newspaper className="w-4 h-4" />
          <span>Actualités & Médias</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Blog & Communiqués <span className="text-gold-gradient">Officiels</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Suivez toutes les actualités, coulisses et portraits exclusifs des Kingabwa Awards.
        </p>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto pt-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full bg-dark-900 border border-gold-400/30 rounded-full px-5 py-3.5 pl-12 text-sm text-white focus:outline-none focus:border-gold-400 shadow-gold-glow"
          />
          <Search className="w-5 h-5 text-gold-400 absolute left-4 top-7" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chargement des articles...</div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post._id}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-56 overflow-hidden bg-dark-900">
                {post.mediaType === 'PDF' ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-500/20 to-slate-900 text-center text-gold-300">
                    <div>
                      <div className="text-3xl font-black">PDF</div>
                      <div className="mt-2 text-[10px] uppercase tracking-[0.2em]">Document</div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-gold-300 border border-gold-400/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                  {typeof post.categoryId === 'object' && post.categoryId ? post.categoryId.name : 'Événement'}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {post.readTimeMinutes} min de lecture
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-extrabold text-white group-hover:text-gold-300 transition-colors line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 group-hover:text-gold-300 pt-4 border-t border-slate-800"
                >
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">Aucun article trouvé.</div>
      )}

    </div>
  );
};

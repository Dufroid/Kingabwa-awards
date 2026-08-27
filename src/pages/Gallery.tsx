import React, { useState, useEffect } from 'react';
import { Camera, Play, Image as ImageIcon } from 'lucide-react';
import { GalleryMedia } from '../types/index.js';
import api from '../services/api.js';

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryMedia[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load gallery items', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const categories = [
    { key: 'ALL', label: 'Tous les médias' },
    { key: 'CEREMONY', label: 'Grande Cérémonie' },
    { key: 'RED_CARPET', label: 'Tapis Rouge' },
    { key: 'BEHIND_SCENES', label: 'Coulisses' },
    { key: 'WINNERS', label: 'Remise des Trophées' },
  ];

  const filteredItems = items.filter(
    (item) => activeTab === 'ALL' || item.category === activeTab
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Camera className="w-4 h-4" />
          <span>Galerie Multimédia</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Photos & <span className="text-gold-gradient">Vidéos de la Cérémonie</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Revivez les temps forts, les sourires et les moments d'émotion des Kingabwa Awards.
        </p>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === cat.key ? 'btn-gold text-dark-950' : 'bg-dark-900 border border-slate-800 text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chargement des médias...</div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="glass-card glass-card-hover rounded-2xl overflow-hidden group border border-gold-400/20">
              <div className="relative h-64 bg-dark-900 overflow-hidden">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80" />

                <span className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-gold-300 border border-gold-400/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  {item.type === 'VIDEO' ? <Play className="w-3 h-3 text-gold-400" /> : <ImageIcon className="w-3 h-3 text-gold-400" />}
                  {item.category.replace('_', ' ')}
                </span>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="font-serif font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                  {item.description && <p className="text-[11px] text-slate-300 line-clamp-2">{item.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Aucun média disponible dans cette section pour le moment.</p>
        </div>
      )}

    </div>
  );
};

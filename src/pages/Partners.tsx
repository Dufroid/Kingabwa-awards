import React, { useState, useEffect } from 'react';
import { HeartHandshake, ExternalLink, ShieldCheck } from 'lucide-react';
import { Partner } from '../types/index.js';
import api from '../services/api.js';

export const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get('/partners');
        if (res.data.success) {
          setPartners(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load partners', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const getTierColor = (level: string) => {
    switch (level) {
      case 'PLATINUM': return 'border-slate-300 text-slate-100 bg-slate-300/10';
      case 'GOLD': return 'border-gold-400 text-gold-300 bg-gold-400/10';
      case 'SILVER': return 'border-slate-400 text-slate-300 bg-slate-400/10';
      default: return 'border-amber-700 text-amber-500 bg-amber-700/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <HeartHandshake className="w-4 h-4" />
          <span>Soutiens & Alliances</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Nos Partenaires & <span className="text-gold-gradient">Sponsors Officiels</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Nous remercions chaleureusement les institutions et entreprises qui soutiennent l'excellence et le développement socioculturel à Kingabwa.
        </p>
      </div>

      {/* Grid by Tiers */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chargement des partenaires...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="glass-card glass-card-hover rounded-3xl p-8 border border-gold-400/30 flex flex-col justify-between text-center space-y-6"
            >
              <div className="space-y-4">
                <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getTierColor(partner.level)}`}>
                  Niveau {partner.level}
                </span>

                <div className="h-24 flex items-center justify-center bg-dark-900/80 rounded-2xl border border-slate-800 p-4">
                  <span className="font-serif text-2xl font-black text-gold-gradient uppercase">
                    {partner.name}
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {partner.description || 'Partenaire engagé à nos côtés pour la promotion de l\'excellence.'}
                </p>
              </div>

              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 pt-4 border-t border-slate-800"
                >
                  <span>Visiter le site officiel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sponsor CTA */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-400/40 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="font-serif text-2xl font-bold text-white">Devenir Partenaire Officiel</h3>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Associez l'image de votre marque à un événement prestigieux qui touche des milliers de citoyens et décideurs à Kinshasa.
        </p>
        <a href="mailto:partenariats@kingabwa-awards.cd" className="btn-gold inline-block px-8 py-3 text-xs font-extrabold uppercase tracking-wider">
          Demander le Dossier de Sponsoring
        </a>
      </div>

    </div>
  );
};

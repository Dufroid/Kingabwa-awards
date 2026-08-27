import React, { useState, useEffect } from 'react';
import { Trophy, Award, Calendar, Search } from 'lucide-react';
import { Winner } from '../types/index.js';
import api from '../services/api.js';

export const HallOfFame: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await api.get('/hall-of-fame');
        if (res.data.success) {
          setWinners(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load winners', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const years = Array.from(new Set(winners.map((w) => w.editionYear))).sort((a, b) => b - a);

  const filteredWinners = winners.filter(
    (w) => !selectedYear || w.editionYear === parseInt(selectedYear, 10)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Trophy className="w-4 h-4" />
          <span>Panthéon des Lauréats</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          HALL OF <span className="text-gold-gradient">FAME</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Hommage perpétuel aux grandes personnalités et élites ayant marqué l'histoire des Kingabwa Awards.
        </p>

        {/* Year Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setSelectedYear('')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              !selectedYear ? 'btn-gold' : 'bg-dark-900 border border-slate-800 text-slate-300'
            }`}
          >
            Toutes les éditions
          </button>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(String(yr))}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedYear === String(yr) ? 'btn-gold' : 'bg-dark-900 border border-slate-800 text-slate-300'
              }`}
            >
              Édition {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Winners Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chargement du Hall of Fame...</div>
      ) : filteredWinners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredWinners.map((winner) => (
            <div
              key={winner._id}
              className="glass-card rounded-3xl p-8 border border-gold-400/30 flex flex-col sm:flex-row gap-6 items-center sm:items-start relative overflow-hidden shadow-2xl"
            >
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-gold-400 shrink-0 shadow-gold-glow">
                <img src={winner.winnerImage} alt={winner.winnerName} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-dark-950/90 text-gold-400 font-serif font-black text-xs px-2.5 py-0.5 rounded-md border border-gold-400/30">
                  {winner.editionYear}
                </span>
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                    {winner.categoryName}
                  </span>
                  <h3 className="font-serif text-2xl font-extrabold text-white">
                    {winner.winnerName}
                  </h3>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {winner.description}
                </p>

                {winner.achievements && (
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[11px] font-semibold text-gold-300">
                      🏆 Réalisation majeure : {winner.achievements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Aucun lauréat enregistré dans cette catégorie pour le moment.</p>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Vote as VoteIcon, CheckCircle2, Award, Calendar } from 'lucide-react';
import { Vote } from '../types/index.js';
import api from '../services/api.js';

export const MyVotes: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVotes = async () => {
      try {
        const res = await api.get('/votes/my-votes');
        if (res.data.success) {
          setVotes(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch user votes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVotes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <VoteIcon className="w-4 h-4" />
          <span>Espace Votant</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black uppercase text-white">
          Mon Historique de <span className="text-gold-gradient">Votes Enregistrés</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          Retrouvez la liste des catégories pour lesquelles vous avez valablement exprimé votre voix.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Chargement de vos votes...</div>
      ) : votes.length > 0 ? (
        <div className="space-y-4">
          {votes.map((vote) => (
            <div
              key={vote._id}
              className="glass-card rounded-2xl p-6 border border-gold-400/30 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={vote.nomineeId?.profileImage}
                  alt={vote.nomineeId?.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                    {vote.categoryId?.name}
                  </span>
                  <h3 className="font-bold text-white text-base">{vote.nomineeId?.fullName}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Voté le {new Date(vote.createdAt).toLocaleDateString('fr-FR')} à {new Date(vote.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vote Confirmé & Enregistré</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-800 space-y-4">
          <Award className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">Vous n'avez pas encore enregistré de vote pour cette édition.</p>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Vote, Trophy, Award, TrendingUp } from 'lucide-react';
import api from '../../services/api.js';

export const AdminVotes: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoteStats = async () => {
      try {
        const res = await api.get('/votes/statistics');
        if (res.data.success) {
          console.log(res.data)
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load vote statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoteStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-medium">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Statistiques Détaillées des Votes</h1>
        <p className="text-xs text-slate-400">Analyse du classement et des tendances de vote.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-gold-400/30 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Général des Votes</span>
          <p className="font-serif text-4xl font-black text-gold-gradient">{stats?.totalVotes || 0}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gold-gradient/20 border border-gold-400/30 flex items-center justify-center text-gold-400">
          <Vote className="w-6 h-6" />
        </div>
      </div>

      {/* Top 5 Nominees */}
      <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold-400" />
          Classement des 5 Candidats en Tête
        </h3>

        <div className="space-y-4">
          {stats?.topNominees?.map((nominee: any, idx: number) => (
            <div key={nominee._id} className="bg-dark-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-serif font-black text-gold-400 text-lg">#{idx + 1}</span>
                <img src={nominee.profileImage} alt={nominee.fullName} className="w-12 h-12 rounded-full object-cover border border-gold-400" />
                <div>
                  <h4 className="font-bold text-white text-sm">{nominee.fullName}</h4>
                  <p className="text-xs text-slate-400">{nominee.categoryId?.name}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif text-xl font-extrabold text-gold-gradient">{nominee.voteCount}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Votes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

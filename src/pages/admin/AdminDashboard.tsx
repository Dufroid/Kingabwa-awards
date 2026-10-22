import React, { useState, useEffect } from 'react';
import {
  Users, Vote, Award, Newspaper, Sparkles, FolderTree,
  TrendingUp, Wallet, Crown, BarChart3, Trophy, Star
} from 'lucide-react';
import api from '../../services/api.js';

interface TopVoter {
  _id: string;
  fullName: string;
  phone: string;
  totalVoix: number;
  nbVotes: number;
}

interface NomineeVote {
  _id: string;
  nomineeName: string;
  categoryName: string;
  totalVoix: number;
}

interface GeneralStats {
  totalFreeVotes: number;
  totalPaidVoix: number;
  totalPaidTransactions: number;
  totalRevenueCdf: number;
  uniqueVoters: number;
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [votesByCategory, setVotesByCategory] = useState<any[]>([]);
  const [votesByNominee, setVotesByNominee] = useState<NomineeVote[]>([]);
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [topVoters, setTopVoters] = useState<TopVoter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setMetrics(res.data.metrics);
          const cd = res.data.chartData || {};
          setVotesByCategory(cd.votesByCategory || []);
          setVotesByNominee(cd.votesByNominee || []);
          setGeneralStats(cd.generalStats || null);
          setTopVoters(cd.topVoters || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Utilisateurs Inscrits',     value: metrics?.totalUsers || 0,      icon: Users,     color: 'text-blue-400',    bg: 'bg-blue-400/10'    },
    { label: 'Votants Authentifiés',      value: metrics?.totalVoters || 0,     icon: Users,     color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Total Votes Enregistrés',   value: metrics?.totalVotes || 0,      icon: Vote,      color: 'text-gold-400',    bg: 'bg-gold-400/10'    },
    { label: 'Nominés Actifs',            value: metrics?.totalNominees || 0,   icon: Award,     color: 'text-purple-400',  bg: 'bg-purple-400/10'  },
    { label: 'Catégories d\'Awards',      value: metrics?.totalCategories || 0, icon: FolderTree, color: 'text-indigo-400', bg: 'bg-indigo-400/10'  },
    { label: 'Propositions Reçues',       value: metrics?.totalProposals || 0,  icon: Sparkles,  color: 'text-amber-400',   bg: 'bg-amber-400/10'   },
  ];

  const rankMedals = ['🥇', '🥈', '🥉', '4.', '5.'];

  return (
    <div className="space-y-10">

      {/* ── Titre ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Vue d'Ensemble &amp; Métriques</h1>
        <p className="text-xs text-slate-400 mt-1">Supervision en temps réel de la plateforme Kingabwa Awards 2026.</p>
      </div>

      {/* ── Cartes de métriques ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between hover:border-gold-400/30 transition-colors">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-1">{card.label}</span>
                <span className="font-serif text-3xl font-extrabold text-white">{card.value.toLocaleString()}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bg} border border-slate-800 flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Statistiques Générales de Vote ────────────────────────────────── */}
      {generalStats && (
        <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            Statistiques Générales de Vote
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Votes Gratuits Confirmés', value: generalStats.totalFreeVotes.toLocaleString(), icon: Vote, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { label: 'Voix Payantes Validées', value: generalStats.totalPaidVoix.toLocaleString(), icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-400/10' },
              { label: 'Transactions Validées', value: generalStats.totalPaidTransactions.toLocaleString(), icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'Revenus Totaux (FC)', value: generalStats.totalRevenueCdf.toLocaleString(), icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-400/10' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`${s.bg} rounded-2xl p-5 border border-slate-800/60 space-y-3`}>
                  <div className={`w-9 h-9 rounded-xl bg-dark-900/60 flex items-center justify-center ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 tracking-wider">{s.label}</p>
                    <p className="font-serif text-2xl font-bold text-white mt-1">{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Votants uniques ayant participé :{' '}
              <span className="text-gold-400 font-bold text-sm">{generalStats.uniqueVoters}</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Répartition Votes par Catégorie ──────────────────────────────── */}
      <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Vote className="w-5 h-5 text-gold-400" />
          Répartition des Votes par Catégorie
        </h3>
        {votesByCategory.length > 0 ? (
          <div className="space-y-4">
            {votesByCategory.map((item, idx) => {
              const maxVotes = Math.max(...votesByCategory.map((c) => c.votes), 1);
              const percentage = Math.round((item.votes / maxVotes) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-gold-400 font-bold">{item.votes} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gold-gradient rounded-full transition-all duration-700 shadow-gold-glow"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">Aucune donnée de vote disponible.</p>
        )}
      </div>

      {/* ── Classement Nominés par Voix (Top 15) ─────────────────────────── */}
      {votesByNominee.length > 0 && (
        <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-400" />
            Classement des Nominés par Voix (Top {Math.min(votesByNominee.length, 15)})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 pr-3 w-10">#</th>
                  <th className="py-3 pr-4">Nominé</th>
                  <th className="py-3 pr-4">Catégorie</th>
                  <th className="py-3 pr-4">Voix</th>
                  <th className="py-3 pr-4">Barre</th>
                </tr>
              </thead>
              <tbody>
                {votesByNominee.slice(0, 15).map((item, idx) => {
                  const maxV = votesByNominee[0]?.totalVoix || 1;
                  const pct  = Math.round((item.totalVoix / maxV) * 100);
                  return (
                    <tr key={idx} className="border-b border-slate-800/60 text-slate-200 hover:bg-gold-400/5 transition-colors">
                      <td className="py-3 pr-3 font-bold text-gold-400 text-sm">{rankMedals[idx] ?? `${idx + 1}.`}</td>
                      <td className="py-3 pr-4 font-semibold text-white">{item.nomineeName}</td>
                      <td className="py-3 pr-4 text-slate-400">{item.categoryName}</td>
                      <td className="py-3 pr-4 font-bold text-gold-400 tabular-nums">{item.totalVoix.toLocaleString()}</td>
                      <td className="py-3 pr-4 min-w-[120px]">
                        <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gold-gradient rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Top 5 Votants ─────────────────────────────────────────────────── */}
      {topVoters.length > 0 && (
        <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold-400" />
            Top 5 Votants les Plus Actifs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topVoters.map((voter, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 border flex flex-col items-center text-center gap-3 transition-all
                  ${idx === 0
                    ? 'border-gold-400/50 bg-gold-400/10 shadow-gold-glow'
                    : idx === 1
                    ? 'border-slate-400/40 bg-slate-400/10'
                    : idx === 2
                    ? 'border-amber-700/40 bg-amber-700/10'
                    : 'border-slate-800 bg-dark-900/40'}`}
              >
                <div className="text-3xl">{rankMedals[idx]}</div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className={`w-3 h-3 ${idx === 0 ? 'text-gold-400' : 'text-slate-400'}`} />
                  </div>
                  <p className="font-bold text-white text-sm leading-tight">{voter.fullName}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{voter.phone}</p>
                </div>
                <div className="mt-auto">
                  <p className={`font-serif text-2xl font-extrabold ${idx === 0 ? 'text-gold-400' : 'text-white'}`}>
                    {voter.totalVoix.toLocaleString()}
                  </p>
                  <p className="text-[10px] uppercase text-slate-400 tracking-wider">voix accordées</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

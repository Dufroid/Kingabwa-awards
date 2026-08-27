import React, { useState, useEffect } from 'react';
import { Users, Vote, Award, Newspaper, Sparkles, FolderTree, ArrowUpRight } from 'lucide-react';
import api from '../../services/api.js';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setMetrics(res.data.metrics);
          setChartData(res.data.chartData.votesByCategory || []);
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
    return <div className="text-center py-20 text-slate-400 font-medium">Chargement du tableau de bord...</div>;
  }

  const statCards = [
    { label: 'Utilisateurs Inscrits', value: metrics?.totalUsers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Votants Authentifiés', value: metrics?.totalVoters || 0, icon: Users, color: 'text-emerald-400' },
    { label: 'Total Votes Enregistrés', value: metrics?.totalVotes || 0, icon: Vote, color: 'text-gold-400' },
    { label: 'Nominés Actifs', value: metrics?.totalNominees || 0, icon: Award, color: 'text-purple-400' },
    { label: 'Catégories d\'Awards', value: metrics?.totalCategories || 0, icon: FolderTree, color: 'text-indigo-400' },
    { label: 'Propositions Reçues', value: metrics?.totalProposals || 0, icon: Sparkles, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Vue d'Ensemble & Métriques</h1>
        <p className="text-xs text-slate-400 mt-1">Supervision en temps réel de la plateforme Kingabwa Awards 2026.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                  {card.label}
                </span>
                <span className="font-serif text-3xl font-extrabold text-white">{card.value}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-dark-900 border border-slate-800 flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Votes Distribution by Category Chart representation */}
      <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
          <Vote className="w-5 h-5 text-gold-400" />
          Répartition des Votes par Catégorie
        </h3>

        {chartData.length > 0 ? (
          <div className="space-y-4">
            {chartData.map((item, idx) => {
              const maxVotes = Math.max(...chartData.map((c) => c.votes), 1);
              const percentage = Math.round((item.votes / maxVotes) * 100);

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-gold-400 font-bold">{item.votes} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-dark-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gold-gradient rounded-full transition-all duration-500 shadow-gold-glow"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">Aucune donnée de vote disponible pour le moment.</p>
        )}
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Clock } from 'lucide-react';
import { NominationProposal } from '../../types/index.js';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminProposals: React.FC = () => {
  const [proposals, setProposals] = useState<NominationProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchProposals = async () => {
    try {
      const res = await api.get('/proposals');
      if (res.data.success) {
        setProposals(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load proposals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleStatusChange = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await api.patch(`/proposals/${id}`, { status });
      if (res.data.success) {
        showToast(`Statut mis à jour : ${status}`, 'success');
        fetchProposals();
      }
    } catch (err: any) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Propositions de Candidatures Reçues</h1>
        <p className="text-xs text-slate-400">Examinez les propositions soumises par le grand public.</p>
      </div>

      <div className="space-y-4">
        {proposals.map((prop) => (
          <div key={prop._id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                  Catégorie suggérée : {prop.proposedCategory}
                </span>
                <h3 className="font-bold text-white text-lg">{prop.nomineeName}</h3>
                <p className="text-xs text-slate-400">Profession : {prop.profession}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase self-start sm:self-center ${
                prop.status === 'ACCEPTED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : prop.status === 'REJECTED'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {prop.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <strong className="text-slate-200 block mb-1">Biographie :</strong>
                <p className="bg-dark-900/80 p-3 rounded-xl border border-slate-850">{prop.biography}</p>
              </div>
              <div>
                <strong className="text-slate-200 block mb-1">Réalisations & Raison :</strong>
                <p className="bg-dark-900/80 p-3 rounded-xl border border-slate-850">{prop.achievements}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-400 border-t border-slate-850">
              <div>
                <span>Proposé par : <strong>{prop.proposerInformation?.fullName}</strong> ({prop.proposerInformation?.email})</span>
              </div>

              {prop.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(prop._id, 'ACCEPTED')}
                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold hover:bg-emerald-500/30 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Accepter
                  </button>
                  <button
                    onClick={() => handleStatusChange(prop._id, 'REJECTED')}
                    className="px-3 py-1.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded-lg font-bold hover:bg-red-500/30 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

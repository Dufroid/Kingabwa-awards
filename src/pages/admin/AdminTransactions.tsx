import React, { useEffect, useMemo, useState } from 'react';
import { Wallet, CheckCircle2, Clock3, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface TransactionItem {
  _id: string;
  reference: string;
  provider: string;
  amount: number;
  currency: string;
  phone: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  externalTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    fullName: string;
    phone?: string;
    role?: string;
  } | null;
  vote?: {
    _id: string;
    voteType?: string;
    points?: number;
    status?: string;
    nomineeId?: string;
    nomineeName?: string | null;
    categoryName?: string | null;
    editionName?: string | null;
    paymentReference?: string;
  } | null;
  metadata?: Record<string, any>;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'En attente',
    className: 'bg-amber-500/10 text-amber-200 border border-amber-500/30',
    icon: <Clock3 className="w-3.5 h-3.5" />,
  },
  PAID: {
    label: 'Confirmé',
    className: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  FAILED: {
    label: 'Rejeté',
    className: 'bg-red-500/10 text-red-200 border border-red-500/30',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: 'Annulé',
    className: 'bg-slate-500/10 text-slate-200 border border-slate-500/30',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

export const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'>('ALL');
  const { showToast } = useToast();

  const fetchTransactions = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await api.get('/admin/transactions');
      if (res.data.success) {
        setTransactions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load transactions', err);
      showToast('Impossible de charger les transactions.', 'error');
    } finally {
      setLoading(false);
      if (showSpinner) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleValidate = async (transaction: TransactionItem) => {
    setActionId(transaction._id);
    try {
      const res = await api.post(`/admin/transactions/${transaction._id}/validate`);
      if (res.data.success) {
        showToast(res.data.message || 'Paiement validé.', 'success');
        await fetchTransactions();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors de la validation.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (transaction: TransactionItem) => {
    const reason = window.prompt('Motif du rejet (optionnel) :', '');
    if (reason === null) return;

    setActionId(transaction._id);
    try {
      const res = await api.post(`/admin/transactions/${transaction._id}/reject`, { reason });
      if (res.data.success) {
        showToast(res.data.message || 'Paiement rejeté.', 'success');
        await fetchTransactions();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Erreur lors du rejet.', 'error');
    } finally {
      setActionId(null);
    }
  };

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    if (statusFilter === 'ALL') return sorted;
    return sorted.filter((tx) => tx.status === statusFilter);
  }, [transactions, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: transactions.length,
      paid: transactions.filter((tx) => tx.status === 'PAID').length,
      pending: transactions.filter((tx) => tx.status === 'PENDING').length,
      failed: transactions.filter((tx) => tx.status === 'FAILED').length,
    };
  }, [transactions]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-medium">Chargement des transactions...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-white">Transactions Mobile Money</h1>
          <p className="text-xs text-slate-400 mt-1">Vérifiez les paiements reçus puis validez ou rejetez les votes.</p>
        </div>
        <button
          type="button"
          onClick={() => fetchTransactions(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-gold-400 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-[10px] uppercase text-slate-400 tracking-wider">Total</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-serif text-3xl font-bold text-white">{summary.total}</span>
            <Wallet className="w-6 h-6 text-gold-400" />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-[10px] uppercase text-slate-400 tracking-wider">Confirmées</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-serif text-3xl font-bold text-white">{summary.paid}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-[10px] uppercase text-slate-400 tracking-wider">En attente</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-serif text-3xl font-bold text-white">{summary.pending}</span>
            <Clock3 className="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <p className="text-[10px] uppercase text-slate-400 tracking-wider">Rejetées</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-serif text-3xl font-bold text-white">{summary.failed}</span>
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="font-serif text-xl font-bold text-white">Historique de paiements</h3>
          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase text-slate-400 tracking-wider">Filtre</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            >
              <option value="ALL">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="PAID">Confirmés</option>
              <option value="FAILED">Rejetés</option>
              <option value="CANCELLED">Annulés</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 pr-4">Référence</th>
                <th className="py-3 pr-4">Utilisateur</th>
                <th className="py-3 pr-4">Paiement</th>
                <th className="py-3 pr-4">Vote</th>
                <th className="py-3 pr-4">Statut</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const status = statusConfig[tx.status] || statusConfig.PENDING;
                  const declaredId = tx.metadata?.declaredTransactionId;
                  const payerPhone = tx.metadata?.payerPhone;
                  const rejectionReason = tx.metadata?.rejectionReason;

                  return (
                    <tr key={tx._id} className={`border-b border-slate-800/80 text-slate-200 ${tx.status === 'PENDING' ? 'bg-amber-500/[0.03]' : ''}`}>
                      <td className="py-4 pr-4">
                        <div className="font-mono text-[11px] text-gold-300">{tx.reference}</div>
                        {declaredId && (
                          <div className="mt-1 font-mono text-[10px] text-emerald-300">ID: {declaredId}</div>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white">{tx.user?.fullName || 'Utilisateur inconnu'}</div>
                        <div className="text-[10px] text-slate-400">{tx.user?.phone || '—'}</div>
                        {payerPhone && <div className="text-[10px] text-slate-400">Payeur : {payerPhone}</div>}
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white">{tx.amount} {tx.currency}</div>
                        <div className="text-[10px] text-slate-400">{tx.provider} • {tx.phone}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white">{tx.vote?.nomineeName || '—'}</div>
                        <div className="text-[10px] text-slate-400">
                          {tx.vote?.categoryName || '—'} • {tx.vote?.points ?? 0} voix
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold ${status.className}`}>
                          {status.icon}
                          {status.label}
                        </span>
                        {rejectionReason && (
                          <div className="mt-1 text-[10px] text-red-300">{rejectionReason}</div>
                        )}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {new Intl.DateTimeFormat('fr-CD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(tx.createdAt))}
                      </td>
                      <td className="py-4 pr-4">
                        {tx.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={actionId === tx._id}
                              onClick={() => handleValidate(tx)}
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Valider
                            </button>
                            <button
                              type="button"
                              disabled={actionId === tx._id}
                              onClick={() => handleReject(tx)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-red-200 hover:bg-red-500/20 disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <div className="text-right text-[10px] text-slate-500">Traitée</div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Aucune transaction ne correspond au filtre sélectionné.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

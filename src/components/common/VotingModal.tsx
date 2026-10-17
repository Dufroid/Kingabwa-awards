import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Nominee, Category } from '../../types/index.js';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominee: Nominee | null;
  category: Category | null;
  editionId: string;
  onVoteSuccess?: () => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({
  isOpen,
  onClose,
  nominee,
  category,
  editionId,
  onVoteSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [voteType, setVoteType] = useState<'FREE' | 'PAID'>('FREE');
  const [provider, setProvider] = useState<'AIRTEL_MONEY' | 'ORANGE_MONEY' | 'MOCK'>('AIRTEL_MONEY');
  const [increments, setIncrements] = useState(10);
  const [paymentPhone, setPaymentPhone] = useState('+243');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [paymentState, setPaymentState] = useState<{
    reference: string;
    otpCode: string;
    provider: string;
    phone: string;
  } | null>(null);
  const { showToast } = useToast();

  if (!isOpen || !nominee || !category) return null;

  const resetPaymentFlow = () => {
    setPaymentState(null);
    setConfirmationCode('');
  };

  const totalPrice = increments * 500;

  const handleConfirmVote = async () => {
    setSubmitting(true);
    try {
      if (voteType === 'FREE') {
        const payload = {
          editionId,
          categoryId: category._id,
          nomineeId: nominee._id,
          voteType,
        };

        const res = await api.post('/votes', payload);
        if (res.data.success) {
          setSuccess(true);
          showToast(res.data.message || 'Vote enregistré avec succès !', 'success');
          if (onVoteSuccess) onVoteSuccess();
        }
        return;
      }

      const payload = {
        editionId,
        categoryId: category._id,
        nomineeId: nominee._id,
        phone: paymentPhone,
        provider,
        increments,
      };

      const res = await api.post('/payments/mobile-money/initiate', payload);

      if (res.data.success) {
        const payment = res.data.payment || {};
        setPaymentState({
          reference: payment.reference || '',
          otpCode: payment.otpCode || '',
          provider: payment.providerLabel || payment.provider || provider,
          phone: payment.phone || paymentPhone,
        });
        showToast(payment.message || 'Paiement initié. Vérifiez le code de confirmation.', 'success');
      } else {
        showToast(res.data.message || 'Le paiement n’a pas pu être initié.', 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement de votre vote.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentState) return;

    setSubmitting(true);
    try {
      const res = await api.post('/payments/mobile-money/webhook', {
        reference: paymentState.reference,
        otpCode: confirmationCode,
        status: 'PAID',
      });

      if (res.data.success) {
        setSuccess(true);
        showToast(res.data.message || 'Paiement confirmé et vote enregistré.', 'success');
        if (onVoteSuccess) onVoteSuccess();
      } else {
        showToast(res.data.message || 'Le paiement n’a pas pu être confirmé.', 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de la confirmation du paiement.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setConfirmationCode('');
    setPaymentState(null);
    setVoteType('FREE');
    setProvider('AIRTEL_MONEY');
    setIncrements(10);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-lg rounded-2xl p-5 sm:p-8 border border-gold-400/30 relative overflow-hidden shadow-2xl my-4 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {!success ? (
            paymentState ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-400/40">
                    <ShieldCheck className="w-6 h-6 text-emerald-300 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gold-gradient">
                      Paiement mobile money
                    </h3>
                    <p className="text-xs text-slate-400">Validation du vote payant</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-emerald-100">
                    <span>Fournisseur</span>
                    <span className="font-bold">{paymentState.provider}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-100">
                    <span>Téléphone</span>
                    <span className="font-bold">{paymentState.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-emerald-100">
                    <span>Montant</span>
                    <span className="font-bold">{increments * 500} FC</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-dark-900 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Code de confirmation simulé</p>
                  <p className="mt-2 font-mono text-3xl font-bold tracking-[0.35rem] text-gold-300 break-all">
                    {paymentState.otpCode || '--- ---'}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Ce code est généré par le simulateur pour valider la transaction en mode test.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Entrez le code reçu
                  </label>
                  <input
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetPaymentFlow}
                    className="flex-1 py-3 px-4 rounded-full border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold text-xs transition-colors min-h-[48px]"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    disabled={submitting || confirmationCode.length < 6}
                    onClick={handleConfirmPayment}
                    className="flex-1 btn-gold py-3 px-4 text-xs font-extrabold uppercase tracking-wider disabled:opacity-50 min-h-[48px]"
                  >
                    {submitting ? 'Validation...' : 'Valider le paiement'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
                    <ShieldCheck className="w-6 h-6 text-dark-950 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gold-gradient">
                      Confirmation de Vote
                    </h3>
                    <p className="text-xs text-slate-400">Vote officiel Kingabwa Awards 2026</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-dark-900/80 p-4 rounded-xl border border-slate-800">
                  <img
                    src={nominee.profileImage}
                    alt={nominee.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold-400 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{nominee.fullName}</h4>
                    <p className="text-xs text-gold-400 font-semibold">{category.name}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Choisissez votre type de vote
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVoteType('FREE')}
                      className={`rounded-2xl border p-4 text-left transition-all min-h-[88px] ${
                        voteType === 'FREE'
                          ? 'border-gold-400 bg-gold-500/12 text-gold-100 shadow-[0_0_0_1px_rgba(234,179,8,0.2)]'
                          : 'border-slate-700 bg-dark-900 text-slate-300 hover:border-slate-500 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold uppercase tracking-wide">Vote gratuit</span>
                        <span className="rounded-full bg-gold-500/15 text-gold-200 px-2 py-1 text-[10px] font-bold">+1</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-2 leading-relaxed">Un vote unique par utilisateur, catégorie et édition.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoteType('PAID')}
                      className={`rounded-2xl border p-4 text-left transition-all min-h-[88px] ${
                        voteType === 'PAID'
                          ? 'border-emerald-400 bg-emerald-500/12 text-emerald-100 shadow-[0_0_0_1px_rgba(52,211,153,0.2)]'
                          : 'border-slate-700 bg-dark-900 text-slate-300 hover:border-slate-500 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold uppercase tracking-wide">Vote payant</span>
                        <span className="rounded-full bg-emerald-500/15 text-emerald-200 px-2 py-1 text-[10px] font-bold">+{increments}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-2 leading-relaxed">1 à 10 incréments • 500 FC par incrément.</div>
                    </button>
                  </div>
                </div>

                {voteType === 'PAID' && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-100">
                      Règle importante : la première transaction payante doit être de 10 incréments (5000 FC). Ensuite, tu peux acheter entre 1 et 10 incréments.
                    </div>

                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-dark-900 p-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
                        <span>Incréments</span>
                        <span className="font-bold text-gold-300">{increments} × 500 FC = {totalPrice} FC</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={increments}
                        onChange={(e) => setIncrements(Number(e.target.value))}
                        className="w-full accent-gold-400 h-2"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>1</span>
                        <span>10</span>
                      </div>
                    </div>

                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Fournisseur mobile money
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['AIRTEL_MONEY', 'ORANGE_MONEY', 'MOCK'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setProvider(option as 'AIRTEL_MONEY' | 'ORANGE_MONEY' | 'MOCK')}
                          className={`rounded-xl border px-2 py-2 text-[10px] font-bold uppercase transition ${
                            provider === option
                              ? 'border-gold-400 bg-gold-500/10 text-gold-200'
                              : 'border-slate-700 bg-dark-900 text-slate-300'
                          }`}
                        >
                          {option === 'AIRTEL_MONEY' ? 'Airtel' : option === 'ORANGE_MONEY' ? 'Orange' : 'Simulé'}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Numéro mobile money
                      </label>
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="+243 82 000 0000"
                        className="w-full bg-dark-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200 leading-relaxed">
                    {voteType === 'FREE'
                      ? 'Votre vote gratuit est limité à un par utilisateur et par catégorie. Il est comptabilisé immédiatement.'
                      : `Le simulateur génère un code pour valider le paiement mobile money avant l’ajout de ${increments} point(s) au candidat.`}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 rounded-full border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold text-xs transition-colors min-h-[48px]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleConfirmVote}
                    className="flex-1 btn-gold py-3 px-4 text-xs font-extrabold uppercase tracking-wider disabled:opacity-50 min-h-[48px]"
                  >
                    {submitting ? 'Enregistrement...' : voteType === 'FREE' ? 'Confirmer mon vote gratuit' : `Payer ${totalPrice} FC`}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-glow animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-dark-950 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-gold-gradient">
                Merci pour votre Vote !
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                Votre vote en faveur de <strong>{nominee.fullName}</strong> a été comptabilisé avec succès dans la catégorie <strong>{category.name}</strong>.
              </p>
              <button
                onClick={handleClose}
                className="btn-gold px-8 py-3 text-xs uppercase font-extrabold"
              >
                Continuer
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

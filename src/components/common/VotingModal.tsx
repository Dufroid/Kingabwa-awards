import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Copy, Check, Smartphone } from 'lucide-react';
import { Nominee, Category } from '../../types/index.js';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.js';
import { useAuth } from '../../context/AuthContext.js';

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominee: Nominee | null;
  category: Category | null;
  editionId: string;
  onVoteSuccess?: (voteType: 'FREE' | 'PAID') => void;
}

type PaidProvider = 'MPESA' | 'ORANGE_MONEY';

interface PaymentProviderInfo {
  key: PaidProvider;
  label: string;
  operator: string;
  phone: string;
}

interface PaymentMethods {
  merchantName: string;
  currency: string;
  pricePerVoice: number;
  firstPurchaseVoices: number;
  maxVoicesPerPayment: number;
  providers: PaymentProviderInfo[];
}

interface PaidVoteContext {
  firstPurchase: boolean;
  minIncrements: number;
  maxIncrements: number;
  lockedIncrements: number | null;
  pricePerIncrement: number;
  currency: string;
  hasPendingPayment: boolean;
  pendingReference: string | null;
}

interface InitiatedPayment {
  reference: string;
  provider: PaidProvider;
  providerLabel: string;
  operator: string;
  merchantPhone: string;
  merchantName: string;
  amount: number;
  currency: string;
  increments: number;
  status: string;
  instructions: string;
}

const providerOptions: Array<{ key: PaidProvider; label: string; operator: string; logo: string }> = [
  { key: 'MPESA', label: 'M-Pesa', operator: 'Vodacom RDC', logo: '/payment-logos/Mpesa.jpg' },
  { key: 'ORANGE_MONEY', label: 'Orange Money', operator: 'Orange RDC', logo: '/payment-logos/OrangeMoney.png' },
];

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
  const [successMessage, setSuccessMessage] = useState('');
  const [voteType, setVoteType] = useState<'FREE' | 'PAID'>('FREE');
  const [provider, setProvider] = useState<PaidProvider>('MPESA');
  const [increments, setIncrements] = useState(10);
  const [paymentPhone, setPaymentPhone] = useState('+243');
  const [transactionId, setTransactionId] = useState('');
  const [methods, setMethods] = useState<PaymentMethods | null>(null);
  const [context, setContext] = useState<PaidVoteContext | null>(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [paymentState, setPaymentState] = useState<InitiatedPayment | null>(null);
  const [copiedField, setCopiedField] = useState<'phone' | 'reference' | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.phone) {
      setPaymentPhone(user.phone);
    }
  }, [user?.phone]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    api.get('/payments/methods')
      .then((res) => {
        if (active && res.data.success) {
          setMethods(res.data.data);
        }
      })
      .catch(() => {
        if (active) setMethods(null);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || voteType !== 'PAID' || !nominee || !category || !editionId) return;
    let active = true;
    setContextLoading(true);

    api.get('/payments/paid-vote-context', {
      params: {
        editionId,
        categoryId: category._id,
        nomineeId: nominee._id,
      },
    })
      .then((res) => {
        if (!active || !res.data.success) return;
        const data: PaidVoteContext = res.data.data;
        setContext(data);
        setIncrements(data.lockedIncrements ?? data.minIncrements ?? 1);
      })
      .catch(() => {
        if (active) setContext(null);
      })
      .finally(() => {
        if (active) setContextLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, voteType, nominee?._id, category?._id, editionId]);

  if (!isOpen || !nominee || !category) return null;

  const selectedProviderInfo = methods?.providers.find((item) => item.key === provider);
  const merchantPhone = selectedProviderInfo?.phone || '';
  const pricePerVoice = context?.pricePerIncrement ?? methods?.pricePerVoice ?? 500;
  const totalPrice = increments * pricePerVoice;
  const isFirstPurchase = context?.firstPurchase ?? true;
  const lockedIncrements = context?.lockedIncrements ?? null;
  const hasPendingPayment = Boolean(context?.hasPendingPayment);

  const copyValue = async (value: string, field: 'phone' | 'reference') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      showToast('Copie automatique impossible. Copiez la valeur manuellement.', 'error');
    }
  };

  const handleConfirmVote = async () => {
    if (voteType === 'FREE') {
      setSubmitting(true);
      try {
        const res = await api.post('/votes', {
          editionId,
          categoryId: category._id,
          nomineeId: nominee._id,
          voteType,
        });

        if (res.data.success) {
          setSuccessMessage(res.data.message || `Votre vote gratuit en faveur de ${nominee.fullName} a été enregistré.`);
          setSuccess(true);
          showToast(res.data.message || 'Vote enregistré avec succès !', 'success');
          if (onVoteSuccess) onVoteSuccess('FREE');
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement de votre vote.';
        showToast(msg, 'error');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!merchantPhone) {
      showToast(`Le numéro de réception ${selectedProviderInfo?.label || ''} n'est pas configuré. Contactez l'organisation.`, 'error');
      return;
    }

    if (paymentPhone.trim().length < 8) {
      showToast('Renseignez le numéro de téléphone utilisé pour le paiement.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/payments/mobile-money/initiate', {
        editionId,
        categoryId: category._id,
        nomineeId: nominee._id,
        provider,
        increments,
      });

      if (res.data.success) {
        setPaymentState(res.data.payment);
        showToast('Référence générée. Effectuez le transfert puis déclarez votre transaction.', 'success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'La demande de paiement n\'a pas pu être créée.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeclarePayment = async () => {
    if (!paymentState) return;

    if (paymentPhone.trim().length < 8) {
      showToast('Renseignez le numéro de téléphone utilisé pour le paiement.', 'error');
      return;
    }

    if (transactionId.trim().length < 4) {
      showToast('Saisissez l\'identifiant de transaction reçu par SMS.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/payments/mobile-money/declare', {
        reference: paymentState.reference,
        payerPhone: paymentPhone.trim(),
        transactionId: transactionId.trim(),
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Paiement déclaré. Votre vote sera comptabilisé après validation par l\'administrateur.');
        setSuccess(true);
        showToast('Paiement déclaré avec succès', 'success');
        if (onVoteSuccess) onVoteSuccess('PAID');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'La déclaration du paiement a échoué.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setSuccessMessage('');
    setTransactionId('');
    setPaymentState(null);
    setVoteType('FREE');
    setProvider('MPESA');
    setIncrements(10);
    setContext(null);
    setCopiedField(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card w-full max-w-lg rounded-2xl p-4 sm:p-6 border border-gold-400/30 relative shadow-2xl my-2 sm:my-4 max-h-[92vh] overflow-y-auto overflow-x-hidden overscroll-contain"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-glow animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-dark-950 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-2xl font-extrabold text-gold-gradient">
                {voteType === 'PAID' ? 'Paiement déclaré !' : 'Merci pour votre Vote !'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                {voteType === 'PAID'
                  ? successMessage
                  : successMessage || `Votre vote en faveur de ${nominee.fullName} a été comptabilisé avec succès dans la catégorie ${category.name}.`}
              </p>
              {voteType === 'PAID' && paymentState && (
                <div className="rounded-2xl border border-slate-700 bg-dark-900 p-4 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Référence</span>
                    <span className="font-mono font-bold text-gold-300">{paymentState.reference}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Voix demandées</span>
                    <span className="font-bold text-white">{paymentState.increments}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Montant</span>
                    <span className="font-bold text-white">{paymentState.amount} FC</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleClose}
                className="btn-gold px-8 py-3 text-xs uppercase font-extrabold"
              >
                Continuer
              </button>
            </div>
          ) : paymentState ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-400/40">
                  <ShieldCheck className="w-6 h-6 text-emerald-300 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gold-gradient">
                    Effectuez le paiement
                  </h3>
                  <p className="text-xs text-slate-400">Puis déclarez votre transaction</p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-100">
                  <span>Montant à envoyer</span>
                  <span className="font-bold text-lg text-white">{paymentState.amount} {paymentState.currency}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-100">
                  <span>Opérateur</span>
                  <span className="font-bold">{paymentState.providerLabel} — {paymentState.operator}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-100">
                  <span>Voix</span>
                  <span className="font-bold">{paymentState.increments}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-dark-900 p-4 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Numéro de réception</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-mono text-xl font-bold tracking-wide text-white break-all">{paymentState.merchantPhone}</p>
                    <button
                      type="button"
                      onClick={() => copyValue(paymentState.merchantPhone, 'phone')}
                      className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-gold-400"
                      title="Copier le numéro"
                    >
                      {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Référence à indiquer dans le motif</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-mono text-base font-bold text-gold-300 break-all">{paymentState.reference}</p>
                    <button
                      type="button"
                      onClick={() => copyValue(paymentState.reference, 'reference')}
                      className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-gold-400"
                      title="Copier la référence"
                    >
                      {copiedField === 'reference' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                <li>Envoyez {paymentState.amount} {paymentState.currency} au numéro ci-dessus.</li>
                <li>Indiquez la référence <span className="font-mono text-gold-300">{paymentState.reference}</span> dans le motif.</li>
                <li>Saisissez ci-dessous l'ID de transaction reçu par SMS, puis validez.</li>
              </ol>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Numéro utilisé pour le paiement
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="+243 82 000 0000"
                    className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-gold-400"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  ID de transaction reçu par SMS *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Ex : MP240719.1234.A56789"
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-2xl border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold text-sm transition-colors min-h-[52px]"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  disabled={submitting || transactionId.trim().length < 4}
                  onClick={handleDeclarePayment}
                  className="flex-1 btn-gold py-3 px-4 text-sm font-extrabold uppercase tracking-wider disabled:opacity-50 min-h-[52px] rounded-2xl"
                >
                  {submitting ? 'Envoi...' : "J'ai effectué le paiement"}
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
                    className={`rounded-2xl border p-3.5 text-left transition-all min-h-[104px] ${
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
                    className={`rounded-2xl border p-3.5 text-left transition-all min-h-[104px] ${
                      voteType === 'PAID'
                        ? 'border-emerald-400 bg-emerald-500/12 text-emerald-100 shadow-[0_0_0_1px_rgba(52,211,153,0.2)]'
                        : 'border-slate-700 bg-dark-900 text-slate-300 hover:border-slate-500 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold uppercase tracking-wide">Vote payant</span>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-200 px-2 py-1 text-[10px] font-bold">+{increments}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-2 leading-relaxed">500 FC par voix, validé par l'administrateur.</div>
                  </button>
                </div>
              </div>

              {voteType === 'PAID' && (
                <div className="space-y-4">
                  {contextLoading ? (
                    <div className="rounded-2xl border border-slate-700 bg-dark-900 p-4 text-xs text-slate-400">
                      Chargement des conditions de paiement...
                    </div>
                  ) : hasPendingPayment ? (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-[11px] leading-relaxed text-amber-100">
                      Vous avez déjà un paiement en attente de validation pour ce candidat
                      {context?.pendingReference ? ` (référence ${context.pendingReference})` : ''}.
                      Patientez jusqu'à la validation par l'administrateur.
                    </div>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-100">
                        {isFirstPurchase
                          ? `Première transaction obligatoire : ${lockedIncrements ?? 10} voix pour ${(lockedIncrements ?? 10) * pricePerVoice} FC. Ensuite, vous pourrez acheter de 1 à ${context?.maxIncrements ?? 10} voix par paiement.`
                          : `Vous pouvez acheter de 1 à ${context?.maxIncrements ?? 10} voix, à ${pricePerVoice} FC par voix.`}
                      </div>

                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Choisissez l'opérateur de paiement
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {providerOptions.map((option) => (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => setProvider(option.key)}
                            className={`rounded-2xl border p-3 text-left transition-all min-h-[92px] ${
                              provider === option.key
                                ? 'border-gold-400 bg-gold-500/10 shadow-[0_0_0_1px_rgba(234,179,8,0.2)]'
                                : 'border-slate-700 bg-dark-900 hover:border-slate-500 hover:bg-slate-900/80'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img src={option.logo} alt={option.label} className="w-10 h-10 object-contain rounded-lg bg-white/5 p-1" />
                              <div>
                                <span className="block text-[11px] font-extrabold text-white uppercase tracking-wide">{option.label}</span>
                                <span className="block text-[10px] text-slate-400">{option.operator}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                        <p className="text-[10px] uppercase tracking-wider text-emerald-200">
                          Numéro {selectedProviderInfo?.operator || providerOptions.find((item) => item.key === provider)?.operator} à créditer
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-mono text-xl font-bold text-white break-all">
                            {merchantPhone || 'Numéro non configuré'}
                          </p>
                          {merchantPhone && (
                            <button
                              type="button"
                              onClick={() => copyValue(merchantPhone, 'phone')}
                              className="p-2 rounded-lg border border-emerald-500/40 text-emerald-100 hover:border-gold-400"
                              title="Copier le numéro"
                            >
                              {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-100 leading-relaxed">
                          Effectuez le transfert depuis votre téléphone, puis générez la référence de paiement à indiquer dans le motif.
                        </p>
                        {!merchantPhone && (
                          <p className="text-[11px] text-red-200">
                            Le numéro de réception n'est pas configuré. Contactez l'organisation avant de payer.
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-dark-900 p-3 space-y-3">
                        {lockedIncrements ? (
                          <div className="flex items-center justify-between text-[11px] text-slate-300">
                            <span className="uppercase tracking-wider text-slate-400">Nombre de voix</span>
                            <span className="font-bold text-gold-300">{lockedIncrements} voix = {lockedIncrements * pricePerVoice} FC</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
                              <span>Nombre de voix</span>
                              <span className="font-bold text-gold-300">{increments} × {pricePerVoice} FC = {totalPrice} FC</span>
                            </div>
                            <input
                              type="range"
                              min={context?.minIncrements ?? 1}
                              max={context?.maxIncrements ?? 10}
                              value={increments}
                              onChange={(e) => setIncrements(Number(e.target.value))}
                              className="w-full accent-gold-400 h-2"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{context?.minIncrements ?? 1}</span>
                              <span>{context?.maxIncrements ?? 10}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Numéro utilisé pour le paiement
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={paymentPhone}
                            onChange={(e) => setPaymentPhone(e.target.value)}
                            placeholder="+243 82 000 0000"
                            className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-gold-400"
                          />
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 leading-relaxed">
                  {voteType === 'FREE'
                    ? 'Votre vote gratuit est limité à un par utilisateur et par catégorie. Il est comptabilisé immédiatement.'
                    : 'Le paiement est vérifié manuellement par l’administrateur. Les voix sont ajoutées uniquement après validation de votre transaction.'}
                </p>
              </div>

              <div className="flex gap-3 pt-2 sticky bottom-0 bg-[#0f172a]/90 backdrop-blur-sm pb-1 -mx-1 px-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-2xl border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold text-sm transition-colors min-h-[52px]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={
                    submitting ||
                    (voteType === 'PAID' && (contextLoading || hasPendingPayment || !merchantPhone))
                  }
                  onClick={handleConfirmVote}
                  className="flex-1 btn-gold py-3 px-4 text-sm font-extrabold uppercase tracking-wider disabled:opacity-50 min-h-[52px] rounded-2xl"
                >
                  {submitting
                    ? 'Traitement...'
                    : voteType === 'FREE'
                      ? 'Confirmer mon vote'
                      : 'Générer ma référence'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

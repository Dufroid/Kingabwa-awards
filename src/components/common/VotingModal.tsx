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
  const { showToast } = useToast();

  if (!isOpen || !nominee || !category) return null;

  const handleConfirmVote = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/votes', {
        editionId,
        categoryId: category._id,
        nomineeId: nominee._id,
      });

      if (res.data.success) {
        setSuccess(true);
        showToast(res.data.message || 'Vote enregistré avec succès !', 'success');
        if (onVoteSuccess) onVoteSuccess();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement de votre vote.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-gold-400/30 relative overflow-hidden shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {!success ? (
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

              {/* Nominee details */}
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

              {/* Notice prompt requirement */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 leading-relaxed">
                  Vous êtes sur le point de voter pour <strong className="text-white">{nominee.fullName}</strong> dans la catégorie <strong className="text-white">{category.name}</strong>. Cette action est définitive et enregistre votre voix de manière sécurisée.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-full border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmVote}
                  className="flex-1 btn-gold py-3 px-4 text-xs font-extrabold uppercase tracking-wider disabled:opacity-50"
                >
                  {submitting ? 'Enregistrement...' : 'Confirmer mon vote'}
                </button>
              </div>
            </div>
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

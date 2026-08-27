import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, UserCheck } from 'lucide-react';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.js';

export const SubmitProposal: React.FC = () => {
  const [formData, setFormData] = useState({
    nomineeName: '',
    proposedCategory: 'Personnalité de l\'année',
    profession: '',
    biography: '',
    achievements: '',
    reason: '',
    referenceLinks: '',
    proposerFullName: '',
    proposerEmail: '',
    proposerPhone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        nomineeName: formData.nomineeName,
        proposedCategory: formData.proposedCategory,
        profession: formData.profession,
        biography: formData.biography,
        achievements: formData.achievements,
        reason: formData.reason,
        referenceLinks: formData.referenceLinks,
        proposerInformation: {
          fullName: formData.proposerFullName,
          email: formData.proposerEmail,
          phone: formData.proposerPhone,
        },
      };

      const res = await api.post('/proposals', payload);
      if (res.data.success) {
        setSubmitted(true);
        showToast('Proposition enregistrée avec succès !', 'success');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de la soumission de votre proposition.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Participation Citoyenne</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black uppercase text-white">
          Proposer un <span className="text-gold-gradient">Candidat</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
          Connaissez-vous une personnalité ou une élite de Kingabwa dont l'impact ou le talent mérite d'être publiquement honoré ? Soumettez sa candidature au comité.
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-gold-400/30 space-y-6 shadow-2xl">
          
          <div className="space-y-4 border-b border-slate-800 pb-6">
            <h3 className="font-serif text-lg font-bold text-gold-gradient flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gold-400" />
              Informations du Candidat Proposé
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom complet du candidat *</label>
                <input
                  type="text"
                  name="nomineeName"
                  required
                  value={formData.nomineeName}
                  onChange={handleChange}
                  placeholder="Ex: Prof. Honoré Mbaya"
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profession / Domaine *</label>
                <input
                  type="text"
                  name="profession"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Ex: Médecin / Entrepreneur"
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie suggérée *</label>
              <select
                name="proposedCategory"
                value={formData.proposedCategory}
                onChange={handleChange}
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              >
                <option value="Personnalité de l'année">Personnalité de l'année</option>
                <option value="Entrepreneur de l'année">Entrepreneur de l'année</option>
                <option value="Excellence académique">Excellence académique</option>
                <option value="Artiste de l'année">Artiste de l'année</option>
                <option value="Action sociale & Humanitaire">Action sociale & Humanitaire</option>
                <option value="Révélation & Jeune Talent">Révélation & Jeune Talent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Biographie sommaire *</label>
              <textarea
                name="biography"
                required
                rows={3}
                value={formData.biography}
                onChange={handleChange}
                placeholder="Présentez brièvement le parcours du candidat..."
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Réalisations & Impact à Kingabwa *</label>
              <textarea
                name="achievements"
                required
                rows={3}
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Listez les actions majeures accomplies..."
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pourquoi cette personne mérite-t-elle une distinction ? *</label>
              <textarea
                name="reason"
                required
                rows={2}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Explication des motivations..."
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Liens de référence (Optionnel)</label>
              <input
                type="text"
                name="referenceLinks"
                value={formData.referenceLinks}
                onChange={handleChange}
                placeholder="Page Facebook, article de presse, profil LinkedIn..."
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Proposer Info */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Vos Coordonnées (Proposant)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Votre Nom *</label>
                <input
                  type="text"
                  name="proposerFullName"
                  required
                  value={formData.proposerFullName}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Votre E-mail *</label>
                <input
                  type="email"
                  name="proposerEmail"
                  required
                  value={formData.proposerEmail}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Téléphone</label>
                <input
                  type="text"
                  name="proposerPhone"
                  value={formData.proposerPhone}
                  onChange={handleChange}
                  className="w-full bg-dark-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gold py-3.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Envoi en cours...' : 'Soumettre la proposition'}</span>
          </button>
        </form>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center space-y-6 border border-gold-400/40">
          <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-glow">
            <CheckCircle2 className="w-8 h-8 text-dark-950 stroke-[2.5]" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-gold-gradient">
            Proposition transmise avec succès !
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Le comité d'organisation vous remercie. Votre proposition sera examinée lors de la prochaine session d'évaluation des candidatures.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-outline-gold px-8 py-3 text-xs uppercase"
          >
            Soumettre une autre proposition
          </button>
        </div>
      )}

    </div>
  );
};

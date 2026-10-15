import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Lock, User, UserPlus, Smartphone } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone.trim()) {
      showToast('Le numéro de téléphone est requis.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/auth/register', {
        ...formData,
        phone: formData.phone.trim(),
      });
      if (res.data.success) {
        login(res.data.token, res.data.refreshToken, res.data.user);
        showToast('Compte créé avec succès ! Vous pouvez maintenant voter.', 'success');
        navigate('/nominees');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de la création de votre compte.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full rounded-3xl p-8 border border-gold-400/30 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-glow mb-2">
            <Award className="w-6 h-6 text-dark-950 stroke-[2.5]" />
          </div>
          <h1 className="font-serif text-2xl font-black text-white uppercase">Inscription Votant</h1>
          <p className="text-xs text-slate-400">Créez votre compte gratuit pour voter aux Kingabwa Awards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prénom *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jean"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nom *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Mukendi"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Numéro de téléphone *</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+243 82 000 0000"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-gold-400"
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de passe *</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Au moins 6 caractères"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-gold-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-gold py-3.5 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Inscription...' : 'Créer mon compte votant'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-gold-400 font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

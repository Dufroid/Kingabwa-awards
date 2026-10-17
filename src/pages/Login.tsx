import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, LogIn, Smartphone } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { AppLogo } from '../components/common/AppLogo.js';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/auth/login', { identifier, password });
      if (res.data.success) {
        login(res.data.token, res.data.refreshToken, res.data.user);
        showToast('Bienvenue ! Connexion réussie.', 'success');
        if (res.data.user.role === 'ADMIN' || res.data.user.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/nominees');
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Identifiants de connexion incorrects.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full rounded-3xl p-8 border border-gold-400/30 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-3">
          <AppLogo className="justify-center" compact={false} showText={false} imageClassName="w-14 h-14" />
          <h1 className="font-serif text-2xl font-black text-white uppercase">Connexion</h1>
          <p className="text-xs text-slate-400">Accédez à votre espace votant Kingabwa Awards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Numéro de téléphone</label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+243 82 000 0000"
                className="w-full bg-dark-900 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-gold-400"
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Connexion...' : 'Se Connecter'}</span>
          </button>
        </form>

        {/* Demo Accounts Quick Login
        <div className="bg-dark-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-gold-400 uppercase tracking-widest text-center">
            Comptes de Démonstration
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIdentifier('+243000000000');
                setPassword('Admin@2026');
              }}
              className="flex-1 py-1.5 bg-dark-800 text-[10px] text-slate-300 rounded border border-slate-700 hover:border-gold-400"
            >
              Super Admin
            </button>
            <button
              onClick={() => {
                setIdentifier('+243000000001');
                setPassword('Voter@2026');
              }}
              className="flex-1 py-1.5 bg-dark-800 text-[10px] text-slate-300 rounded border border-slate-700 hover:border-gold-400"
            >
              Votant Demo
            </button>
          </div>
        </div> */}

        <div className="text-center text-xs text-slate-400 pt-2">
          Vous n'avez pas encore de compte ?{' '}
          <Link to="/register" className="text-gold-400 font-bold hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, Menu, X, User, LogOut, LayoutDashboard, Vote, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Catégories', path: '/categories' },
    { name: 'Nominés', path: '/nominees' },
    { name: 'Blog', path: '/blog' },
    { name: 'Ancien Laureats', path: '/hall-of-fame' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Partenaires', path: '/partners' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-dark-950/80 border-b border-gold-400/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-dark-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif text-xl font-extrabold tracking-wider text-gold-gradient uppercase block">
                KINGABWA AWARDS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                ÉDITION 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-gold-400/10 border border-gold-400/30'
                    : 'text-slate-300 hover:text-gold-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/submit-proposal"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-gold-300 border border-gold-400/40 hover:border-gold-400 bg-gold-400/10 hover:bg-gold-400/20 transition-all shadow-gold-glow"
            >
            
              <span>Proposer un candidat</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-400 hover:bg-gold-500/30 transition-all"
                    title="Administration"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                )}

                <Link
                  to="/my-votes"
                  className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-gold-400 transition-all"
                  title="Mes votes"
                >
                  <Vote className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                  <span className="text-xs font-medium text-slate-300">
                    {user?.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-gold-300 transition-colors"
                >
                  Connexion
                </Link>
                <Link to="/register" className="btn-gold px-5 py-2 text-xs uppercase tracking-wider">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-gold-400 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark-900 border-b border-gold-400/20 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                isActive(link.path) ? 'text-gold-400 bg-gold-400/10' : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/submit-proposal"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-outline-gold text-center py-2.5 text-xs uppercase"
            >
              Proposer un candidat
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-votes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-gold-400"
                >
                  Mes Votes
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm text-gold-400 font-bold"
                  >
                    Espace Administration
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 text-sm text-red-400 font-medium"
                >
                  Se déconnecter ({user?.email || user?.phone || 'Compte'})
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-slate-300 border border-slate-700 rounded-full"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 btn-gold text-center py-2 text-xs uppercase"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

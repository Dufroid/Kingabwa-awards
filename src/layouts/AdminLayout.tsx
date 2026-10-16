import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  Users,
  Vote,
  Newspaper,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  LogOut,
  FolderTree,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-white">Accès Réservé aux Administrateurs</h1>
        <p className="text-slate-400 text-xs max-w-sm">Vous n'avez pas les autorisations nécessaires pour accéder au dashboard d'administration.</p>
        <Link to="/" className="btn-gold px-6 py-2 text-xs uppercase">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const menuItems = [
    { name: 'Tableau de Bord', path: '/admin', icon: LayoutDashboard },
    { name: 'Catégories', path: '/admin/categories', icon: FolderTree },
    { name: 'Nominés', path: '/admin/nominees', icon: Award },
    { name: 'Statistiques Votes', path: '/admin/votes', icon: Vote },
    { name: 'Transactions', path: '/admin/transactions', icon: Wallet },
    { name: 'Propositions Reçues', path: '/admin/proposals', icon: Sparkles },
    { name: 'Gestion Utilisateurs', path: '/admin/users', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-950 flex text-slate-100">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-gold-400/20 hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
              <Award className="w-5 h-5 text-dark-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif text-sm font-black text-gold-gradient block">ADMINISTRATION</span>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Kingabwa Awards</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive(item.path)
                      ? 'bg-gold-gradient text-dark-950 shadow-gold-glow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voir le site public</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-dark-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between">
          <h2 className="font-serif text-lg font-extrabold text-gold-gradient">
            Espace d'Administration Kingabwa Awards
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="bg-gold-400/20 text-gold-300 border border-gold-400/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              {user?.role}
            </span>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

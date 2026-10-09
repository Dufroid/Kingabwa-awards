import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-gold-400/20 pt-16 pb-12 relative overflow-hidden">
      <div className="ambient-glow top-0 right-0 opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: About & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-glow">
                <Award className="w-5 h-5 text-dark-950 stroke-[2.5]" />
              </div>
              <span className="font-serif text-lg font-extrabold tracking-wider text-gold-gradient">
                KINGABWA AWARDS
              </span>
            </div>
            <p className="text-gold-300 font-serif italic text-sm font-medium">
              « L'excellence de chez nous, célébrée par nous. »
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Événement socioculturel annuel dédié à la célébration, la reconnaissance et la récompense des élites et talents d'exception de Kingabwa.
            </p>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><Link to="/about" className="hover:text-gold-300 transition-colors">À propos du projet</Link></li>
              <li><Link to="/categories" className="hover:text-gold-300 transition-colors">Catégories d'Awards</Link></li>
              <li><Link to="/nominees" className="hover:text-gold-300 transition-colors">Candidats & Nominés</Link></li>
              <li><Link to="/hall-of-fame" className="hover:text-gold-300 transition-colors">Anciens lauréats</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-300 transition-colors">Galerie Médias</Link></li>
              <li><Link to="/blog" className="hover:text-gold-300 transition-colors">Actualités & Presse</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Contact & Secrétariat
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Kingabwa Limete, Avenue Limba 7, Kinshasa, RDC</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+243 825959006 / +243 898849759 / +243 823536240</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>contact@kingabwa-awards.cd</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Reseaux */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Restez Informé
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Inscrivez-vous pour recevoir les annonces officielles et la liste des gagnants.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex mb-4">
              <input
                type="email"
                placeholder="Votre e-mail..."
                className="bg-dark-850 border border-slate-800 rounded-l-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-400 flex-1"
              />
              <button type="submit" className="btn-gold px-4 py-2 text-xs font-bold rounded-r-lg rounded-l-none">
                OK
              </button>
            </form>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:bg-gold-400/10 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:bg-gold-400/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:bg-gold-400/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-slate-300 hover:text-gold-400 hover:bg-gold-400/10 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-850 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 KINGABWA AWARDS. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Mentions Légales</a>
            <a href="#" className="hover:text-slate-300">Politique de Confidentialité</a>
            <a href="#" className="hover:text-slate-300">Règlement du Vote</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, CalendarRange } from 'lucide-react';
import { AppLogo } from './AppLogo.js';
import {
  getVotingPhase,
  getVotingStatusLabel,
  getVotingTargetDate,
  type VotingPhase,
} from '../../config/votingPeriod.js';

const getTimeLeft = (targetDate: string) => {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export const Footer: React.FC = () => {
  const [voteState, setVoteState] = useState<{ phase: VotingPhase; timeLeft: ReturnType<typeof getTimeLeft> }>(() => {
    const phase = getVotingPhase();
    return { phase, timeLeft: getTimeLeft(getVotingTargetDate(phase)) };
  });

  useEffect(() => {
    const update = () => {
      const phase = getVotingPhase();
      setVoteState({ phase, timeLeft: getTimeLeft(getVotingTargetDate(phase)) });
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-dark-950 border-t border-gold-400/20 pt-16 pb-12 relative overflow-hidden">
      <div className="ambient-glow top-0 right-0 opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: About & Slogan */}
          <div className="space-y-4">
            <AppLogo compact={true} showText={true} textClassName="text-lg" imageClassName="w-10 h-10" />
            <p className="text-gold-300 font-serif italic text-sm font-medium">
              « L'excellence de chez nous, célébrée par nous. »
            </p>
            <div className="rounded-2xl border border-gold-400/25 bg-gold-400/5 p-3 space-y-2">
              <div className="flex items-center gap-2 text-gold-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                <CalendarRange className="w-3.5 h-3.5" />
                {getVotingStatusLabel(voteState.phase)}
              </div>
              <div className="text-[11px] text-slate-300">
                Du <span className="font-bold text-white">20</span> au <span className="font-bold text-white">27 Octobre 2026</span>
              </div>
              {voteState.phase !== 'CLOSED' && (
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  {[
                    { label: 'Jours', value: voteState.timeLeft.days },
                    { label: 'H', value: voteState.timeLeft.hours },
                    { label: 'M', value: voteState.timeLeft.minutes },
                    { label: 'S', value: voteState.timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-dark-900/80 border border-slate-800 px-1 py-2">
                      <div className="text-sm font-black text-gold-gradient">{String(item.value).padStart(2, '0')}</div>
                      <div className="text-[8px] uppercase tracking-wider text-slate-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

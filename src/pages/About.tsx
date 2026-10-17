import React from 'react';
import { Award, Target, Eye, Compass, Heart, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Award className="w-4 h-4" />
          <span>Histoire & Philosophie</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          À Propos des <span className="text-gold-gradient">Kingabwa Awards</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          « L'excellence de chez nous, célébrée par nous. »
        </p>
      </div>

      {/* History & Context */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-400/30 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-gradient">
            Origine du Projet
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
           Kingabwa Awards est né de la volonté de changer le regard porté sur Kingabwa, un quartier souvent associé à l'insécurité et à des stéréotypes négatifs. Pourtant, Kingabwa regorge d'entrepreneurs, de femmes battantes, de leaders et de talents qui contribuent chaque jour à son développement.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
           À travers cette initiative, nous voulons mettre en lumière ces richesses humaines, valoriser les réussites et faire de Kingabwa un symbole de mérite, d'excellence et de fierté.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-900/90 p-6 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-serif text-3xl font-extrabold text-gold-gradient">2025</span>
            <p className="text-xs text-slate-300 font-semibold">1ère Édition Inaugurale</p>
            <p className="text-[11px] text-slate-500">Lancement des premiers trophées du mérite local.</p>
          </div>
          <div className="bg-dark-900/90 p-6 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-serif text-3xl font-extrabold text-gold-gradient">2026</span>
            <p className="text-xs text-slate-300 font-semibold">2ème Édition Digitale</p>
            <p className="text-[11px] text-slate-500">Plateforme de vote web sécurisée et rayonnement international.</p>
          </div>
        </div>
      </div>

      {/* Vision, Mission, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-8 border border-gold-400/20 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient/20 flex items-center justify-center text-gold-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Notre Mission</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
           Promouvoir l'excellence, reconnaître le mérite et valoriser les talents qui contribuent positivement à la société, tout en inspirant la jeunesse et en participant à la revalorisation de l'image de Kingabwa.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-gold-400/20 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient/20 flex items-center justify-center text-gold-400">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Notre Vision</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Faire de Kingabwa une plaque tournante culturelle, un lieu de référence où se rencontrent et se célèbrent les talents et les leaders venus de différentes communes, provinces et pays du monde.

          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-gold-400/20 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient/20 flex items-center justify-center text-gold-400">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Nos Valeurs</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Integrité, transparence dans le processus de vote, équité, excellence, fraternité et amour du développement communautaire.
          </p>
        </div>
      </div>

      {/* Organizing Committee */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-400/30 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Gouvernance</span>
          <h2 className="font-serif text-3xl font-extrabold text-white">Comité d'Organisation</h2>
          <p className="text-xs text-slate-300">Une équipe pluridisciplinaire et engagée au service de la communauté.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { name: 'NADOR KWANZAMBI', role: 'Fondateur et Coordonnateur', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' },
            { name: 'Grace Kapinga', role: 'Directrice des Relations Publiques', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400' },
            { name: 'Patrick Lumu', role: 'Responsable du Jury & Évaluation', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400' },
          ].map((member, idx) => (
            <div key={idx} className="bg-dark-900/90 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
              <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gold-400" />
              <h4 className="font-bold text-white text-base">{member.name}</h4>
              <p className="text-xs text-gold-400 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

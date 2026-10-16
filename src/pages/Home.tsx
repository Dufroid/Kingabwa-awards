import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Users, Vote, Trophy, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Newspaper, HeartHandshake } from 'lucide-react';
import { CountdownTimer } from '../components/common/CountdownTimer.js';
import { CategoryCard } from '../components/common/CategoryCard.js';
import { NomineeCard } from '../components/common/NomineeCard.js';
import { VotingModal } from '../components/common/VotingModal.js';
import { Category, Nominee, BlogPost, Partner, AwardEdition } from '../types/index.js';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeEdition, setActiveEdition] = useState<AwardEdition | null>(null);
  
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, nomRes, blogRes, partnerRes] = await Promise.all([
          api.get('/categories'),
          api.get('/nominees'),
          api.get('/blog/posts?limit=3'),
          api.get('/partners'),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data);
        if (nomRes.data.success) setNominees(nomRes.data.data.slice(0, 4));
        if (blogRes.data.success) setBlogPosts(blogRes.data.data);
        if (partnerRes.data.success) setPartners(partnerRes.data.data);

        // Fetch active edition
        const edRes = await api.get('/admin/editions');

        if (edRes.data.success && edRes.data.data.length > 0) {
          const selectedEdition =
            edRes.data.data.find((edition: AwardEdition) => edition.status === 'OPEN') ||
            edRes.data.data[0];
          setActiveEdition(selectedEdition || null);
        }
      } catch (err) {
        console.error('Error fetching home data', err);
      }
    };

    fetchData();
  }, []);

  const handleVoteClick = (nominee: Nominee) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedNominee(nominee);
    setIsVoteModalOpen(true);
  };

  const selectedCategory = selectedNominee
    ? typeof selectedNominee.categoryId === 'object'
      ? selectedNominee.categoryId
      : categories.find((c) => c._id === selectedNominee.categoryId) || null
    : null;

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 px-4 overflow-hidden">
        {/* Background glow & luxury gradient overlays */}
        <div className="ambient-glow -top-20 -left-20" />
        <div className="ambient-glow bottom-0 right-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-400/10 via-dark-950 to-dark-950 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-400/40 bg-gold-400/10 text-gold-300 shadow-gold-glow"
          >
            
            <span className="text-xs font-bold uppercase tracking-widest">
             {activeEdition ? `${activeEdition.name} • ${activeEdition.year}` : 'KINGABWA AWARDS 2026 • Édition'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight"
          >
            L'EXCELLENCE DE CHEZ NOUS, <br />
            <span className="text-gold-gradient">CÉLÉBRÉE PAR NOUS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            La plus haute distinction socioculturelle dédiée à la reconnaissance et la récompense des élites, personnalités et talents d'exception de Kingabwa.
          </motion.p>

          {/* Countdown Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4"
          >
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-2">
              Grande Soirée de Gala dans :
            </p>
            <CountdownTimer targetDate={activeEdition?.ceremonyDate || '2026-11-04T20:00:00'} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/nominees" className="btn-gold px-8 py-4 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center">
              <Vote className="w-4 h-4" />
              <span>Voter Maintenant</span>
            </Link>
            <Link to="/categories" className="btn-outline-gold px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-full sm:w-auto justify-center">
              <span>Découvrir les catégories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* SECTION À PROPOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-400/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>À Propos des Kingabwa Awards</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Célébrer la ferveur et l'impact positif de notre communauté.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {activeEdition?.description || 'Kingabwa Awards est un événement socioculturel annuel dédié à la célébration, la reconnaissance et la récompense des talents, élites et personnalités qui font rayonner Kingabwa à travers leurs réalisations, leur engagement et leur impact dans différents domaines.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Reconnaissance de l'Excellence</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Transparence des Votes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Inspiration de la Jeunesse</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Fierté Communautaire</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400/40 shadow-gold-glow">
              <img
                src={activeEdition?.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800'}
                alt={activeEdition?.name || 'Soirée de Gala'}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-dark-950/80 backdrop-blur-md p-4 rounded-xl border border-gold-400/30">
                <p className="text-xs font-bold text-gold-gradient">{activeEdition?.name || 'Grande Cérémonie Annuelle'}</p>
                <p className="text-[11px] text-slate-300">{activeEdition?.location || 'Lieu à définir'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Award, count: categories.length || 6, label: 'Catégories d\'Awards' },
            { icon: Users, count: nominees.length ? nominees.length * 3 : 15, label: 'Nominés d\'Élite' },
            { icon: Vote, count: '1,420+', label: 'Votants Enregistrés' },
            { icon: Trophy, count: '12', label: 'Lauréats Récompensés' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 text-center border border-gold-400/20 space-y-2">
                <div className="w-10 h-10 rounded-full bg-gold-gradient/20 mx-auto flex items-center justify-center text-gold-400 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient">
                  {stat.count}
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { icon: Award, count: 14, label: 'Catégories d\'Awards' },
            { icon: Users, count:14, label: 'Nominés d\'Élite' },
            { icon: Vote, count: '1,420+', label: 'Votants Enregistrés' },
            { icon: Trophy, count: '12', label: 'Lauréats Récompensés' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 text-center border border-gold-400/20 space-y-2">
                <div className="w-10 h-10 rounded-full bg-gold-gradient/20 mx-auto flex items-center justify-center text-gold-400 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-extrabold text-gold-gradient">
                  {stat.count}
                </div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATÉGORIES POPULAIRES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Catégories Récompensées</span>
            <h2 className="font-serif text-3xl font-extrabold text-white mt-1">Explorez les Domaines d'Excellence</h2>
          </div>
          <Link to="/categories" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1">
            <span>Toutes les catégories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>

      {/* NOMINÉS À LA UNE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Candidats 2026</span>
            <h2 className="font-serif text-3xl font-extrabold text-white mt-1">Nominés à la Une</h2>
          </div>
          <Link to="/nominees" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1">
            <span>Voir tous les nominés</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nominees.map((nominee) => (
            <NomineeCard key={nominee._id} nominee={nominee} onVoteClick={handleVoteClick} />
          ))}
        </div>
      </section>

      {/* COMMENT VOTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-400/30 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Procédure Simple & Sécurisée</span>
            <h2 className="font-serif text-3xl font-extrabold text-white">Comment Voter en 4 Étapes ?</h2>
            <p className="text-xs text-slate-300">Votre voix est essentielle pour couronner les lauréats de cette édition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Créer un Compte', desc: 'Inscrivez-vous en 30 secondes pour obtenir votre identifiant sécurisé.' },
              { step: '02', title: 'Choisir une Catégorie', desc: 'Parcourez les différentes catégories et découvrez le profil des candidats.' },
              { step: '03', title: 'Sélectionner un Nominé', desc: 'Lisez les réalisations et le parcours de votre candidat favori.' },
              { step: '04', title: 'Valider votre Vote', desc: 'Confirmez votre vote via notre modal sécurisé. Vote enregistré instantanément.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-dark-900/80 p-6 rounded-2xl border border-slate-800 space-y-3 relative">
                <span className="font-serif text-3xl font-black text-gold-gradient block">{step.step}</span>
                <h4 className="font-bold text-white text-sm">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTUALITÉS RÉCENTES */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Presse & Blog</span>
              <h2 className="font-serif text-3xl font-extrabold text-white mt-1">Dernières Actualités</h2>
            </div>
            <Link to="/blog" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1">
              <span>Voir tout le blog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post._id} className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between">
                <div className="h-48 overflow-hidden relative">
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-gold-300 border border-gold-400/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                    {typeof post.categoryId === 'object' && post.categoryId ? post.categoryId.name : 'Actualité'}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-serif font-bold text-white text-base line-clamp-2 hover:text-gold-300 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2">{post.excerpt}</p>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{new Date(post.publishedAt).toLocaleDateString('fr-FR')}</span>
                    <span>{post.readTimeMinutes} min de lecture</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PARTENAIRES */}
      {partners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Nos Soutiens Institutionnels & Sponsors</span>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-80 hover:opacity-100 transition-opacity">
            {partners.map((partner) => (
              <div key={partner._id} className="glass-card px-6 py-4 rounded-xl border border-slate-800 flex items-center gap-3">
                <span className="font-serif font-extrabold text-sm text-gold-gradient">{partner.name}</span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-gold-400/20 text-gold-300 font-bold">
                  {partner.level}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-12 text-center border-2 border-gold-400/40 relative overflow-hidden shadow-gold-glow-lg">
          <div className="ambient-glow top-0 left-1/2 -translate-x-1/2 opacity-40" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Votre vote peut faire toute la différence.
            </h2>
            <p className="text-slate-300 text-sm">
              Soutenez l'excellence locale et contribuez au rayonnement des meilleurs talents de Kingabwa.
            </p>
            <Link to="/nominees" className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-xs font-extrabold uppercase tracking-wider">
              <Vote className="w-4 h-4" />
              <span>Voter Maintenant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Voting Modal */}
      {selectedNominee && selectedCategory && (
        <VotingModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
          nominee={selectedNominee}
          category={selectedCategory}
          editionId={activeEdition?._id || ''}
          onVoteSuccess={() => {
            // refresh data if needed
          }}
        />
      )}

    </div>
  );
};

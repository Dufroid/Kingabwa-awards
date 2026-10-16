import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Award, CheckCircle2, Vote, ArrowLeft, Facebook, Twitter, Instagram, Linkedin, Youtube, ShieldCheck } from 'lucide-react';
import { Nominee, Category, AwardEdition } from '../types/index.js';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { VotingModal } from '../components/common/VotingModal.js';

export const NomineeProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [activeEdition, setActiveEdition] = useState<AwardEdition | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNominee = async () => {
      try {
        const res = await api.get(`/nominees/${slug}`);
        if (res.data.success) {
          setNominee(res.data.data);
        }
        const edRes = await api.get('/admin/editions');
        if (edRes.data.success && edRes.data.data.length > 0) {
          setActiveEdition(edRes.data.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch nominee profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNominee();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-24 text-slate-400 font-medium">Chargement du profil...</div>;
  }

  if (!nominee) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="text-slate-400 text-lg">Candidat introuvable.</p>
        <Link to="/nominees" className="btn-outline-gold px-6 py-2 text-xs uppercase">
          Retour aux nominés
        </Link>
      </div>
    );
  }

  const categoryObj = typeof nominee.categoryId === 'object' ? nominee.categoryId : null;

  const handleVoteClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsVoteModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back link */}
      <Link to="/nominees" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-gold-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la liste des nominés</span>
      </Link>

      {/* Hero profile card */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-gold-400/30 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl">
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-gold-400 shadow-gold-glow-lg mb-4">
            <img src={nominee.profileImage} alt={nominee.fullName} className="w-full h-full object-cover" />
          </div>
          <span className="bg-gold-400/20 text-gold-300 border border-gold-400/40 text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-2">
            {categoryObj?.name || 'Nominé 2026'}
          </span>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              {nominee.fullName}
            </h1>
          </div>

          {/* Social Links */}
          {nominee.socialLinks && (
            <div className="flex items-center gap-3 pt-2">
              {nominee.socialLinks.facebook && (
                <a href={nominee.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-gold-400">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {nominee.socialLinks.twitter && (
                <a href={nominee.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-gold-400">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {nominee.socialLinks.instagram && (
                <a href={nominee.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-gold-400">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {nominee.socialLinks.linkedin && (
                <a href={nominee.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-gold-400">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          <div className="pt-4 flex items-center gap-4">
            <button onClick={handleVoteClick} className="btn-gold px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2">
              <Vote className="w-4 h-4" />
              <span>Voter pour {nominee.fullName.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      {nominee.achievements && nominee.achievements.length > 0 && (
        <div className="glass-card rounded-3xl p-8 border border-gold-400/20 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Award className="w-6 h-6 text-gold-400" />
            <h2 className="font-serif text-2xl font-bold text-white">Réalisations & Impact</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nominee.achievements.map((ach, idx) => (
              <div key={idx} className="bg-dark-900/90 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 text-xs leading-relaxed">{ach}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting Modal */}
      {categoryObj && (
        <VotingModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
          nominee={nominee}
          category={categoryObj}
          editionId={activeEdition?._id || ''}
        />
      )}

    </div>
  );
};

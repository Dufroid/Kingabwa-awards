import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Users, Award } from 'lucide-react';
import { NomineeCard } from '../components/common/NomineeCard.js';
import { VotingModal } from '../components/common/VotingModal.js';
import { Nominee, Category, AwardEdition } from '../types/index.js';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

export const Nominees: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';

  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [activeEdition, setActiveEdition] = useState<AwardEdition | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nomRes, catRes, edRes] = await Promise.all([
          api.get('/nominees'),
          api.get('/categories'),
          api.get('/admin/editions'),
        ]);

        if (nomRes.data.success) setNominees(nomRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (edRes.data.success && edRes.data.data.length > 0) {
          const selectedEdition =
            edRes.data.data.find((edition: AwardEdition) => edition.status === 'OPEN') ||
            edRes.data.data[0];
          setActiveEdition(selectedEdition || null);
        }
      } catch (err) {
        console.error('Failed to load nominees', err);
      } finally {
        setLoading(false);
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

  const filteredNominees = nominees.filter((n) => {
    const catId = typeof n.categoryId === 'object' ? n.categoryId._id : n.categoryId;
    const matchesCat = !selectedCategory || catId === selectedCategory;
    const matchesSearch = !searchQuery || n.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeCategoryObj = selectedNominee
    ? typeof selectedNominee.categoryId === 'object'
      ? selectedNominee.categoryId
      : categories.find((c) => c._id === selectedNominee.categoryId) || null
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-xs font-bold uppercase tracking-widest">
          <Users className="w-4 h-4" />
          <span>{activeEdition ? `${activeEdition.name} • ${activeEdition.year}` : 'Édition en cours'}</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Candidats & <span className="text-gold-gradient">Nominés Officiels</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {activeEdition?.description || 'Découvrez le profil des personnalités en compétition et soutenez votre candidat favori.'}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-6 border border-gold-400/30 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom de candidat..."
            className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-gold-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        {/* Category filter pills / select */}
        <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'btn-gold text-dark-950'
                : 'bg-dark-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat._id
                  ? 'btn-gold text-dark-950'
                  : 'bg-dark-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Nominees Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Chargement des nominés...</div>
      ) : filteredNominees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNominees.map((nominee) => (
            <NomineeCard key={nominee._id} nominee={nominee} onVoteClick={handleVoteClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">Aucun nominé ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {/* Voting Modal */}
      {selectedNominee && activeCategoryObj && (
        <VotingModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
          nominee={selectedNominee}
          category={activeCategoryObj}
          editionId={activeEdition?._id || ''}
          onVoteSuccess={() => {
            // Refetch nominees to update vote counts if needed
          }}
        />
      )}

    </div>
  );
};

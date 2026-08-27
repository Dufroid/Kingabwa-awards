import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, ChevronRight } from 'lucide-react';
import { Category } from '../../types/index.js';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl group-hover:bg-gold-400/20 transition-all pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient/20 border border-gold-400/30 flex items-center justify-center text-gold-400">
            <Award className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-400/10 text-gold-300 border border-gold-400/20">
            <Users className="w-3 h-3" />
            {category.nomineeCount ?? 0} Nominés
          </span>
        </div>

        <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-gold-300 transition-colors">
          {category.name}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">
          {category.description}
        </p>
      </div>

      <Link
        to={`/nominees?categoryId=${category._id}`}
        className="flex items-center justify-between text-xs font-bold text-gold-400 group-hover:text-gold-300 pt-4 border-t border-slate-800"
      >
        <span>Découvrir les nominés</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

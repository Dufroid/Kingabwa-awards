import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, Eye, CheckCircle2 } from 'lucide-react';
import { Nominee, Category } from '../../types/index.js';

interface NomineeCardProps {
  nominee: Nominee;
  onVoteClick: (nominee: Nominee) => void;
  hasVoted?: boolean;
}

export const NomineeCard: React.FC<NomineeCardProps> = ({ nominee, onVoteClick, hasVoted }) => {
  const categoryName = typeof nominee.categoryId === 'object' ? nominee.categoryId.name : '';

 return (
   <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group">
     <div className="relative h-72 overflow-hidden bg-dark-900">
       <img
         src={nominee.profileImage}
         alt={nominee.fullName}
         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
       />
       <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

       {categoryName && (
         <span className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-gold-300 border border-gold-400/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
           {categoryName}
         </span>
       )}

       {hasVoted && (
         <span className="absolute top-3 right-3 bg-emerald-500 text-dark-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
           <CheckCircle2 className="w-3.5 h-3.5" /> Voté
         </span>
       )}

       <div className="absolute bottom-4 left-4 right-4">
         <h3 className="font-serif text-xl font-extrabold text-white group-hover:text-gold-gradient transition-colors">
           {nominee.fullName}
         </h3>
       </div>
     </div>

     <div className="p-4">
       <button
         onClick={() => onVoteClick(nominee)}
         className="w-full btn-gold py-2.5 px-3 text-xs uppercase font-extrabold flex items-center justify-center gap-1.5"
       >
         <Vote className="w-3.5 h-3.5" />
         Voter
       </button>
     </div>
   </div>
 );
};

import React, { useEffect, useState } from 'react';
import { Vote } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer.js';
import {
  VOTING_PERIOD_LABEL,
  getVotingCountdownLabel,
  getVotingPhase,
  getVotingTargetDate,
  type VotingPhase,
} from '../../config/votingPeriod.js';

interface VotingCountdownProps {
  compact?: boolean;
}

export const VotingCountdown: React.FC<VotingCountdownProps> = ({ compact = false }) => {
  const [phase, setPhase] = useState<VotingPhase>(getVotingPhase());

  useEffect(() => {
    const interval = setInterval(() => setPhase(getVotingPhase()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-widest text-gold-300">
        <Vote className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>Vote en ligne</span>
        <span className="text-gold-400/50">•</span>
        <span>{VOTING_PERIOD_LABEL}</span>
      </div>
      <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-2">
        {getVotingCountdownLabel(phase)}
      </p>
      {phase !== 'CLOSED' && (
        <CountdownTimer compact={compact} targetDate={getVotingTargetDate(phase)} />
      )}
    </div>
  );
};

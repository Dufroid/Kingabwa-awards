import { useEffect, useState } from 'react';
import { getVotingPhase, type VotingPhase } from '../config/votingPeriod.js';

export const useVotingPhase = (): VotingPhase => {
  const [phase, setPhase] = useState<VotingPhase>(() => getVotingPhase());

  useEffect(() => {
    const interval = setInterval(() => setPhase(getVotingPhase()), 1000);
    return () => clearInterval(interval);
  }, []);

  return phase;
};

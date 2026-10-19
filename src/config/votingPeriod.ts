export const VOTING_START_DATE = '2026-10-20T00:00:00';
export const VOTING_END_DATE = '2026-10-27T23:59:59';
export const VOTING_PERIOD_LABEL = 'Du 20 au 27 Octobre 2026';

export type VotingPhase = 'UPCOMING' | 'OPEN' | 'CLOSED';

export const getVotingPhase = (now: Date = new Date()): VotingPhase => {
  if (now < new Date(VOTING_START_DATE)) return 'UPCOMING';
  if (now <= new Date(VOTING_END_DATE)) return 'OPEN';
  return 'CLOSED';
};

export const getVotingTargetDate = (phase: VotingPhase): string =>
  phase === 'UPCOMING' ? VOTING_START_DATE : VOTING_END_DATE;

export const getVotingCountdownLabel = (phase: VotingPhase): string => {
  if (phase === 'UPCOMING') return 'Ouverture des votes dans :';
  if (phase === 'OPEN') return 'Clôture des votes dans :';
  return 'Les votes sont clôturés.';
};

export const getVotingStatusLabel = (phase: VotingPhase): string => {
  if (phase === 'UPCOMING') return 'Ouverture des votes';
  if (phase === 'OPEN') return 'Votes en cours';
  return 'Votes clôturés';
};

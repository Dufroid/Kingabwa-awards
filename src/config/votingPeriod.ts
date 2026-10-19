export const VOTING_START_DATE = '2026-10-20T19:30:00+01:00';
export const VOTING_END_DATE = '2026-10-27T23:59:59+01:00';
export const VOTING_PERIOD_LABEL = 'Du 20 oct. 19h30 au 27 oct. 23h59';

export type VotingPhase = 'UPCOMING' | 'OPEN' | 'CLOSED';

export const getVotingPhase = (now: Date = new Date()): VotingPhase => {
  if (now < new Date(VOTING_START_DATE)) return 'UPCOMING';
  if (now <= new Date(VOTING_END_DATE)) return 'OPEN';
  return 'CLOSED';
};

export const isVotingOpen = (now: Date = new Date()): boolean => getVotingPhase(now) === 'OPEN';

export const getVotingAvailabilityMessage = (phase: VotingPhase): string => {
  if (phase === 'UPCOMING') return 'Les votes ouvrent le 20 octobre 2026 à 19h30.';
  return 'Les votes sont clôturés depuis le 27 octobre 2026 à 23h59.';
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

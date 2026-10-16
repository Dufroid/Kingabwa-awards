export type UserRole = 'VISITOR' | 'VOTER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
}

export interface AwardEdition {
  _id: string;
  name: string;
  year: number;
  description: string;
  startDate: string;
  ceremonyDate: string;
  votingStartDate: string;
  votingEndDate: string;
  status: 'UPCOMING' | 'OPEN' | 'CLOSED' | 'RESULTS_PUBLISHED';
}

export interface Category {
  _id: string;
  editionId: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  votingEnabled: boolean;
  order: number;
  nomineeCount?: number;
}

export interface Nominee {
  _id: string;
  editionId: string | AwardEdition;
  categoryId: string | Category;
  fullName: string;
  slug: string;
  profileImage: string;
  shortBio?: string;
  biography?: string;
  achievements: string[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  status: 'ACTIVE' | 'DISQUALIFIED';
  voteCount: number;
}

export interface Vote {
  _id: string;
  userId: string;
  editionId: AwardEdition;
  categoryId: Category;
  nomineeId: Nominee;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  authorId: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string;
  readTimeMinutes: number;
}

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  level: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
  order: number;
  active: boolean;
}

export interface Winner {
  _id: string;
  editionYear: number;
  editionName: string;
  categoryName: string;
  winnerName: string;
  winnerImage: string;
  description: string;
  achievements: string;
  announcedAt: string;
}

export interface GalleryMedia {
  _id: string;
  title: string;
  type: 'PHOTO' | 'VIDEO';
  url: string;
  thumbnailUrl?: string;
  category: 'CEREMONY' | 'RED_CARPET' | 'BEHIND_SCENES' | 'WINNERS';
  editionYear: number;
  description?: string;
}

export interface NominationProposal {
  _id: string;
  nomineeName: string;
  proposedCategory: string;
  profession: string;
  biography: string;
  achievements: string;
  reason: string;
  referenceLinks?: string;
  proposerInformation: {
    fullName: string;
    email: string;
    phone?: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

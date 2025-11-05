import { countryCode } from 'flag-pipe/lib/types';

export interface IMentor {
  name: string;
  country: countryCode;
  profilePicture: string;
  jobTitle: string;
  company: string;
  rating: number;
  numberOfReviews: number;
  price: number;
  currency: string;
  description: string;
  skills: string[];
  badges: string[];
}

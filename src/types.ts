/**
 * ChefDoor - Core Types Definition
 * Kept simple and visual for study by learners.
 */

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Chef {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  specialties: string[];
  pricePerHour: number;
  experience: number; // in years
  serviceArea: string;
  about: string;
  reviews: Review[];
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  chefId: string;
  chefName: string;
  cookingType: string;
  date: string;
  startTime: string;
  duration: number; // hours
  address: string;
  specialInstructions?: string;
  totalPrice: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  paymentMethod?: 'UPI' | 'Cash';
  paymentStatus?: 'Unpaid' | 'Paid';
  ratingGiven?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'User' | 'Chef';
  chefProfileId?: string; // If registered as Chef
}

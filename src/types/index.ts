export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed';
export type ActivityType = 'transport' | 'accommodation' | 'food' | 'activity' | 'sightseeing' | 'rest';
export type ExpenseCategory = 'flights' | 'accommodation' | 'food' | 'activities' | 'transport' | 'shopping' | 'other';
export type PlaceType = 'attraction' | 'restaurant' | 'hotel' | 'cafe' | 'museum' | 'park';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  status: TripStatus;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  type: ActivityType;
  notes?: string;
  cost?: number;
  coordinates?: { lat: number; lng: number };
}

export interface TripDay {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  activities: Activity[];
}

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  amountInBase: number;
  description: string;
  date: string;
  receiptURL?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  type: PlaceType;
  placeId: string;
  name: string;
  image: string;
  rating: number;
  location: string;
  createdAt: string;
}

// Search types
export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  class: string;
  seatsLeft: number;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  images: string[];
  location: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  type: 'hotel' | 'hostel' | 'apartment' | 'resort';
  description: string;
  coordinates: { lat: number; lng: number };
}

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  image: string;
  description: string;
  location: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  openingHours?: string;
  tags: string[];
  coordinates: { lat: number; lng: number };
}

// ─── Friends & Social ───────────────────────────────────────────────────────

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';
export type FriendActivityType =
  | 'new_trip'
  | 'completed_trip'
  | 'saved_place'
  | 'joined_trip'
  | 'added_expense'
  | 'new_friend';

export interface FriendProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  tripCount: number;
  countriesCount: number;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: string;
  friendSince?: string;
}

export interface FriendRequest {
  id: string;
  fromUid: string;
  fromDisplayName: string;
  fromPhotoURL?: string;
  fromEmail: string;
  toUid: string;
  status: FriendRequestStatus;
  createdAt: string;
}

export interface FriendActivity {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  type: FriendActivityType;
  title: string;
  description: string;
  image?: string;
  destination?: string;
  tripId?: string;
  likedBy: string[];
  commentCount: number;
  createdAt: string;
}

export interface SharedTrip {
  tripId: string;
  title: string;
  destination: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  ownerUid: string;
  ownerName: string;
  ownerPhoto?: string;
  memberCount: number;
}

// ─── Budget ──────────────────────────────────────────────────────────────────

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  currency: string;
  byCategory: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }[];
  byDay: {
    date: string;
    amount: number;
  }[];
}

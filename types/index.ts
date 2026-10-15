export type ServiceCategory = 
  | 'Hair' 
  | 'Skin' 
  | 'Nails' 
  | 'Bridal & Makeup' 
  | 'Grooming';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number; // in minutes
  price: number; // in INR (₹)
  image: string;
  isActive: boolean;
  featured?: boolean;
  badge?: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface ServiceSummaryItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: ServiceCategory;
}

export interface Booking {
  id: string; // e.g. "DEMO-8472"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNotes?: string;
  serviceIds: string[];
  servicesSummary: ServiceSummaryItem[];
  totalPrice: number;
  totalDuration: number; // in minutes
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  status: BookingStatus;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export interface BookingFormData {
  serviceIds: string[];
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNotes: string;
}

export type Role = 'CLIENT' | 'BARBER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string; // ISO Date string
  time: string; // HH:mm format
  status: AppointmentStatus;
  clientName?: string; // Denormalized for display convenience
  serviceName?: string;
  price?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// UI Types
export interface ToastMessage {
  id: string;
  title: string;
  type: 'success' | 'error' | 'info';
}
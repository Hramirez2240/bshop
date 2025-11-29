import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Appointment, Service, AppointmentStatus, ToastMessage } from './types';
import { addDays, format, isSameDay } from 'date-fns';

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte Clásico & Estilo', durationMinutes: 45, price: 1300, description: 'Corte personalizado, lavado y peinado profesional.', imageUrl: '/images/services/classic-cut.png' },
  { id: '2', name: 'Perfilado de Barba Spa', durationMinutes: 30, price: 700, description: 'Toalla caliente, navaja y tratamiento de aceites esenciales.', imageUrl: '/images/services/beard-grooming.png' },
  { id: '3', name: 'Coloración & Mechas', durationMinutes: 120, price: 2000, description: 'Tinte completo o mechas balayage con hidratación.', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop' },
  { id: '4', name: 'Manicura Premium', durationMinutes: 40, price: 700, description: 'Limpieza, cutículas, exfoliación y esmaltado gel.', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop' },
  { id: '5', name: 'Tratamiento Capilar Intensivo', durationMinutes: 60, price: 1500, description: 'Hidratación profunda, reconstrucción y brillo para cabellos dañados.', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop' },
  { id: '6', name: 'Peinado & Styling', durationMinutes: 50, price: 1200, description: 'Peinado profesional con técnicas modernas para eventos especiales.', imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop' },
  { id: '7', name: 'Limpieza & Depilación', durationMinutes: 45, price: 900, description: 'Limpieza facial profunda con máscara y depilación de cejas.', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop' },
  { id: '8', name: 'Corte & Afeitado Barbero Clásico', durationMinutes: 40, price: 1100, description: 'Corte completo con máquina y afeitado clásico con brocha y jabón.', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop' },
];

const USERS: User[] = [];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt_1',
    clientId: 'c1',
    barberId: 'b1',
    serviceId: '1',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '10:00',
    status: 'CONFIRMED',
    clientName: 'Alex Cliente',
    serviceName: 'Corte Clásico & Estilo',
    price: 35
  },
  {
    id: 'appt_2',
    clientId: 'c1',
    barberId: 'b1',
    serviceId: '2',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '15:30',
    status: 'PENDING',
    clientName: 'Alex Cliente',
    serviceName: 'Perfilado de Barba Spa',
    price: 25
  }
];

interface AppState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string, role: User['role']) => void;
  logout: () => void;

  services: Service[];
  barbers: User[];
  appointments: Appointment[];

  addAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  getAppointmentsByDate: (date: Date, barberId: string) => Appointment[];

  toasts: ToastMessage[];
  addToast: (title: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: USERS,
      currentUser: null,
      isAuthenticated: false,
      services: MOCK_SERVICES,
      barbers: USERS.filter(u => u.role === 'BARBER'),
      appointments: MOCK_APPOINTMENTS,
      toasts: [],

      login: (email) => {
        const { users } = get();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          get().addToast(`Bienvenido de nuevo, ${user.name}`, 'success');
          return true;
        } else {
          get().addToast('Usuario no encontrado. Regístrate primero.', 'error');
          return false;
        }
      },

      register: (name, email, role) => {
        const { users } = get();
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
          get().addToast('Este correo ya está registrado.', 'error');
          return;
        }

        const isFemale = name.trim().toLowerCase().endsWith('a');
        const avatarType = isFemale ? 'girl' : 'boy';
        const avatarUrl = `https://avatar.iran.liara.run/public/${avatarType}?username=${encodeURIComponent(name)}`;

        const newUser: User = {
          id: `u_${Date.now()}`,
          name,
          email,
          role,
          avatarUrl: avatarUrl
        };

        const newUsersList = [...users, newUser];

        set({
          users: newUsersList,
          currentUser: newUser,
          isAuthenticated: true,
          barbers: role === 'BARBER' ? newUsersList.filter(u => u.role === 'BARBER') : get().barbers
        });

        get().addToast(`Cuenta creada con éxito. ¡Hola ${name}!`, 'success');
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
        get().addToast('Sesión cerrada correctamente', 'info');
      },

      addAppointment: (data) => {
        const newAppt: Appointment = {
          ...data,
          id: `appt_${Date.now()}`,
          status: 'PENDING'
        };
        set((state) => ({ appointments: [...state.appointments, newAppt] }));
        get().addToast('¡Solicitud enviada! Espera la confirmación.', 'info');
      },

      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, status } : a
          )
        }));
        const message = status === 'CONFIRMED' ? 'Cita aprobada y confirmada' : 'Estado actualizado';
        get().addToast(message, 'success');
      },

      cancelAppointment: (id) => {
        set((state) => {
          const appointment = state.appointments.find(a => a.id === id);
          if (!appointment || !appointment.price) {
            return {
              appointments: state.appointments.map(a =>
                a.id === id ? { ...a, status: 'CANCELLED' } : a
              )
            };
          }

          const penaltyRate = appointment.status === 'CONFIRMED' ? 0.6 : 0.5;
          const penaltyAmount = appointment.price * penaltyRate;

          const updatedUsers = state.users.map(u =>
            u.id === appointment.clientId
              ? { ...u, debt: (u.debt || 0) + penaltyAmount }
              : u
          );

          return {
            appointments: state.appointments.map(a =>
              a.id === id ? { 
                ...a, 
                status: 'CANCELLED',
                cancellationPenalty: penaltyAmount
              } : a
            ),
            users: updatedUsers,
            currentUser: state.currentUser && state.currentUser.id === appointment.clientId
              ? { ...state.currentUser, debt: (state.currentUser.debt || 0) + penaltyAmount }
              : state.currentUser
          };
        });
        get().addToast('Cita cancelada. Se aplicó una penalidad por cancelación.', 'info');
      },

      getAppointmentsByDate: (date, barberId) => {
        const { appointments } = get();
        const formattedDate = format(date, 'yyyy-MM-dd');
        return appointments.filter(a =>
          a.date === formattedDate &&
          a.barberId === barberId &&
          a.status === 'CONFIRMED'
        );
      },

      addToast: (title, type) => {
        const id = Math.random().toString(36).substring(7);
        set(state => ({ toasts: [...state.toasts, { id, title, type }] }));
        setTimeout(() => get().removeToast(id), 3000);
      },

      removeToast: (id) => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
      }
    }),
    {
      name: 'bshop-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        appointments: state.appointments,
        services: state.services,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        barbers: state.barbers
      }),
    }
  )
);
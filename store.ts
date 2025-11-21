import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Appointment, Service, AppointmentStatus, ToastMessage } from './types';
import { addDays, format, isSameDay } from 'date-fns';

// --- Mock Data Inicial ---

const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte Clásico & Estilo', durationMinutes: 45, price: 35, description: 'Corte personalizado, lavado y peinado profesional.' },
  { id: '2', name: 'Perfilado de Barba Spa', durationMinutes: 30, price: 25, description: 'Toalla caliente, navaja y tratamiento de aceites esenciales.' },
  { id: '3', name: 'Coloración & Mechas', durationMinutes: 120, price: 85, description: 'Tinte completo o mechas balayage con hidratación.' },
  { id: '4', name: 'Manicura Premium', durationMinutes: 40, price: 30, description: 'Limpieza, cutículas, exfoliación y esmaltado gel.' },
];

// Usuarios iniciales (Limpiado: Solo un barbero y un cliente de demostración)
const INITIAL_USERS: User[] = [
  { 
    id: 'b1', 
    name: 'Marco Rossi', 
    email: 'marco@bshop.com', 
    role: 'BARBER', 
    avatarUrl: 'https://avatar.iran.liara.run/public/boy?username=Marco' 
  },
  { 
    id: 'c1', 
    name: 'Alex Cliente', 
    email: 'alex@cliente.com', 
    role: 'CLIENT', 
    avatarUrl: 'https://avatar.iran.liara.run/public/boy?username=Alex' 
  }
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt_1',
    clientId: 'c1',
    barberId: 'b1',
    serviceId: '1',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), // Mañana
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
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), // Pasado mañana
    time: '15:30',
    status: 'PENDING', // Cita pendiente para que el barbero pueda probar aprobar/rechazar
    clientName: 'Alex Cliente',
    serviceName: 'Perfilado de Barba Spa',
    price: 25
  }
];

interface AppState {
  // Auth State
  users: User[]; // Lista completa de usuarios registrados
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean; // Retorna true si éxito
  register: (name: string, email: string, role: User['role']) => void;
  logout: () => void;

  // Data State
  services: Service[];
  barbers: User[]; // Subconjunto de users filtrado por rol BARBER
  appointments: Appointment[];

  // Actions
  addAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  getAppointmentsByDate: (date: Date, barberId: string) => Appointment[];

  // UI State
  toasts: ToastMessage[];
  addToast: (title: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      currentUser: null,
      isAuthenticated: false,
      services: MOCK_SERVICES,
      barbers: INITIAL_USERS.filter(u => u.role === 'BARBER'),
      appointments: MOCK_APPOINTMENTS,
      toasts: [],

      login: (email) => {
        const { users } = get();
        // Buscar insensible a mayúsculas/minúsculas
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

        // Heurística simple para avatar basado en género por nombre (termina en 'a' suele ser femenino en español)
        // Usamos una API de avatares 3D moderna
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
          currentUser: newUser, // Auto login al registrar
          isAuthenticated: true,
          // Si es barbero, actualizar la lista de barberos visible
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
        console.log(`Store updating: ${id} to ${status}`);
        set((state) => ({
          appointments: state.appointments.map(a => 
            a.id === id ? { ...a, status } : a
          )
        }));
        const message = status === 'CONFIRMED' ? 'Cita aprobada y confirmada' : 'Estado actualizado';
        get().addToast(message, 'success');
      },

      cancelAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.map(a => 
            a.id === id ? { ...a, status: 'CANCELLED' } : a
          )
        }));
        get().addToast('Cita cancelada', 'info');
      },

      getAppointmentsByDate: (date, barberId) => {
        const { appointments } = get();
        return appointments.filter(a => 
          isSameDay(new Date(a.date), date) && 
          a.barberId === barberId && 
          a.status !== 'CANCELLED'
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
      name: 'bshop-storage', // Nombre único en LocalStorage
      storage: createJSONStorage(() => localStorage), // Usar LocalStorage
      partialize: (state) => ({ 
        // Decidir qué datos guardar. No guardamos "toasts" ni estado de carga UI.
        users: state.users,
        appointments: state.appointments,
        services: state.services,
        currentUser: state.currentUser, // Persistir sesión actual
        isAuthenticated: state.isAuthenticated,
        barbers: state.barbers
      }),
    }
  )
);
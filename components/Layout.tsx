import React from 'react';
import { useAppStore } from '../store';
import { HashRouter as Router, Link, useLocation } from 'react-router-dom';
import { Scissors, Calendar, User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-gold-500' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAppStore();
  const location = useLocation();
  const isClient = currentUser?.role === 'CLIENT';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-8 py-6 border-b border-zinc-800/50 sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-gold-500/20 p-2 rounded-lg border border-gold-500/20">
            <Sparkles className="text-gold-500" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">BShop<span className="text-gold-500">.</span></span>
        </div>

        {currentUser && (
          <nav className="flex items-center gap-8">
            <Link to="/dashboard" className="text-sm font-medium hover:text-gold-500 transition-colors">Mi Agenda</Link>
            {/* Solo clientes pueden ver el botón de reservar */}
            {isClient && (
              <Link to="/booking" className="text-sm font-medium hover:text-gold-500 transition-colors">Reservar Cita</Link>
            )}
            <button onClick={logout} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Salir</button>
            <div className="h-8 w-8 rounded-full bg-gold-500 text-zinc-950 flex items-center justify-center font-bold overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentUser.name[0]
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50">
         <div className="flex items-center gap-2">
          <Sparkles className="text-gold-500" size={20} />
          <span className="text-lg font-bold">BShop</span>
        </div>
        {currentUser && (
           <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gold-500">{currentUser.name.substring(0,2).toUpperCase()}</span>
              )}
           </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl animate-fade-in">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {currentUser && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 flex justify-around items-center px-2 z-50">
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Inicio" active={location.pathname === '/dashboard'} />
          
          {/* Botón central de reserva solo para clientes */}
          {isClient ? (
            <div className="relative -top-6">
               <Link to="/booking" className="flex items-center justify-center h-14 w-14 rounded-full bg-gold-500 text-zinc-950 shadow-lg shadow-gold-500/30">
                 <Scissors size={24} />
               </Link>
            </div>
          ) : (
             // Espaciador para mantener layout si es barbero
             <div className="w-14" /> 
          )}

          <button onClick={logout} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-zinc-500">
            <LogOut size={24} />
            <span className="text-[10px] font-medium">Salir</span>
          </button>
        </nav>
      )}
    </div>
  );
};
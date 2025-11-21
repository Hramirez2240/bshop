import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User, Lock, Mail, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login, register } = useAppStore();
  const navigate = useNavigate();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState<'CLIENT' | 'BARBER'>('CLIENT');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    setTimeout(() => {
      let success = false;
      
      if (isRegisterMode) {
        if (!name) {
          setIsLoading(false);
          return;
        }
        register(name, email, role);
        success = true;
      } else {
        success = login(email);
      }

      setIsLoading(false);
      
      if (success) {
        navigate('/dashboard');
      }
    }, 800);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setName('');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md p-8 border-zinc-800 shadow-2xl shadow-black/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/10 text-gold-500 mb-4 border border-gold-500/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRegisterMode ? 'Crear Cuenta' : 'Bienvenido'}
          </h1>
          <p className="text-zinc-400">
            {isRegisterMode ? 'Únete a la experiencia BShop' : 'Accede a tu cuenta BShop'}
          </p>
        </div>

        {isRegisterMode && (
          <div className="flex p-1 bg-zinc-800 rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'CLIENT' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Cliente
            </button>
            <button 
              type="button"
              onClick={() => setRole('BARBER')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'BARBER' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Estilista
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegisterMode && (
            <div className="animate-slide-up">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required={isRegisterMode}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
              />
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isRegisterMode 
              ? `Registrarse como ${role === 'CLIENT' ? 'Cliente' : 'Estilista'}`
              : 'Iniciar Sesión'}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-500">
              {isRegisterMode ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button 
                type="button"
                onClick={toggleMode}
                className="ml-2 text-gold-500 hover:underline font-medium focus:outline-none"
              >
                {isRegisterMode ? 'Inicia Sesión' : 'Regístrate gratis'}
              </button>
            </p>
          </div>
        </form>
      </Card>
      
      {!isRegisterMode && (
        <div className="fixed bottom-4 text-xs text-zinc-600 text-center px-4">
          <p>Cuentas demo pre-cargadas:</p>
          <p>Cliente: alex@cliente.com | Estilista: marco@bshop.com</p>
        </div>
      )}
    </div>
  );
};
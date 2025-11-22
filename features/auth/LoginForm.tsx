import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User, Lock, Mail, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { login, register } = useAppStore();
  const navigate = useNavigate();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState<'CLIENT' | 'BARBER'>('CLIENT');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidGmail = (emailValue: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const isValidPassword = (passwordValue: string) => {
    return passwordValue.length >= 4 && /\d/.test(passwordValue);
  };

  const emailErrors = useMemo(() => {
    if (!email) return [];
    const errors = [];
    if (!isValidGmail(email)) {
      errors.push('Ingresa un correo electrónico válido');
    }
    return errors;
  }, [email]);

  const nameErrors = useMemo(() => {
    if (!name) return [];
    if (name.trim().length < 3) return ['El nombre debe tener al menos 3 caracteres'];
    return [];
  }, [name]);

  const passwordErrors = useMemo(() => {
    if (!password) return [];
    const errors = [];
    if (password.length < 4) {
      errors.push('Mínimo 4 caracteres');
    }
    if (!/\d/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    return errors;
  }, [password]);

  const isRegisterValid = isRegisterMode && 
    name.trim().length > 0 && 
    nameErrors.length === 0 &&
    emailErrors.length === 0 && 
    passwordErrors.length === 0;

  const isLoginValid = !isRegisterMode && 
    emailErrors.length === 0 && 
    email.length > 0 &&
    password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegisterMode && !isRegisterValid) return;
    if (!isRegisterMode && !isLoginValid) return;

    setIsLoading(true);
    
    setTimeout(() => {
      let success = false;
      
      if (isRegisterMode) {
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
    setPassword('');
  };

  const FieldError = ({ errors }: { errors: string[] }) => {
    if (errors.length === 0) return null;
    return (
      <div className="mt-2 space-y-1">
        {errors.map((error, idx) => (
          <p key={idx} className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </p>
        ))}
      </div>
    );
  };

  const FieldSuccess = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return (
      <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
        <CheckCircle size={12} /> Correcto
      </p>
    );
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
                  className={`w-full bg-zinc-950 border rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none transition-all ${
                    name && nameErrors.length === 0 
                      ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                      : nameErrors.length > 0
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-zinc-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500'
                  }`}
                />
              </div>
              <FieldError errors={nameErrors} />
              <FieldSuccess show={name && nameErrors.length === 0} />
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
                className={`w-full bg-zinc-950 border rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none transition-all ${
                  email && emailErrors.length === 0 
                    ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : emailErrors.length > 0
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-zinc-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500'
                }`}
              />
            </div>
            <FieldError errors={emailErrors} />
            <FieldSuccess show={email && emailErrors.length === 0} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-zinc-950 border rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none transition-all ${
                  password && passwordErrors.length === 0 
                    ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : passwordErrors.length > 0
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-zinc-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500'
                }`}
              />
            </div>
            {isRegisterMode && (
              <>
                <FieldError errors={passwordErrors} />
                <FieldSuccess show={password && passwordErrors.length === 0} />
              </>
            )}
            {!isRegisterMode && password && (
              <p className="mt-1 text-xs text-zinc-400">Contraseña ingresada</p>
            )}
          </div>

          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            disabled={isRegisterMode ? !isRegisterValid : !isLoginValid}
          >
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
    </div>
  );
};
import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { format, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SHOP_OPEN_HOUR, SHOP_CLOSE_HOUR, TIME_SLOT_INTERVAL } from '../../constants';

const STEPS = ['Servicio', 'Profesional', 'Fecha y Hora', 'Confirmar'];

export const BookingFlow = () => {
  const navigate = useNavigate();
  const { services, barbers, addAppointment, getAppointmentsByDate, currentUser, addToast } = useAppStore();
  
  useEffect(() => {
    if (currentUser && currentUser.role === 'BARBER') {
      addToast('Los estilistas no pueden crear reservas desde esta cuenta.', 'error');
      navigate('/dashboard');
    }
  }, [currentUser, navigate, addToast]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  
  const getStartOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getStartOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableDates = useMemo(() => {
    const today = getStartOfToday();
    return Array.from({ length: 14 }).map((_, i) => addDays(today, i));
  }, []);

  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate) return [];

    const takenAppts = getAppointmentsByDate(selectedDate, selectedBarber);
    const takenTimes = new Set(takenAppts.map(a => a.time));

    const slots = [];
    const currentTime = new Date(selectedDate);
    currentTime.setHours(SHOP_OPEN_HOUR, 0, 0, 0);
    
    const endTime = new Date(selectedDate);
    endTime.setHours(SHOP_CLOSE_HOUR, 0, 0, 0);

    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      slots.push({
        time: timeString,
        available: !takenTimes.has(timeString)
      });
      currentTime.setTime(currentTime.getTime() + TIME_SLOT_INTERVAL * 60000);
    }
    return slots;
  }, [selectedDate, selectedBarber, getAppointmentsByDate]);

  const handleConfirm = () => {
    if (!currentUser || !selectedService || !selectedBarber || !selectedTime) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const serviceDetails = services.find(s => s.id === selectedService);
      
      addAppointment({
        clientId: currentUser.id,
        barberId: selectedBarber,
        serviceId: selectedService,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        clientName: currentUser.name,
        serviceName: serviceDetails?.name,
        price: serviceDetails?.price
      });
      setIsProcessing(false);
      navigate('/dashboard');
    }, 1500);
  };

  const renderServiceStep = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <Card 
          key={service.id} 
          onClick={() => { setSelectedService(service.id); setCurrentStep(1); }}
          className={`p-6 transition-all ${selectedService === service.id ? 'ring-2 ring-gold-500 bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <span className="text-gold-500 font-bold">${service.price}</span>
          </div>
          <p className="text-sm text-zinc-400 mb-4">{service.description}</p>
          <div className="flex items-center text-xs text-zinc-500 bg-zinc-900/50 py-1 px-2 rounded w-fit">
            <Clock size={12} className="mr-1" />
            {service.durationMinutes} min
          </div>
        </Card>
      ))}
    </div>
  );

  const renderBarberStep = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {barbers.map((barber) => (
        <Card 
          key={barber.id} 
          onClick={() => { setSelectedBarber(barber.id); setCurrentStep(2); }}
          className="p-4 flex items-center gap-4 hover:bg-zinc-800/50"
        >
          <img src={barber.avatarUrl} alt={barber.name} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
          <div>
            <h3 className="font-semibold text-lg text-white">{barber.name}</h3>
            <p className="text-sm text-gold-500 flex items-center gap-1"><Sparkles size={12}/> Estilista Senior</p>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Selecciona Fecha</label>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {availableDates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={date.toString()}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all
                  ${isSelected 
                    ? 'bg-gold-500 text-zinc-950 border-gold-500 font-bold shadow-lg shadow-gold-500/20' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'}
                `}
              >
                <span className="text-xs uppercase">{format(date, 'EEE')}</span>
                <span className="text-xl">{format(date, 'd')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-400">Selecciona Hora</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {availableSlots.map((slot) => (
            <button
              key={slot.time}
              disabled={!slot.available}
              onClick={() => setSelectedTime(slot.time)}
              className={`
                py-3 px-2 rounded-lg text-sm font-medium border transition-all
                ${!slot.available ? 'opacity-30 cursor-not-allowed bg-zinc-900 border-zinc-800 decoration-zinc-500 line-through' : ''}
                ${selectedTime === slot.time 
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 text-zinc-200'}
              `}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      <Button 
        className="w-full mt-4" 
        disabled={!selectedTime}
        onClick={() => setCurrentStep(3)}
      >
        Continuar al Resumen
      </Button>
    </div>
  );

  const renderSummaryStep = () => {
    const service = services.find(s => s.id === selectedService);
    const barber = barbers.find(b => b.id === selectedBarber);

    return (
      <div className="space-y-6">
        <Card className="p-6 border-gold-500/30 bg-gradient-to-b from-zinc-900 to-black">
          <div className="text-center border-b border-zinc-800 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gold-500 mb-1">Resumen de Cita</h2>
            <p className="text-zinc-400">Por favor revisa los detalles</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CalendarIcon className="text-zinc-500" size={20} />
                <div>
                  <p className="text-sm text-zinc-400">Fecha y Hora</p>
                  <p className="font-medium capitalize">{format(selectedDate, 'MMMM d, yyyy')} a las {selectedTime}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                <User className="text-zinc-500" size={20} />
                <div>
                  <p className="text-sm text-zinc-400">Profesional</p>
                  <p className="font-medium">{barber?.name}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <div>
                <p className="font-semibold text-lg">{service?.name}</p>
                <p className="text-sm text-zinc-500">{service?.durationMinutes} mins</p>
              </div>
              <div className="text-xl font-bold text-gold-500">${service?.price}</div>
            </div>
          </div>
        </Card>

        <Button fullWidth onClick={handleConfirm} isLoading={isProcessing} size="lg">
          Enviar Solicitud de Reserva
        </Button>
        <p className="text-center text-xs text-zinc-500">
          El estilista confirmará tu solicitud en breve.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className={`flex items-center text-sm mb-4 ${currentStep === 0 ? 'opacity-0' : 'text-zinc-400 hover:text-white'}`}
        >
          <ChevronLeft size={16} className="mr-1" /> Volver
        </button>
        
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{STEPS[currentStep]}</h1>
          <span className="text-sm text-zinc-500">Paso {currentStep + 1} de 4</span>
        </div>
        
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="animate-fade-in">
        {currentStep === 0 && renderServiceStep()}
        {currentStep === 1 && renderBarberStep()}
        {currentStep === 2 && renderDateTimeStep()}
        {currentStep === 3 && renderSummaryStep()}
      </div>
    </div>
  );
};
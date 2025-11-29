import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SHOP_OPEN_HOUR, SHOP_CLOSE_HOUR, TIME_SLOT_INTERVAL, SANTO_DOMINGO_TIMEZONE_OFFSET } from '../../constants';

const STEPS = ['Servicio', 'Profesional', 'Fecha y Hora', 'Confirmar'];

export const BookingFlow = () => {
  const navigate = useNavigate();
  const { services, barbers, addAppointment, getAppointmentsByDate, currentUser, addToast, appointments } = useAppStore();

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
    return startOfDay(new Date());
  };

  const getCurrentTimeSantoDomingo = () => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const sdTime = new Date(utcTime + (SANTO_DOMINGO_TIMEZONE_OFFSET * 60 * 60 * 1000));
    return sdTime;
  };

  const getTodaySantoDomingo = () => {
    const sdNow = getCurrentTimeSantoDomingo();
    return startOfDay(sdNow);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getTodaySantoDomingo());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableDates = useMemo(() => {
    const today = getTodaySantoDomingo();
    return Array.from({ length: 14 }).map((_, i) => addDays(today, i));
  }, []);

  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate || !selectedService) return [];

    const serviceDuration = services.find(s => s.id === selectedService)?.durationMinutes || 30;

    const barberAppts = getAppointmentsByDate(selectedDate, selectedBarber);

    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const isOverlapping = (start1: number, end1: number, start2: number, end2: number) => {
      return start1 < end2 && start2 < end1;
    };

    const slots = [];
    const openTime = SHOP_OPEN_HOUR * 60;
    const closeTime = SHOP_CLOSE_HOUR * 60;

    const barberBusySlots = barberAppts.map(appt => {
      const apptService = services.find(s => s.id === appt.serviceId);
      const duration = apptService?.durationMinutes || 30;
      const start = timeToMinutes(appt.time);
      return { start, end: start + duration };
    });

    const clientBusySlots = currentUser ? appointments
      .filter(a => {
        const formattedDate = format(new Date(a.date), 'yyyy-MM-dd');
        const selectedDateFormatted = format(selectedDate, 'yyyy-MM-dd');
        return a.clientId === currentUser.id && 
        a.barberId === selectedBarber &&
        formattedDate === selectedDateFormatted && 
        a.status === 'CONFIRMED';
      })
      .map(appt => {
        const apptService = services.find(s => s.id === appt.serviceId);
        const duration = apptService?.durationMinutes || 30;
        const start = timeToMinutes(appt.time);
        return { start, end: start + duration };
      }) : [];

    const nowSantoDomingo = getCurrentTimeSantoDomingo();
    const todaySantoDomingo = getTodaySantoDomingo();
    const isToday = isSameDay(selectedDate, todaySantoDomingo);
    const currentMinutes = isToday ? (nowSantoDomingo.getHours() * 60 + nowSantoDomingo.getMinutes()) : -1;

    let currentStepTime = openTime;

    while (currentStepTime + serviceDuration <= closeTime) {
      const timeString = `${Math.floor(currentStepTime / 60).toString().padStart(2, '0')}:${(currentStepTime % 60).toString().padStart(2, '0')}`;

      const slotStart = currentStepTime;
      const slotEnd = currentStepTime + serviceDuration;

      let isAvailable = true;

      if (isToday && slotEnd <= currentMinutes) {
        isAvailable = false;
      }

      if (isAvailable) {
        for (const busy of barberBusySlots) {
          if (isOverlapping(slotStart, slotEnd, busy.start, busy.end)) {
            isAvailable = false;
            break;
          }
        }
      }

      if (isAvailable) {
        for (const busy of clientBusySlots) {
          if (isOverlapping(slotStart, slotEnd, busy.start, busy.end)) {
            isAvailable = false;
            break;
          }
        }
      }

      slots.push({
        time: timeString,
        available: isAvailable
      });

      currentStepTime += TIME_SLOT_INTERVAL;
    }

    return slots;
  }, [selectedDate, selectedBarber, selectedService, getAppointmentsByDate, services, appointments, currentUser, getCurrentTimeSantoDomingo, getTodaySantoDomingo]);

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
          className={`group relative overflow-hidden p-0 transition-all border-0 ${selectedService === service.id ? 'ring-2 ring-gold-500' : 'hover:ring-1 hover:ring-zinc-700'}`}
        >
          <div className="absolute inset-0">
            <img
              src={service.imageUrl || '/images/services/default.jpg'}
              alt={service.name}
              className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent ${selectedService === service.id ? 'opacity-90' : 'opacity-80'}`} />
          </div>

          <div className="relative p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-white group-hover:text-gold-500 transition-colors">{service.name}</h3>
              <span className="text-gold-500 font-bold bg-zinc-950/50 px-2 py-1 rounded backdrop-blur-sm">${service.price}</span>
            </div>
            <p className="text-sm text-zinc-300 mb-4 flex-grow">{service.description}</p>
            <div className="flex items-center text-xs text-zinc-300 bg-zinc-900/80 py-1.5 px-3 rounded-full w-fit backdrop-blur-sm border border-zinc-800">
              <Clock size={12} className="mr-1.5 text-gold-500" />
              {service.durationMinutes} min
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderBarberStep = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {barbers.length > 0 ? (
        barbers.map((barber) => (
          <Card
            key={barber.id}
            onClick={() => { setSelectedBarber(barber.id); setCurrentStep(2); }}
            className="p-4 flex items-center gap-4 hover:bg-zinc-800/50"
          >
            <img src={barber.avatarUrl} alt={barber.name} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
            <div>
              <h3 className="font-semibold text-lg text-white">{barber.name}</h3>
              <p className="text-sm text-gold-500 flex items-center gap-1"><Sparkles size={12} /> Estilista Senior</p>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-8 col-span-full text-center border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600">
            <User size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-zinc-300 font-medium">No hay estilistas disponibles en este momento</p>
            <p className="text-zinc-500 text-sm">Por favor, intenta más tarde</p>
          </div>
        </Card>
      )}
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
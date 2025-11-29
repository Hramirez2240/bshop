import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { Appointment, User as UserType, Role } from '../../types';
import { format, isPast, parseISO } from 'date-fns';
import { Calendar, Clock, Scissors, User, AlertTriangle, FileText, Check, X, Hourglass, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SANTO_DOMINGO_TIMEZONE_OFFSET } from '../../constants';

const getBarberName = (barberId: string, barbers: UserType[]) => {
  return barbers.find(b => b.id === barberId)?.name || 'Estilista';
};

const AppointmentCard: React.FC<{ 
  appt: Appointment; 
  isHistory?: boolean;
  userRole: Role;
  barberName: string;
  onCancelClick: (id: string) => void;
  onConfirmClick?: (id: string) => void;
}> = ({ appt, isHistory = false, userRole, barberName, onCancelClick, onConfirmClick }) => {
  
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const isBarber = userRole === 'BARBER';
  const isClient = userRole === 'CLIENT';
  const isPending = appt.status === 'PENDING';
  const isConfirmed = appt.status === 'CONFIRMED';

  const handleConfirm = async () => {
    if (onConfirmClick) {
      setIsLocalLoading(true);
      await new Promise(r => setTimeout(r, 500)); // UX delay
      onConfirmClick(appt.id);
      setIsLocalLoading(false);
    }
  };

  // Determine styles based on status
  let statusColor = 'bg-zinc-800 text-zinc-400';
  let borderClass = '';
  
  if (isConfirmed) {
    statusColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    borderClass = 'border-l-4 border-l-gold-500';
  } else if (isPending) {
    statusColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    if (!isHistory) borderClass = 'border-l-4 border-l-amber-500 bg-gradient-to-br from-zinc-900 to-amber-900/10';
  } else if (appt.status === 'CANCELLED') {
    statusColor = 'bg-red-500/10 text-red-500 border border-red-500/20';
  }

  const renderActions = () => {
    if (isBarber && isPending) {
      return (
        <div className="flex gap-3 w-full animate-fade-in">
          <Button 
            variant="primary" 
            className="flex-1 text-xs py-2 h-10 bg-emerald-600 hover:bg-emerald-500 border-0 text-white shadow-lg shadow-emerald-900/20"
            onClick={handleConfirm}
            isLoading={isLocalLoading}
          >
            <ThumbsUp size={14} className="mr-2" /> Aprobar
          </Button>
          <Button 
            variant="danger" 
            className="flex-1 text-xs py-2 h-10 border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
            onClick={() => onCancelClick(appt.id)}
            disabled={isLocalLoading}
          >
            <ThumbsDown size={14} className="mr-2" /> Rechazar
          </Button>
        </div>
      );
    }

    // PRIORITY 2: Cliente con Cita Pendiente
    if (isClient && isPending) {
       return (
        <Button 
          variant="danger" 
          className="w-full text-xs py-2 h-10 opacity-80 hover:opacity-100 bg-zinc-800 hover:bg-red-900/30 border-zinc-700"
          onClick={() => onCancelClick(appt.id)}
        >
          Cancelar Solicitud
        </Button>
      );
    }

    // PRIORITY 3: Historial o Canceladas (Solo lectura)
    if ((isHistory && !isPending) || appt.status === 'CANCELLED' || appt.status === 'COMPLETED') {
      return <p className="text-xs text-center text-zinc-600 w-full">Esta cita ha finalizado o fue cancelada.</p>;
    }

    // CASO 4: Barbero con Cita Confirmada (Cancelar Emergencia)
    if (isBarber && isConfirmed) {
      return (
         <Button 
           variant="danger" 
           className="w-full text-xs py-2 h-10 opacity-60 hover:opacity-100 bg-zinc-800 hover:bg-red-900/30 border-zinc-700"
           onClick={() => onCancelClick(appt.id)}
         >
           Cancelar Cita (Emergencia)
         </Button>
      );
    }

    // CASO 5: Cliente con Cita Confirmada
    if (isClient && isConfirmed) {
      return (
        <Button 
          variant="danger" 
          className="w-full text-xs py-2 h-10 bg-red-600 hover:bg-red-500 text-white"
          onClick={() => onCancelClick(appt.id)}
        >
          ✕ Cancelar Cita
        </Button>
      );
    }

    return null;
  };

  return (
    <Card className={`p-5 flex flex-col gap-4 transition-all duration-300 min-h-[200px]
      ${isHistory && !isPending ? 'opacity-60 bg-zinc-900/30' : 'bg-zinc-900/80'}
      ${borderClass}
    `}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-white line-clamp-1">{appt.serviceName}</h3>
          <p className="text-zinc-400 text-sm flex items-center gap-2 mt-1">
            <User size={14} />
            {isClient ? `con ${barberName}` : `Cliente: ${appt.clientName}`}
          </p>
        </div>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-semibold flex items-center gap-1 ${statusColor}`}>
          {isConfirmed && <Check size={10} />}
          {isPending && <Hourglass size={10} />}
          {appt.status === 'CANCELLED' && <X size={10} />}
          {isConfirmed ? 'Confirmada' : isPending ? 'Pendiente' : appt.status === 'CANCELLED' ? 'Cancelada' : appt.status}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-zinc-300">
        <div className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded">
          <Calendar size={14} className="text-gold-500" />
          {format(parseISO(appt.date), 'd MMM, yyyy')}
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded">
          <Clock size={14} className="text-gold-500" />
          {appt.time}
        </div>
        {appt.price && (
          <div className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded ml-auto">
            <Scissors size={14} className="text-gold-500" />
            ${appt.price}
          </div>
        )}
      </div>

      {appt.status === 'CANCELLED' && appt.cancellationPenalty && (
        <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-sm">
          <p className="text-red-400 font-semibold">Penalidad por cancelación</p>
          <p className="text-red-300 text-xs mt-1">
            {appt.price && appt.cancellationPenalty / appt.price >= 0.55 ? '60%' : '50%'} del servicio: ${appt.cancellationPenalty.toFixed(2)}
          </p>
        </div>
      )}

      {/* Actions Area - Always at bottom */}
      <div className="pt-4 border-t border-zinc-800/50 mt-auto">
        {renderActions()}
      </div>
    </Card>
  );
};

export const Dashboard = () => {
  const { currentUser, appointments, cancelAppointment, updateAppointmentStatus, barbers } = useAppStore();
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!currentUser) return null;

  const getAppointmentDateTime = (appt: Appointment) => {
    try {
      return parseISO(appt.date + 'T' + appt.time);
    } catch {
      const [year, month, day] = appt.date.split('-').map(Number);
      const [hours, minutes] = appt.time.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
  };

  const getCurrentTimeSantoDomingo = () => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const sdTime = new Date(utcTime + (SANTO_DOMINGO_TIMEZONE_OFFSET * 60 * 60 * 1000));
    return sdTime;
  };

  const isClient = currentUser.role === 'CLIENT';
  
  const myAppointments = appointments
    .filter(appt => isClient ? appt.clientId === currentUser.id : appt.barberId === currentUser.id)
    .sort((a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime());

  const pending = myAppointments.filter(a => a.status === 'PENDING');
  
  const confirmed = myAppointments.filter(a => a.status === 'CONFIRMED');
  
  const history = myAppointments.filter(a => 
    a.status === 'CANCELLED' || a.status === 'COMPLETED'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const nowSantoDomingo = getCurrentTimeSantoDomingo();
      confirmed.forEach(appt => {
        const apptTime = getAppointmentDateTime(appt);
        if (nowSantoDomingo >= apptTime && appt.status === 'CONFIRMED') {
          updateAppointmentStatus(appt.id, 'COMPLETED');
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, [confirmed, updateAppointmentStatus, getAppointmentDateTime, getCurrentTimeSantoDomingo]);

  const handleConfirmCancel = () => {
    if (appointmentToCancel) {
      setIsCancelling(true);
      setTimeout(() => {
        cancelAppointment(appointmentToCancel);
        setIsCancelling(false);
        setAppointmentToCancel(null);
        setCancelReason('');
      }, 800);
    }
  };

  const handleAcceptRequest = (id: string) => {
    updateAppointmentStatus(id, 'CONFIRMED');
  };

  const handleCloseModal = () => {
    if (!isCancelling) {
      setAppointmentToCancel(null);
      setCancelReason('');
    }
  };

  return (
    <>
      <div className="space-y-8 pb-20">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            Hola, <span className="text-gold-500">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="text-zinc-400 mt-1">
            {isClient ? 'Aquí tienes el estado de tus reservas.' : 'Gestiona tus solicitudes y agenda.'}
          </p>
          {isClient && currentUser.debt && currentUser.debt > 0 && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <p className="text-red-300 text-sm">
                <span className="font-semibold">Deuda pendiente:</span> ${currentUser.debt.toFixed(2)}
              </p>
              <p className="text-red-400 text-xs mt-1">Penalidades por cancelación de citas</p>
            </div>
          )}
        </header>

        {pending.length > 0 && (
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <div className="bg-amber-500/20 p-1.5 rounded-lg">
                  <Hourglass className="text-amber-500" size={20} />
                </div>
                {isClient ? 'Pendientes de Confirmación' : 'Solicitudes Requieren Acción'}
              </h2>
              <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                {pending.length}
              </span>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map(appt => (
                <AppointmentCard 
                  key={appt.id} 
                  appt={appt} 
                  userRole={currentUser.role}
                  barberName={getBarberName(appt.barberId, barbers)}
                  onCancelClick={setAppointmentToCancel}
                  onConfirmClick={handleAcceptRequest}
                />
              ))}
            </div>
          </section>
        )}

        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
            <Scissors className="text-gold-500" size={20} />
            Citas Confirmadas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {confirmed.length > 0 ? (
              confirmed.map(appt => (
                <AppointmentCard 
                  key={appt.id} 
                  appt={appt} 
                  userRole={currentUser.role}
                  barberName={getBarberName(appt.barberId, barbers)}
                  onCancelClick={setAppointmentToCancel} 
                />
              ))
            ) : (
              <Card className="p-8 text-center border-dashed border-zinc-800 bg-transparent flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                  <Calendar size={24} />
                </div>
              <div className="space-y-1">
                  <p className="text-zinc-300 font-medium">No hay citas confirmadas</p>
                  <p className="text-zinc-500 text-sm">
                    {isClient 
                      ? (pending.length > 0 ? 'Tus solicitudes están siendo revisadas.' : '¿Listo para un cambio de look?') 
                      : 'Tu agenda está libre por ahora.'}
                  </p>
                </div>
                {isClient && pending.length === 0 && <Button onClick={() => window.location.hash = '#/booking'}>Reservar Ahora</Button>}
              </Card>
            )}
          </div>
        </section>

        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4 text-zinc-500 flex items-center gap-2">
            <Clock size={20} /> Historial
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.length > 0 ? (
              history.map(appt => (
                <AppointmentCard 
                  key={appt.id} 
                  appt={appt} 
                  isHistory={true}
                  userRole={currentUser.role}
                  barberName={getBarberName(appt.barberId, barbers)}
                  onCancelClick={() => {}} 
                />
              ))
            ) : (
              <p className="text-zinc-600 text-sm italic">No se encontró historial reciente.</p>
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={!!appointmentToCancel}
        onClose={handleCloseModal}
        title={isClient ? "Cancelar Cita" : "Rechazar Solicitud"}
      >
        <div className="flex flex-col gap-4">
          {isClient && appointmentToCancel && (() => {
            const appt = appointments.find(a => a.id === appointmentToCancel);
            const penaltyRate = appt?.status === 'CONFIRMED' ? 0.6 : 0.5;
            const penalty = appt?.price ? appt.price * penaltyRate : 0;
            const penaltyPercent = Math.round(penaltyRate * 100);
            return (
              <div className="flex items-start gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <div className="bg-red-500/20 p-2 rounded-full text-red-500 flex-shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-500">Penalidad por Cancelación</h4>
                  <p className="text-sm text-red-400/80 mt-1">
                    {appt?.status === 'CONFIRMED' 
                      ? 'Se aplicará una penalidad del 60% por cancelar una cita confirmada.' 
                      : 'Se aplicará una penalidad del 50% sobre el servicio.'}
                  </p>
                  <div className="mt-3 bg-red-500/20 px-3 py-2 rounded border border-red-500/30">
                    <p className="text-xs text-red-400">Monto a cobrar ({penaltyPercent}%):</p>
                    <p className="text-lg font-bold text-red-400">${penalty.toFixed(2)}</p>
                  </div>
                  {appt?.status === 'CONFIRMED' && (
                    <p className="text-xs text-red-300 mt-2 italic">
                      ⚠️ La penalidad es mayor porque tu estilista ya confirmó la cita.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
          
          {!isClient && (
            <div className="flex items-center gap-4 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <div className="bg-red-500/20 p-2 rounded-full text-red-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-red-500">¿Estás seguro?</h4>
                <p className="text-sm text-red-400/80">
                  Esta acción rechazará la solicitud de forma permanente.
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
             <label className="text-sm text-zinc-400 flex items-center gap-2">
               <FileText size={14} /> {isClient ? 'Motivo (Opcional)' : 'Motivo de rechazo (Opcional)'}
             </label>
             <select 
               className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500 outline-none text-zinc-300"
               value={cancelReason}
               onChange={(e) => setCancelReason(e.target.value)}
             >
               <option value="" disabled>Selecciona un motivo...</option>
               <option value="schedule_conflict">Conflicto de horario</option>
               <option value="sick">Enfermedad / Indisposición</option>
               <option value="emergency">Emergencia</option>
               <option value="other">Otro</option>
             </select>
          </div>

          <div className="flex gap-3 mt-4">
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={handleCloseModal}
              disabled={isCancelling}
            >
              Mantener
            </Button>
            <Button 
              variant="danger" 
              fullWidth 
              onClick={handleConfirmCancel}
              isLoading={isCancelling}
            >
              {isClient ? 'Sí, Cancelar' : 'Sí, Rechazar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
import express from 'express';
import cors from 'cors';
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data, mirrors frontend store mock data
const SERVICES = [
  { id: '1', name: 'Corte Clásico & Estilo', durationMinutes: 45, price: 1300 },
  { id: '2', name: 'Perfilado de Barba Spa', durationMinutes: 30, price: 700 },
  { id: '3', name: 'Coloración & Mechas', durationMinutes: 120, price: 2000 },
  { id: '4', name: 'Manicura Premium', durationMinutes: 40, price: 700 },
  { id: '5', name: 'Tratamiento Capilar Intensivo', durationMinutes: 60, price: 1500 },
  { id: '6', name: 'Peinado & Styling', durationMinutes: 50, price: 1200 },
  { id: '7', name: 'Limpieza & Depilación', durationMinutes: 45, price: 900 },
  { id: '8', name: 'Corte & Afeitado Barbero Clásico', durationMinutes: 40, price: 1100 }
];

const APPOINTMENTS = [
  {
    id: 'appt_1',
    clientId: 'c1', barberId: 'b1', serviceId: '1', date: dayjs().add(1, 'day').format('YYYY-MM-DD'), time: '10:00', status: 'CONFIRMED', clientName: 'Alex Cliente', serviceName: 'Corte Clásico & Estilo', price: 35, durationMinutes: 45
  },
  {
    id: 'appt_2',
    clientId: 'c1', barberId: 'b1', serviceId: '2', date: dayjs().add(2, 'day').format('YYYY-MM-DD'), time: '15:30', status: 'PENDING', clientName: 'Alex Cliente', serviceName: 'Perfilado de Barba Spa', price: 25, durationMinutes: 30
  }
];

// Helpers
const hhmmToDate = (dateISO, timeHHMM) => new Date(`${dateISO}T${timeHHMM}`);
const addMinutesToHHMM = (timeHHMM, minutes) => {
  const [hh, mm] = timeHHMM.split(':').map(Number);
  const d = new Date(); d.setHours(hh, mm, 0, 0); d.setTime(d.getTime() + minutes * 60000);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const timeOverlap = (sA, eA, sB, eB) => (sA < eB && sB < eA);

// Calculate availability - returns slots every 30min (or var), but ensures duration fits
app.get('/api/availability', (req, res) => {
  const { barberId, date, serviceId, slotInterval = 30, open = 9, close = 18 } = req.query;
  const duration = Number((SERVICES.find(s => s.id === serviceId) || {}).durationMinutes || slotInterval);
  const selectedDate = date || dayjs().format('YYYY-MM-DD');
  const slots = [];

  const current = new Date(`${selectedDate}T00:00`);
  current.setHours(Number(open), 0, 0, 0);
  const endTime = new Date(`${selectedDate}T00:00`);
  endTime.setHours(Number(close), 0, 0, 0);

  while (current < endTime) {
    const timeString = current.toTimeString().slice(0,5);
    const slotStart = new Date(current);
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);
    if (slotEnd > endTime) { current.setTime(current.getTime() + Number(slotInterval) * 60000); continue; }

    // check overlap with existing appointments for this barber on the date
    const taken = APPOINTMENTS.filter(a => a.barberId === barberId && a.date === selectedDate && a.status !== 'CANCELLED');
      let available = true;
    for (const a of taken) {
      const aStart = hhmmToDate(a.date, a.time);
      const aEnd = new Date(aStart.getTime() + (a.durationMinutes || slotInterval) * 60000);
      if (timeOverlap(slotStart, slotEnd, aStart, aEnd)) { available = false; break; }
    }
    slots.push({ time: timeString, available, meta: { slotEnd: slotEnd.toTimeString().slice(0,5) } });
    current.setTime(current.getTime() + Number(slotInterval) * 60000);
  }
  res.json({ slots });
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  const { clientId, barberId, serviceId, date, time, clientName } = req.body;
  const service = SERVICES.find(s => s.id === String(serviceId));
  const duration = service?.durationMinutes || 30;
  // check if fits (overlap) with existing
  const apptStart = hhmmToDate(date, time);
  const apptEnd = new Date(apptStart.getTime() + duration * 60000);

  const taken = APPOINTMENTS.filter(a => a.barberId === barberId && a.date === date && a.status !== 'CANCELLED');
  for (const a of taken) {
    const aStart = hhmmToDate(a.date, a.time);
    const aEnd = new Date(aStart.getTime() + (a.durationMinutes || 30) * 60000);
    if (timeOverlap(apptStart, apptEnd, aStart, aEnd)) {
      return res.status(409).json({ error: 'Slot no disponible (se solapa con otra cita)' });
    }
  }

  const newAppt = { id: 'appt_' + Date.now(), clientId, barberId, serviceId, date, time, clientName, serviceName: service?.name, status: 'PENDING', price: service?.price, durationMinutes: duration, endTime: addMinutesToHHMM(time, duration)};
  APPOINTMENTS.push(newAppt);
  res.json(newAppt);
});

// Cancel appointment: compute penalty and simulate charge
app.post('/api/appointments/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};
  const appt = APPOINTMENTS.find(a => a.id === id);
  if (!appt) return res.status(404).json({ error: 'Cita no encontrada' });
  if (appt.status === 'CANCELLED') return res.status(400).json({ error: 'Ya fue cancelada' });

  const now = new Date();
  const apptStart = hhmmToDate(appt.date, appt.time);
  const diffHours = (apptStart.getTime() - now.getTime()) / (1000*60*60);

  let penalty = 0;
  const penaltyWindow = 24; // default 24h - should be constant
  const penaltyAmount = 10; // demo
  if (diffHours <= penaltyWindow) penalty = penaltyAmount;

  // Simulate charge (always success in demo)
  const charged = penalty > 0 ? true : false;

  appt.status = 'CANCELLED';
  appt.cancelReason = reason || null;
  appt.cancelledAt = new Date().toISOString();
  if (penalty > 0) { appt.cancellationFee = penalty; appt.cancellationFeeCharged = charged; }

  res.json({ success: true, penalty, charged, appt });
});

app.get('/api/appointments', (req, res) => {
  const { barberId, clientId } = req.query;
  let result = APPOINTMENTS;
  if (barberId) result = result.filter(a => a.barberId === barberId);
  if (clientId) result = result.filter(a => a.clientId === clientId);
  res.json(result);
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

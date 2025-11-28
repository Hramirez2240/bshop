import React from 'react';
import { useAppStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ServicesList: React.FC = () => {
  const services = useAppStore(state => state.services);

  const barberia = services.filter(s => s.category === 'BARBERIA');
  const belleza = services.filter(s => s.category === 'BELLEZA');

  const renderCard = (service: any) => (
    <Card key={service.id} className="p-5 hover:bg-zinc-800/40 transition">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-lg">{service.name}</h4>
        <span className="text-gold-500 font-bold">${service.price}</span>
      </div>
      <p className="text-sm text-zinc-400 mb-3">{service.description}</p>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Clock size={14} /> {service.durationMinutes} min
      </div>
      <div className="mt-4 flex justify-end">
        {useAppStore.getState().currentUser?.role === 'BARBER' && (
          <Button variant="danger" size="sm" onClick={() => {
            const ok = window.confirm(`Eliminar servicio \"${service.name}\"?`);
            if (!ok) return;
            useAppStore.getState().removeService(service.id);
          }}>Eliminar</Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {barberia.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Barbería</h2>
          <div className="grid gap-4 md:grid-cols-2">{barberia.map(renderCard)}</div>
        </section>
      )}

      {belleza.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Belleza</h2>
          <div className="grid gap-4 md:grid-cols-2">{belleza.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
};

export default ServicesList;

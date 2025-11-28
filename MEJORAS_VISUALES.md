# Mejoras Visuales para BookingFlow y Dashboard

## BookingFlow - Agregar Imágenes a los Servicios

Para agregar imágenes a las tarjetas de servicios en el BookingFlow, reemplaza la función `renderServiceStep` (líneas 90-110) con este código:

```typescript
const renderServiceStep = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {services.map((service) => (
      <Card 
        key={service.id} 
        onClick={() => { setSelectedService(service.id); setCurrentStep(1); }}
        className={`overflow-hidden transition-all cursor-pointer ${selectedService === service.id ? 'ring-2 ring-gold-500 bg-zinc-800' : 'hover:bg-zinc-800/50 hover:scale-[1.02]'}`}
      >
        {service.imageUrl && (
          <div className="relative h-40 w-full overflow-hidden">
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
            <div className="absolute top-3 right-3 bg-gold-500 text-zinc-950 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ${service.price}
            </div>
          </div>
        )}
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{service.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-zinc-500 bg-zinc-900/50 py-1 px-2 rounded">
              <Clock size={12} className="mr-1" />
              {service.durationMinutes} min
            </div>
            {selectedService === service.id && (
              <CheckCircle size={20} className="text-gold-500" />
            )}
          </div>
        </div>
      </Card>
    ))}
  </div>
);
```

### Cambios Realizados:
1. ✅ Agregado `overflow-hidden` al Card para que las imágenes no se salgan
2. ✅ Agregado efecto hover `hover:scale-[1.02]` para mejor interacción
3. ✅ Condicional para mostrar imagen solo si `service.imageUrl` existe
4. ✅ Imagen con altura fija de 160px (h-40)
5. ✅ Gradiente oscuro sobre la imagen para mejor legibilidad
6. ✅ Precio mostrado como badge dorado en la esquina superior derecha de la imagen
7. ✅ Icono de check cuando el servicio está seleccionado
8. ✅ Descripción con `line-clamp-2` para limitar a 2 líneas

---

## Dashboard - Agregar Imágenes a las Citas

El Dashboard ya está bien diseñado con iconos y colores. Para mejorarlo aún más, puedes agregar las imágenes de los servicios en las tarjetas de citas.

### Modificar AppointmentCard (líneas 124-161)

Agrega este código después de la línea 143 (después del div con la fecha y hora):

```typescript
{/* Service Image Preview - Solo si hay imagen */}
{appt.serviceName && (
  <div className="relative h-24 w-full overflow-hidden rounded-lg mt-2">
    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
      <Scissors size={32} className="text-zinc-700" />
    </div>
    <div className="absolute bottom-2 left-2 bg-zinc-950/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-gold-500 font-semibold">
      {appt.serviceName}
    </div>
  </div>
)}
```

---

## Resultado Final

### BookingFlow con Imágenes:
- Tarjetas de servicio más atractivas con imágenes
- Precio destacado en badge dorado
- Efecto hover para mejor UX
- Indicador visual de selección

### Dashboard Mejorado:
- Mantiene el diseño actual que ya funciona bien
- Opcionalmente puede agregar preview de servicio
- Colores y estados bien diferenciados

---

## Instrucciones de Implementación

1. **Para BookingFlow**: 
   - Abre `features/booking/BookingFlow.tsx`
   - Localiza la función `renderServiceStep` (línea 90)
   - Reemplaza todo el contenido de la función con el código proporcionado arriba

2. **Para Dashboard** (Opcional):
   - Abre `features/dashboard/Dashboard.tsx`
   - Localiza el componente `AppointmentCard` (línea 124)
   - Agrega el código del preview de imagen después de la sección de fecha/hora

3. **Guarda los archivos** y el servidor de desarrollo recargará automáticamente

---

## Notas Importantes

- Las imágenes ya están configuradas en el store para todos los servicios
- Los primeros 2 servicios usan imágenes generadas custom
- Los servicios 3-8 usan placeholders de Unsplash
- Todas las imágenes se cargarán automáticamente desde las URLs configuradas

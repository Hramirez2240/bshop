# BShop Server (Demo)

Este servidor demo implementa la lógica de disponibilidad y la creación/cancelación de citas en backend para garantizar integridad de reglas.

Endpoints:
- GET /api/availability?barberId=...&date=YYYY-MM-DD&serviceId=...&slotInterval=30
- POST /api/appointments - body: { clientId, barberId, serviceId, date, time, clientName }
- POST /api/appointments/:id/cancel - body: { reason }
- GET /api/appointments?barberId&clientId

Run:

```
cd server
npm install
npm run start
```

La demo usa almacenamiento en memoria (no persistente). No es apta para producción; se recomienda integrarlo con un DB y un procesador de pagos.

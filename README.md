# 💇 BShop - Premium Booking System

**BShop** es una aplicación de reservas premium para salones de belleza y barberías. Conecta a clientes con estilistas profesionales, permitiendo un sistema de booking intuitivo, gestión de citas en tiempo real y una experiencia de usuario excepcional.

---

## ⚡ Inicio Rápido

¿Solo quieres ejecutar el proyecto? Aquí está el camino más corto:

```bash
# 1. Clonar
git clone https://github.com/Hramirez2240/bshop.git && cd bshop

# 2. Instalar
npm install

# 3. Ejecutar
npm run dev

# 4. Abrir navegador
# http://localhost:3000
```

**Credenciales de prueba:**
- 👤 Cliente: `alex@cliente.com`
- 💇 Estilista: `marco@bshop.com`

---

## ✨ Características Principales

### 🔐 Autenticación y Roles
- **Sistema de login/registro** con dos roles de usuario:
  - **Cliente**: Reserva servicios y gestiona sus citas
  - **Estilista**: Gestiona solicitudes de reservas y su agenda
- Protección de rutas con autenticación requerida
- Cuentas demo pre-cargadas para pruebas

### 📅 Sistema de Reservas Avanzado
- **Flujo de 4 pasos intuitivo**:
  1. Selección de servicio con detalles (duración y precio)
  2. Selección del estilista profesional
  3. Elección de fecha (14 días disponibles) y hora
  4. Resumen y confirmación de la cita
- **Gestión de horarios en tiempo real**:
  - Vista de disponibilidad de estilistas
  - Filtrado automático de horarios ocupados
  - Configuración flexible de horarios de atención (9:00 AM - 6:00 PM)

### 📊 Dashboard Personalizado
- **Vistas diferenciadas por rol**:
  - **Clientes**: Ven sus citas, estado de solicitudes pendientes, historial de citas
  - **Estilistas**: Gestionan solicitudes de reservas, confirman/rechazan citas, ven su agenda
  
- **Estados de citas**:
  - 🕐 **Pendiente**: Aguardando confirmación del estilista (o cliente esperando respuesta)
  - ✅ **Confirmada**: Cita confirmada y en calendario
  - ❌ **Cancelada**: Cita cancelada
  - ✔️ **Completada**: Cita finalizada

- **Organización por secciones**:
  - Solicitudes pendientes (requieren acción)
  - Próximas citas confirmadas
  - Historial de citas pasadas

### 🎨 Servicios y Profesionales
- Catálogo de servicios con:
  - Nombre, descripción, duración y precio
  - Visualización clara del tiempo estimado
- Perfil de estilistas con avatar e información profesional

### 🔔 Sistema de Notificaciones
- Toast notifications para feedback en tiempo real
- Confirmaciones de acciones críticas
- Alertas de estado de citas

---

## 🛠️ Stack Tecnológico

- **Frontend Framework**: React 19.2.0
- **Lenguaje**: TypeScript 5.8
- **Build Tool**: Vite 6.2.0
- **Enrutamiento**: React Router DOM 7.9.6
- **State Management**: Zustand 5.0.8
- **Manejo de Fechas**: date-fns 4.1.0
- **Iconos**: Lucide React 0.554.0
- **Estilos**: Tailwind CSS (configurado en el proyecto)

---

## 🚀 Instalación y Configuración

### Requisitos previos
- Node.js 16+
- npm o yarn
- Git (para clonar el repositorio)

### Pasos de instalación

#### 1️⃣ Clonar el repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/Hramirez2240/bshop.git

# Entrar al directorio del proyecto
cd bshop
```

#### 2️⃣ Instalar dependencias

```bash
# Instalar todas las dependencias del proyecto
npm install
```

#### 3️⃣ Ejecutar el servidor de desarrollo

```bash
# Iniciar Vite en modo desarrollo con hot reload
npm run dev
```

#### 4️⃣ Abrir en el navegador

El servidor estará disponible en:
- **Local**: http://localhost:3000
- **Network**: http://10.0.0.103:3000 (disponible en otros dispositivos de la red)

La aplicación debería abrir automáticamente en tu navegador predeterminado.

### Construcción para producción

```bash
# Compilar la aplicación para producción
npm run build

# Previsualizar la build de producción localmente
npm run preview
```

---

## 📝 Scripts Disponibles

Una vez que hayas instalado las dependencias, puedes usar los siguientes comandos:

```bash
# Desarrollo con HMR (Hot Module Replacement)
# Inicia el servidor local en http://localhost:3000
npm run dev

# Construir para producción
# Genera una versión optimizada en la carpeta dist/
npm run build

# Previsualizar build de producción
# Sirve la versión de producción localmente para probar
npm run preview
```

### Detalles de cada comando:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática en cambios |
| `npm run build` | Compila el proyecto para producción, optimizando código y assets |
| `npm run preview` | Sirve localmente la versión compilada para verificar antes de desplegar |

---

## 📁 Estructura del Proyecto

```
bshop/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   └── LoginForm.tsx          # Formulario de login/registro
│   │   ├── booking/
│   │   │   └── BookingFlow.tsx        # Flujo de 4 pasos para reservas
│   │   └── dashboard/
│   │       └── Dashboard.tsx          # Panel de control por rol
│   ├── components/
│   │   ├── Layout.tsx                 # Layout principal
│   │   ├── Toaster.tsx                # Sistema de notificaciones
│   │   └── ui/
│   │       ├── Button.tsx             # Componente botón reutilizable
│   │       ├── Card.tsx               # Componente tarjeta
│   │       └── Modal.tsx              # Componente modal
│   ├── App.tsx                        # Configuración de rutas
│   ├── store.ts                       # Zustand store (estado global)
│   ├── types.ts                       # Definiciones de TypeScript
│   ├── constants.ts                   # Constantes de la aplicación
│   └── index.tsx                      # Punto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 💾 Gestión de Estado (Zustand)

La aplicación utiliza **Zustand** para manejo centralizado de estado:

- **Autenticación**: Usuario actual, login/logout, registro
- **Datos de negocio**: Servicios, estilistas, citas
- **Operaciones**: CRUD de citas, cambio de estados
- **UI**: Notificaciones (toast messages)

---

## 🔄 Flujos Principales

### Flujo de Cliente
1. **Login** → Ingresa con email (demo: alex@cliente.com)
2. **Reservar** → Accede a BookingFlow de 4 pasos
3. **Dashboard** → Ve citas pendientes, confirmadas e historial
4. **Gestión** → Puede cancelar solicitudes o citas

### Flujo de Estilista
1. **Login** → Ingresa con email (demo: marco@bshop.com)
2. **Dashboard** → Ve solicitudes pendientes de clientes
3. **Acciones** → Confirma o rechaza solicitudes
4. **Gestión** → Visualiza su agenda y citas confirmadas

---

## ⚙️ Configuración

### Horarios de Atención
Definidos en `src/constants.ts`:
- Hora de apertura: 9:00 AM
- Hora de cierre: 6:00 PM
- Intervalo de slots: 30 minutos

### Datos de Demostración
Cuentas pre-cargadas disponibles:
- **Cliente**: alex@cliente.com
- **Estilista**: marco@bshop.com

---

## 🎯 Casos de Uso

### Para Clientes
✅ Reservar servicios de belleza  
✅ Elegir profesional de su preferencia  
✅ Ver disponibilidad en tiempo real  
✅ Cancelar o modificar citas  
✅ Historial de servicios  

### Para Estilistas
✅ Recibir solicitudes de clientes  
✅ Confirmar o rechazar reservas  
✅ Gestionar su agenda diaria  
✅ Ver historial de clientes  
✅ Mantener calendario organizado  

---

## 🚨 Validaciones y Seguridad

- ✅ Rutas protegidas (requieren autenticación)
- ✅ Validación de disponibilidad de horarios
- ✅ Prevención de doble booking
- ✅ Estilistas no pueden reservar servicios
- ✅ Confirmación de acciones críticas (cancelaciones)
- ✅ Separación de permisos por rol

---

## 🎨 Diseño y UX

- **Interfaz Dark Mode Premium**: Colores oro, zinc y negros
- **Animaciones suaves**: Transiciones y fade-ins
- **Responsive**: Optimizado para móvil, tablet y desktop
- **Accesibilidad**: Iconos intuitivos, contraste adecuado
- **Barra de progreso**: Visual claro del flujo de reserva

---

## 📱 Ejemplos de Prueba

### Crear una Reserva (Cliente)
```
1. Login: alex@cliente.com → Dashboard
2. Clic en "Reservar Ahora" → BookingFlow
3. Seleccionar "Corte Clásico" → Siguiente
4. Seleccionar "Marco" → Siguiente
5. Elegir fecha y hora disponible → Siguiente
6. Revisar y confirmar → "Enviar Solicitud de Reserva"
7. Ver solicitud en Dashboard (Pendiente de confirmación)
```

### Confirmar Reserva (Estilista)
```
1. Login: marco@bshop.com → Dashboard
2. Ver "Solicitudes Requieren Acción"
3. Clic en "Aprobar" → Cita confirmada
4. Cita aparece en "Próximas Citas Confirmadas"
```

---

## 🐛 Solución de Problemas

### Problemas durante la instalación

| Problema | Causa | Solución |
|----------|-------|----------|
| `npm: command not found` | Node.js no está instalado | Instala Node.js desde [nodejs.org](https://nodejs.org) |
| `Error: Cannot find module` | Las dependencias no están instaladas | Ejecuta `npm install` |
| Puerto 3000 ya en uso | Otro proceso usa el puerto | Cambia el puerto en `vite.config.ts` o cierra la app que usa el puerto |

### Problemas durante la ejecución

| Problema | Causa | Solución |
|----------|-------|----------|
| Pantalla en blanco | Vite no compiló correctamente | Recarga la página (F5) o reinicia con `npm run dev` |
| Estilos no cargan | CSS no se procesó | Limpia caché: `rm -rf node_modules/.vite` y reinicia |
| Login no funciona | Usuario no existe en almacenamiento | Usa las credenciales demo: `alex@cliente.com` |
| Rutas protegidas no funcionan | Estado de autenticación perdido | Verifica que estés autenticado antes de acceder a `/dashboard` o `/booking` |

### Limpiar caché y reinstalar

Si algo no funciona después de actualizar el código:

```bash
# Limpiar completamente
rm -rf node_modules package-lock.json .vite

# Reinstalar
npm install

# Ejecutar de nuevo
npm run dev
```

---

## 🐛 Problemas Comunes

### Rutas protegidas no funcionan
- **Verificar que `isAuthenticated` esté en true en el store**
- Usa las credenciales demo para probar

### Horarios no aparecen
- Revisar que el estilista tenga horarios disponibles
- Los horarios varían según la fecha seleccionada

### Notificaciones no se ven
- Asegurar que `<Toaster />` esté en `App.tsx`
- Verifica que el puerto 3000 esté disponible

### Datos no se guardan
- Zustand almacena en memoria durante la sesión
- Los datos persisten en localStorage (revisar `store.ts`)
- Recarga la página para probar la persistencia

---

## 💻 Desarrollo

### Estructura de directorios

```
bshop/
├── src/
│   ├── features/              # Features organizadas por dominio
│   │   ├── auth/              # Autenticación y login
│   │   ├── booking/           # Flujo de reservas
│   │   └── dashboard/         # Panel de control
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/                # Componentes base (Button, Card, Modal)
│   │   ├── Layout.tsx         # Layout principal con navegación
│   │   └── Toaster.tsx        # Sistema de notificaciones
│   ├── App.tsx                # Configuración de rutas
│   ├── store.ts               # Estado global con Zustand
│   ├── types.ts               # Tipos TypeScript
│   ├── constants.ts           # Constantes de la app
│   └── index.tsx              # Punto de entrada
├── config files
│   ├── vite.config.ts         # Configuración de Vite
│   ├── tailwind.config.js     # Configuración de Tailwind CSS
│   ├── postcss.config.js      # PostCSS con Tailwind
│   └── tsconfig.json          # Configuración de TypeScript
├── index.html                 # HTML principal
├── index.css                  # Estilos globales
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

### Variables de entorno

No hay variables de entorno requeridas para el desarrollo básico. Si necesitas añadir variables:

```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Luego añade tus variables y úsalas en el código:

```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

### Agregar nuevas características

**1. Crear un nuevo componente:**

```typescript
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

**2. Agregar al estado global (store.ts):**

```typescript
interface AppState {
  // ... existing state
  myNewData: string;
  setMyNewData: (data: string) => void;
}

// En el create()
myNewData: '',
setMyNewData: (data) => set({ myNewData: data }),
```

**3. Usarlo en componentes:**

```typescript
const { myNewData, setMyNewData } = useAppStore();
```

### Testing

Para añadir pruebas unitarias:

```bash
npm install -D vitest @testing-library/react
```

---

---

## 📞 Soporte y Contribuciones

### ¿Encontraste un bug?

1. Verifica que no esté reportado en [Issues](https://github.com/Hramirez2240/bshop/issues)
2. Abre un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Navegador y versión de Node.js
   - Screenshots si es relevante

### ¿Quieres contribuir?

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/AmazingFeature`
3. Haz commit de tus cambios: `git commit -m 'Add AmazingFeature'`
4. Push a la rama: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

### Contacto

- 📧 Email: hramirez@unicaribe.edu.do
- 💼 GitHub: [@Hramirez2240](https://github.com/Hramirez2240)

---

**Versión**: 0.0.0  
**Última actualización**: Noviembre 21, 2025  
**Licencia**: Privada - BShop © 2025  
**Autor**: Héctor Ramírez

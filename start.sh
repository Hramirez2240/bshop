#!/bin/bash

# Script para iniciar BShop (Frontend + Backend)
# Uso: ./start.sh

echo "🚀 Iniciando BShop..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${YELLOW}📡 Iniciando servidor backend...${NC}"
node server/index.js &
BACKEND_PID=$!

# Esperar un momento para que el backend inicie
sleep 2

# Verificar si el backend está corriendo
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Backend corriendo en http://localhost:3333${NC}"
else
    echo "❌ Error al iniciar el backend"
    exit 1
fi

# Iniciar frontend
echo -e "${YELLOW}🎨 Iniciando servidor frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

# Esperar un momento para que el frontend inicie
sleep 3

if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend corriendo en http://localhost:3000${NC}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  💇 BShop está listo!"
    echo "  🌐 Abre: http://localhost:3000"
    echo "  📧 Cliente: alex@cliente.com"
    echo "  💈 Estilista: marco@bshop.com"
    echo ""
    echo "  Presiona Ctrl+C para detener ambos servidores"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Error al iniciar el frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Mantener el script corriendo
wait

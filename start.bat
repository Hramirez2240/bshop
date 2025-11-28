@echo off
REM Script para iniciar BShop en Windows (Frontend + Backend)
REM Uso: start.bat

echo 🚀 Iniciando BShop...
echo.

REM Iniciar backend en una nueva ventana
echo 📡 Iniciando servidor backend...
start "BShop Backend" cmd /k "node server/index.js"

REM Esperar 2 segundos
timeout /t 2 /nobreak >nul

REM Iniciar frontend
echo 🎨 Iniciando servidor frontend...
start "BShop Frontend" cmd /k "npm run dev"

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   💇 BShop está iniciando...
echo   🌐 Frontend: http://localhost:3000
echo   📡 Backend: http://localhost:3333
echo   📧 Cliente: alex@cliente.com
echo   💈 Estilista: marco@bshop.com
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

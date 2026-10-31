@echo off
title Kilimanjaro - Sistema de reservas
cd /d "%~dp0"
echo ==============================================
echo    Restaurante Kilimanjaro - Sistema de reservas
echo ==============================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js.
  echo Instala la version LTS desde https://nodejs.org y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do set NODEV=%%v
echo Node.js encontrado: %NODEV%
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit((a===20&&b>=19)||(a===22&&b>=12)||a>22?0:1)"
if errorlevel 1 (
  echo [ERROR] Tu Node.js es muy antiguo. Se necesita 20.19 o superior.
  echo Instala la version LTS desde https://nodejs.org y vuelve a abrir este archivo.
  echo.
  pause
  exit /b 1
)
if not exist "node_modules\vite" (
  echo.
  echo Instalando dependencias, solo la primera vez. Espera un momento...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Fallo npm install. Revisa tu conexion a internet.
    pause
    exit /b 1
  )
)
echo.
echo Iniciando el sistema... se abrira el navegador.
echo NO cierres esta ventana mientras uses el sistema.
echo.
call npm run dev
pause

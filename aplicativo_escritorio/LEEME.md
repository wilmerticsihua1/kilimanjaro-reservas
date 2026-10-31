# Aplicativo de escritorio (Kilimanjaro.exe)

Programa de Windows que incluye todo el sistema y lo abre en su propia ventana
(usa Microsoft Edge en modo aplicación, que viene instalado en Windows 10/11).

## Cómo generarlo de nuevo (opcional, necesita Go 1.24+)
1. En la carpeta del proyecto: `npm run build`
2. Copiar la carpeta `dist` dentro de `aplicativo_escritorio`
3. En `aplicativo_escritorio`:
   `GOOS=windows GOARCH=amd64 go build -ldflags="-s -w -H windowsgui" -o Kilimanjaro.exe .`

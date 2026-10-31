# Restaurante Kilimanjaro – Sistema de reservas

## Cómo ejecutar
1. Instalar Node.js (versión LTS) desde https://nodejs.org
2. Abrir una terminal en esta carpeta
3. `npm install`
4. `npm run dev`
5. Abrir http://localhost:3000

## Tipos de usuario
| Usuario | Correo | Contraseña | Qué puede hacer |
|---|---|---|---|
| Visitante | (sin cuenta) | — | Ver la web, el menú y qué mesas están libres u ocupadas |
| Cliente | cliente@kilimanjaro.com | cliente123 | Registrar reservas (sus datos se completan solos) y ver "Mis reservas" |
| Administrador | admin@kilimanjaro.com | admin123 | Panel Administrativo: gestionar reservas, platos, mesas y reportes |

Los clientes también pueden crear su propia cuenta en **Iniciar sesión → Crear cuenta**.

## Web pública (con header y footer)
- `/` Inicio · `/menu` Menú (con fotos) · `/nosotros` · `/servicios` · `/contacto`
- `/reservar` Mesas del día y hora elegidos: **libres** (blanco) y **ocupadas** (verde).
  Al presionar "Reservar" se pide iniciar sesión; luego aparece el formulario con los datos del cliente.
- `/ingresar` Login y registro de clientes · `/mis-reservas` Reservas del cliente · `/mi-reserva` Consulta por código
- El cliente NO puede editar ni eliminar reservas.

## Panel Administrativo (modelo SB Admin, sin header ni footer de la web)
- `/login` Login del administrador
- `/panel` Dashboard
- `/panel/reservas` Gestionar reservas (confirmar / rechazar solicitudes, registrar, editar, cancelar, eliminar)
- `/panel/platos` Gestionar platos (agregar, editar, foto, ocultar, eliminar → se refleja en el Menú)
- `/panel/mesas` Gestionar mesas · `/panel/reporte01` y `/panel/reporte02` Reportes · buscador por cliente, código o plato

Los datos se guardan en el navegador (localStorage).

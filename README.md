# MesaFácil — Gestión de reservas para restaurantes

Aplicación web **prototipada y funcional** desarrollada con **React + Vite** que permite a un restaurante **registrar reservas de mesas de forma centralizada**, **evitar duplicaciones y conflictos de horario**, y **visualizar la ocupación en un calendario interactivo**. Diseñada con enfoque *mobile-first* y accesible desde escritorio.

> Proyecto del curso — trabajo grupal (3 integrantes).

---

## 1. Problema que resuelve

Los restaurantes gestionan reservas por teléfono o en persona, lo que provoca:

- **Duplicaciones** de reservas para la misma mesa/hora.
- **Conflictos de horario** y desorganización en horas de alta demanda.
- Mala experiencia del cliente por falta de confirmación en tiempo real.

MesaFácil centraliza la operación y **valida automáticamente** los solapamientos antes de confirmar una reserva.

## 2. Funcionalidades principales

| Funcionalidad | Descripción |
|---|---|
| **Calendario interactivo** | Franja de 7 días y rejilla de horarios (almuerzo y cena) con conteo de reservas por franja. Las franjas en alta demanda se marcan como *llenas*. |
| **Formulario de reserva** | Captura cliente, teléfono, personas, fecha, hora y notas. Valida campos obligatorios y formato de teléfono. |
| **Detección de duplicados** | Bloquea reservas repetidas (mismo nombre + teléfono + fecha + hora). |
| **Detección de conflictos** | Bloquea el solapamiento de horarios por mesa (duración estándar de 90 min). |
| **Sugerencia de mesas** | Solo ofrece mesas libres cuya capacidad alcanza el número de personas. |
| **Gestión de estados** | Confirmada → En mesa → Finalizada / Cancelada, con edición y eliminación. |
| **Persistencia local** | Los datos se conservan en `localStorage`; botón para restaurar datos de prueba. |
| **Diseño responsivo** | Layout adaptable a móvil y escritorio con estados de foco visibles. |

## 3. Tecnologías

- **React 19** (componentes en **JSX** reutilizables)
- **Vite** (entorno de desarrollo y build)
- **Hooks**: `useState` (estado de reservas y formulario) y `useEffect` (persistencia en `localStorage` y avisos temporales)
- CSS3 (variables, grid, flexbox)

## 4. Estructura del proyecto

```
reservas_restaurante/
├── index.html
├── package.json
└── src/
    ├── main.jsx                     # Punto de entrada
    ├── App.jsx                      # Composición y estado de la vista
    ├── index.css / App.css          # Estilos globales y de componentes
    ├── components/
    │   ├── Header.jsx               # Encabezado + pestañas + resumen
    │   ├── CalendarView.jsx         # Calendario interactivo de disponibilidad
    │   ├── ReservationForm.jsx      # Formulario reutilizable de reserva
    │   └── ReservationList.jsx      # Listado y gestión de reservas
    ├── hooks/
    │   └── useReservations.js       # Hook: CRUD + validaciones + persistencia
    └── data/
        ├── reservationLogic.js      # Reglas de negocio (conflictos, duplicados)
        └── seed.js                  # Datos de prueba
```

## 5. Configuración del entorno de desarrollo

### Requisitos previos

- **Node.js 18+** (recomendado 20+)
- **npm** (incluido con Node.js)

Verificar:

```bash
node --version
npm --version
```

### Instalación

```bash
git clone <URL-del-repositorio>
cd reservas_restaurante
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Abrir la URL que muestra la consola (por defecto `http://localhost:5173`).

### Compilar para producción

```bash
npm run build
npm run preview
```

### Calidad de código

```bash
npm run lint       # oxlint: 0 errores
```

## 6. Cómo probar la aplicación

1. En el **calendario**, haz clic en cualquier **horario libre** (ej. 19:00). El formulario se completa con esa fecha y hora.
2. Ingresa **nombre** y **teléfono** válidos, elige el número de **personas** y una **mesa** sugerida.
3. Pulsa **Confirmar reserva** → aparece un aviso de éxito y la reserva en el listado.
4. **Prueba de duplicado**: repite la misma reserva (mismo nombre, teléfono, fecha y hora) → el sistema lo **bloquea** con un mensaje.
5. **Prueba de conflicto**: crea otra reserva a la misma hora para la **misma mesa** con otro teléfono → el sistema **no ofrece** esa mesa o **bloquea** el solapamiento.
6. En **Mis reservas**, gestiona estados: *A sentar*, *Finalizar*, *Cancelar*, *Editar* o *Eliminar*.
7. Usa **Restaurar datos de prueba** para volver al estado inicial.

### Casos de prueba sugeridos

| # | Caso | Resultado esperado |
|---|------|--------------------|
| 1 | Reserva válida | Se confirma y aparece en el listado |
| 2 | Mismo nombre/teléfono/fecha/hora | Mensaje de duplicado, no se guarda |
| 3 | Misma mesa, misma hora, distinto cliente | Mesa no disponible / conflicto bloqueado |
| 4 | Capacidad insuficiente | No se ofrecen mesas para ese nº de personas |
| 5 | Horario con 4 reservas | Franja marcada como *Alta demanda* y deshabilitada |
| 6 | Cambiar estado a *En mesa* | Badge y color actualizados |
| 7 | Recargar la página | Las reservas persisten (`localStorage`) |

## 7. Accesibilidad y usabilidad

- Etiquetas (`label`) asociadas a cada campo y `aria-invalid` en entradas con error.
- Mensajes de error con `role="alert"` y avisos con `role="status"`.
- Navegación por teclado con `:focus-visible` visible.
- Botones de horario llenos con `disabled` (no accionables).
- Contraste de color y tamaños táctiles adecuados para móvil.

## 8. Enlaces del entregable

- **Prototipo interactivo (Figma):** _pendiente de reemplazar por el enlace del grupo_
- **Repositorio GitHub:** _pendiente de reemplazar por la URL del repositorio_
- **Informe de pruebas de usabilidad:** `docs/PRUEBAS_USABILIDAD.md`

## 9. Integrantes

- Integrante 1 — _nombre_
- Integrante 2 — _nombre_
- Integrante 3 — _nombre_

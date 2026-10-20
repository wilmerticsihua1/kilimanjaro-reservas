# Informe de pruebas de usabilidad — MesaFácil

**Proyecto:** Aplicación web de gestión de reservas para restaurantes
**Metodología:** pruebas con usuarios simulados (5 participantes: 2 administradores y 3 clientes)
**Modalidad:** grupal (3 integrantes)

---

## 1. Objetivo

Validar que la aplicación permite **crear reservas sin duplicaciones ni conflictos de horario**, evaluar la **claridad de la navegación** y detectar problemas de usabilidad en móvil y escritorio.

## 2. Tareas evaluadas

1. Crear una reserva desde el calendario.
2. Verificar la disponibilidad de un horario de alta demanda.
3. Repetir una reserva existente (prueba de duplicado).
4. Reservar la misma mesa a la misma hora con otro cliente (prueba de conflicto).
5. Cambiar el estado de una reserva (en mesa → finalizada).
6. Editar y cancelar una reserva.

## 3. Métricas

- **Tasa de éxito por tarea** (objetivo ≥ 90 %)
- **Tiempo medio por tarea**
- **Errores cometidos** y su causa
- **Satisfacción (escala 1–5)**

## 4. Resultados (iteración 1)

| Tarea | Éxito | Tiempo medio | Problema observado |
|---|---|---|---|
| Crear reserva | 100 % | 48 s | Ninguno |
| Ver disponibilidad | 100 % | 20 s | La franja llena no indicaba bien el motivo |
| Prueba de duplicado | 80 % | 35 s | El mensaje de error aparecía lejos del formulario en móvil |
| Prueba de conflicto | 80 % | 40 s | La mesa ocupada seguía mostrándose como opción |
| Cambiar estado | 100 % | 15 s | Ninguno |
| Editar/cancelar | 100 % | 30 s | Botones muy juntos en móvil |

**Satisfacción media:** 4.1 / 5

## 5. Problemas detectados y soluciones implementadas

| # | Problema | Solución implementada |
|---|---|---|
| 1 | No se entendía por qué una franja estaba bloqueada | La franja muestra la etiqueta **"Alta demanda"** y el conteo de reservas. |
| 2 | El error de duplicado no era visible en móvil | El aviso de error ahora aparece **dentro del formulario** con `role="alert"`, y el diseño apila el formulario arriba en pantallas pequeñas (`order: -1`). |
| 3 | Se podía elegir una mesa ya ocupada | El formulario **solo lista mesas libres** para la fecha/hora/capacidad, y **re-valida conflictos** antes de guardar. |
| 4 | Mensajes de error poco claros | Validación campo por campo con textos específicos (nombre, teléfono, fecha, hora, capacidad). |
| 5 | Botones de acción muy juntos en móvil | Separación con *grid/flex* y estilos `small`; acciones se alinean a la derecha en pantallas < 520 px. |
| 6 | Confusión al confirmar una reserva | Se añadió un **aviso de éxito (toast)** con nombre, mesa y hora. |

## 6. Mejoras de usabilidad destacadas

- **Prevención de errores** antes que corrección (mesas libres sugeridas, franjas bloqueadas).
- **Retroalimentación inmediata** (toast, badges de estado, conteos).
- **Consistencia visual** mediante componentes reutilizables (tarjetas, botones, badges).
- **Accesibilidad**: labels asociados, `aria-invalid`, foco visible, contraste adecuado.

## 7. Conclusión

Tras la iteración 1, la tasa de éxito en tareas críticas alcanzó **100 %** y la satisfacción subió a **4.6 / 5** en la revalidación. La validación automática de duplicados y conflictos redujo a cero los casos de reservas simultáneas sobre la misma mesa durante las pruebas.

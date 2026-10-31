export const HOURS = [
  '12:00', '12:30', '13:00',
  '19:00', '19:30', '20:00',
];

// Tiempo que el cliente puede ocupar la mesa
export const DURATION_MINUTES = 120;

// Tiempo para limpiar y preparar la mesa
export const CLEANING_MINUTES = 15;

export const tables = [
  { id: 1, capacity: 2, zone: 'Interior' },
  { id: 2, capacity: 2, zone: 'Ventana' },
  { id: 3, capacity: 4, zone: 'Interior' },
  { id: 4, capacity: 4, zone: 'Ventana' },
  { id: 5, capacity: 4, zone: 'Terraza' },
  { id: 6, capacity: 6, zone: 'Terraza' },
  { id: 7, capacity: 6, zone: 'Interior' },
  { id: 8, capacity: 8, zone: 'Salón privado' },
]

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const addMinutes = (hhmm, minutes) => {
  const total = toMinutes(hhmm) + minutes
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const intervalsOverlap = (startA, endA, startB, endB) => {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA)
}

export const findConflict = (
  reservations,
  { date, time, tableId, duration = DURATION_MINUTES },
  excludeId = null
) => {
  const startA = toMinutes(time);
  const endA = startA + duration + CLEANING_MINUTES;

  return reservations.find((r) => {
    if (
      r.id === excludeId ||
      r.status === 'cancelled' ||
      r.date !== date ||
      Number(r.tableId) !== Number(tableId)
    ) {
      return false;
    }

    const startB = toMinutes(r.time);
    const endB =
      startB + (r.duration ?? DURATION_MINUTES) + CLEANING_MINUTES;

    return startA < endB && startB < endA;
  });
};

export const isDuplicate = (reservations, draft, excludeId = null) => {
  const name = draft.clientName.trim().toLowerCase()
  const phone = draft.clientPhone.trim()
  return reservations.some(
    (r) =>
      r.id !== excludeId &&
      r.status !== 'cancelled' &&
      r.date === draft.date &&
      r.time === draft.time &&
      r.clientPhone.trim() === phone &&
      r.clientName.trim().toLowerCase() === name
  )
}

export const availableTables = (reservations, date, time, duration = DURATION_MINUTES, guests = 1, excludeId = null, mesas = tables) => {
  return mesas.filter(
    (t) =>
      t.capacity >= guests && !findConflict(reservations, { date, time, tableId: t.id, duration }, excludeId)
  )
}

export const formatDateLong = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const todayISO = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export const nextDays = (count = 7) => {
  const base = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    const pad = (n) => String(n).padStart(2, '0')
    return {
      iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      day: d.toLocaleDateString('es-PE', { weekday: 'short' }),
      num: d.getDate(),
    }
  })
}

export const statusLabel = { pending: 'Pendiente', confirmed: 'Confirmada', seated: 'En mesa', cancelled: 'Cancelada', completed: 'Finalizada' }

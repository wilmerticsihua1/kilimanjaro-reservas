import { addMinutes, todayISO } from './reservationLogic'

const offsetISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const seedReservations = [
  {
    id: 'seed-1',
    clientName: 'María López',
    clientPhone: '987654321',
    date: offsetISO(0),
    time: '13:00',
    duration: 90,
    guests: 4,
    tableId: 3,
    notes: 'Cumpleaños, llevar pastel',
    status: 'confirmed',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'seed-2',
    clientName: 'Carlos Ramírez',
    clientPhone: '912345678',
    date: offsetISO(0),
    time: '20:00',
    duration: 90,
    guests: 2,
    tableId: 2,
    notes: '',
    status: 'confirmed',
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'seed-3',
    clientName: 'Ana Torres',
    clientPhone: '999888777',
    date: offsetISO(1),
    time: '19:30',
    duration: 90,
    guests: 6,
    tableId: 6,
    notes: 'Celiaquía, menú sin gluten',
    status: 'confirmed',
    createdAt: Date.now() - 3600000,
  },
]

export const makeReservation = (draft) => ({
  ...draft,
  id: crypto.randomUUID(),
  duration: draft.duration ?? 90,
  status: 'confirmed',
  createdAt: Date.now(),
})

export const endTimeOf = (r) => addMinutes(r.time, r.duration ?? 90)

export const today = todayISO()

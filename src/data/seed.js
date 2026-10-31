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
    code: 'KJ-A1B2',
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
    code: 'KJ-C3D4',
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
    code: 'KJ-E5F6',
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
  {
    id: 'seed-4',
    code: 'KJ-G7H8',
    clientName: 'Luis Fernández',
    clientPhone: '955444333',
    date: offsetISO(2),
    time: '19:00',
    duration: 90,
    guests: 4,
    tableId: 4,
    notes: 'Solicitud enviada desde la web',
    status: 'pending',
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'seed-5',
    code: 'KJ-J9K2',
    clientName: 'Jorge Salazar',
    clientPhone: '976111222',
    date: offsetISO(0),
    time: '19:00',
    duration: 90,
    guests: 4,
    tableId: 5,
    notes: '',
    status: 'confirmed',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'seed-6',
    code: 'KJ-M4N6',
    clientName: 'Rosa Quispe',
    clientEmail: 'cliente@kilimanjaro.com',
    clientId: 'cliente@kilimanjaro.com',
    clientPhone: '944555666',
    date: offsetISO(0),
    time: '19:30',
    duration: 90,
    guests: 6,
    tableId: 7,
    notes: 'Cena familiar',
    status: 'confirmed',
    createdAt: Date.now() - 5400000,
  },
]

const newId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `r-${Date.now()}-${Math.random().toString(16).slice(2)}`

// Código corto que el cliente usa para consultar su reserva (ej. KJ-4F7Q)
export const newCode = () => {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let c = ''
  for (let i = 0; i < 4; i++) c += letras[Math.floor(Math.random() * letras.length)]
  return `KJ-${c}`
}

export const makeReservation = (draft) => ({
  ...draft,
  id: newId(),
  code: newCode(),
  duration: draft.duration ?? 90,
  status: draft.status ?? 'confirmed',
  createdAt: Date.now(),
})

export const endTimeOf = (r) => addMinutes(r.time, r.duration ?? 90)

export const today = todayISO()

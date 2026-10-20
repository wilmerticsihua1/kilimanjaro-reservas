import { useEffect, useState } from 'react'
import { seedReservations, makeReservation } from '../data/seed'
import { findConflict, isDuplicate } from '../data/reservationLogic'

const STORAGE_KEY = 'restaurant-reservations-v1'

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return seedReservations
}

export function useReservations() {
  const [reservations, setReservations] = useState(loadInitial)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
  }, [reservations])

  const addReservation = (draft) => {
    if (isDuplicate(reservations, draft)) {
      setError('Ya existe una reserva con el mismo nombre, teléfono, fecha y hora. Evitamos duplicados.')
      return { ok: false, reason: 'duplicate' }
    }
    const conflict = findConflict(reservations, draft)
    if (conflict) {
      setError(`La mesa ${draft.tableId} ya está reservada a las ${conflict.time} para ${conflict.clientName}. Elija otra mesa u horario.`)
      return { ok: false, reason: 'conflict' }
    }
    const created = makeReservation(draft)
    setReservations((prev) => [...prev, created])
    setError(null)
    return { ok: true, reservation: created }
  }

  const cancelReservation = (id) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)))
  }

  const setStatus = (id, status) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const removeReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id))
  }

  const resetDemo = () => {
    setReservations(seedReservations)
    setError(null)
  }

  return { reservations, error, setError, addReservation, cancelReservation, setStatus, removeReservation, resetDemo }
}

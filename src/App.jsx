import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import CalendarView from './components/CalendarView'
import ReservationForm from './components/ReservationForm'
import ReservationList from './components/ReservationList'
import { useReservations } from './hooks/useReservations'
import { DURATION_MINUTES, todayISO, formatDateLong, findConflict } from './data/reservationLogic'
import './App.css'

function App() {
  const { reservations, error, setError, addReservation, cancelReservation, setStatus, removeReservation, resetDemo } = useReservations()

  const [view, setView] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('19:00')
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const stats = useMemo(
    () => ({
      today: reservations.filter((r) => r.date === selectedDate && r.status !== 'cancelled').length,
      confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    }),
    [reservations, selectedDate]
  )

  const handleAdd = (draft) => {
    const result = addReservation(draft)
    if (result.ok) {
      setToast(`Reserva confirmada: ${result.reservation.clientName} · Mesa ${result.reservation.tableId} · ${result.reservation.time}`)
      setEditing(null)
    }
    return result
  }

  const handleUpdate = (draft) => {
    const conflict = findConflict(reservations, draft, editing.id)
    if (conflict) {
      setError(`Conflicto: la mesa ${draft.tableId} ya está ocupada a las ${conflict.time}.`)
      return { ok: false }
    }
    setStatus(editing.id, editing.status)
    removeReservation(editing.id)
    const result = addReservation(draft)
    if (result.ok) {
      setToast('Reserva actualizada correctamente')
      setEditing(null)
    }
    return result
  }

  const handlePickSlot = (date, time) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setEditing(null)
    setView('calendar')
    document.getElementById('form-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleEdit = (reservation) => {
    setEditing(reservation)
    setView('admin')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Header view={view} onChangeView={setView} stats={stats} />

      <main className="layout">
        <div className="col-left">
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={(d) => { setSelectedDate(d); setEditing(null) }}
            reservations={reservations}
            onPickSlot={handlePickSlot}
          />

          {view === 'admin' && (
            <div className="toolbar">
              <button type="button" className="btn ghost" onClick={resetDemo}>Restaurar datos de prueba</button>
            </div>
          )}

          <ReservationList
            reservations={reservations}
            filterDate={view === 'admin' ? null : selectedDate}
            onCancel={cancelReservation}
            onSeat={(id) => setStatus(id, 'seated')}
            onComplete={(id) => setStatus(id, 'completed')}
            onEdit={handleEdit}
            onDelete={removeReservation}
          />
        </div>

        <aside className="col-right">
          <ReservationForm
            key={editing ? `edit-${editing.id}` : `${selectedDate}-${selectedTime}`}
            initialDate={selectedDate}
            initialTime={selectedTime}
            reservations={reservations}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            editing={editing}
            error={error}
            onClearError={() => setError(null)}
          />

          <section className="card tips">
            <h2>Cómo funciona</h2>
            <ol>
              <li>Elige un horario libre en el calendario.</li>
              <li>Completa los datos: el sistema solo ofrece mesas libres según capacidad.</li>
              <li>Confirma: se bloquea el horario y se evitan duplicados y conflictos.</li>
              <li>Gestiona el estado de cada reserva (en mesa, finalizada, cancelada).</li>
            </ol>
          </section>
        </aside>
      </main>

      <footer className="app-footer">
        <p>MesaFácil · Prototipo funcional React · {formatDateLong(todayISO())} · Duración estándar {DURATION_MINUTES} min</p>
      </footer>

      {toast && <div className="toast" role="status">✅ {toast}</div>}
    </div>
  )
}

export default App

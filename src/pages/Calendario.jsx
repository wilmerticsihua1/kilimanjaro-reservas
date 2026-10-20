import { useMemo, useState } from 'react'
import CalendarView from '../components/CalendarView'
import ReservationForm from '../components/ReservationForm'
import ReservationList from '../components/ReservationList'
import { todayISO } from '../data/reservationLogic'

function Calendario({
  reservations,
  error,
  setError,
  addReservation,
  updateReservation,
  cancelReservation,
  setStatus,
  removeReservation,
  resetDemo,
  setToast,
}) {
  const [view, setView] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('19:00')
  const [editing, setEditing] = useState(null)

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
      setSelectedDate(result.reservation.date)
      setSelectedTime(result.reservation.time)
      setToast(`Reserva confirmada: ${result.reservation.clientName} · Mesa ${result.reservation.tableId} · ${result.reservation.time}`)
      setEditing(null)
    }
    return result
  }

  const handleUpdate = (draft) => {
    const result = updateReservation(editing.id, draft)
    if (result.ok) {
      setSelectedDate(result.reservation.date)
      setSelectedTime(result.reservation.time)
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
    <div className="container py-4">
      <ul className="nav nav-pills justify-content-center gap-2 mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={view === 'calendar' ? 'nav-link active' : 'nav-link'}
            aria-current={view === 'calendar'}
            onClick={() => setView('calendar')}
          >
            Calendario
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={view === 'admin' ? 'nav-link active' : 'nav-link'}
            aria-current={view === 'admin'}
            onClick={() => setView('admin')}
          >
            Mis reservas
          </button>
        </li>
      </ul>

      <div className="row g-4">
        <div className="col-lg-8 order-2 order-lg-1 d-flex flex-column gap-4">
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d)
              setEditing(null)
            }}
            reservations={reservations}
            onPickSlot={handlePickSlot}
          />

          <div className="d-flex justify-content-center gap-3 text-muted small">
            <span><strong>{stats.today}</strong> reservas ese día</span>
            <span><strong>{stats.confirmed}</strong> confirmadas</span>
          </div>

          {view === 'admin' && (
            <div className="text-end">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetDemo}>
                Restaurar datos de prueba
              </button>
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

        <div className="col-lg-4 order-1 order-lg-2 d-flex flex-column gap-4">
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

          <section className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6 fw-bold mb-3">Cómo funciona</h2>
              <ol className="small text-muted mb-0 ps-3 d-flex flex-column gap-2">
                <li>Elige un horario libre en el calendario.</li>
                <li>Completa los datos: el sistema solo ofrece mesas libres según capacidad.</li>
                <li>Confirma: se bloquea el horario y se evitan duplicados y conflictos.</li>
                <li>Gestiona el estado de cada reserva (en mesa, finalizada, cancelada).</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Calendario

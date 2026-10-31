import { useMemo, useState } from 'react'
import CalendarView from '../components/CalendarView'
import ReservationForm from '../components/ReservationForm'
import ReservationList from '../components/ReservationList'
import MesasEstado from '../components/MesasEstado'
import { todayISO } from '../data/reservationLogic'
import Encabezado from './admin/Encabezado'

function Calendario({
  reservations,
  mesas = [],
  mesasReservables = [],
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
  const [view, setView] = useState('pending')
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('19:00')
  const [editing, setEditing] = useState(null)

  const stats = useMemo(
    () => ({
      today: reservations.filter((r) => r.date === selectedDate && r.status !== 'cancelled').length,
      confirmed: reservations.filter((r) => r.status === 'confirmed').length,
      pending: reservations.filter((r) => r.status === 'pending').length,
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirm = (id) => {
    setStatus(id, 'confirmed')
    setToast('Solicitud confirmada')
  }

  const vistas = [
    { id: 'pending', texto: `Solicitudes pendientes (${stats.pending})` },
    { id: 'calendar', texto: 'Reservas del día' },
    { id: 'admin', texto: 'Todas las reservas' },
  ]

  return (
    <div className="container-fluid px-4">
      <Encabezado
        titulo="Gestionar reservas"
        descripcion="Registra reservas nuevas y atiende las solicitudes que llegan desde la web."
      />

      <ul className="nav nav-pills gap-2 mb-4">
        {vistas.map((v) => (
          <li className="nav-item" key={v.id}>
            <button
              type="button"
              className={view === v.id ? 'nav-link active' : 'nav-link'}
              aria-current={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.texto}
            </button>
          </li>
        ))}
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

          <MesasEstado
            mesas={mesasReservables}
            todasLasMesas={mesas}
            reservations={reservations}
            fecha={selectedDate}
            hora={selectedTime}
          />

          <div className="d-flex justify-content-center gap-3 text-muted small">
            <span><strong>{stats.today}</strong> reservas ese día</span>
            <span><strong>{stats.confirmed}</strong> confirmadas</span>
            <span><strong>{stats.pending}</strong> pendientes</span>
          </div>

          {view !== 'calendar' && (
            <div className="text-end">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetDemo}>
                Restaurar datos de prueba
              </button>
            </div>
          )}

          <ReservationList
            reservations={reservations}
            titulo={view === 'pending' ? 'Solicitudes pendientes' : view === 'admin' ? 'Todas las reservas' : 'Reservas del día'}
            filterDate={view === 'calendar' ? selectedDate : null}
            filterStatus={view === 'pending' ? 'pending' : null}
            onConfirm={handleConfirm}
            onCancel={cancelReservation}
            onSeat={(id) => setStatus(id, 'seated')}
            onComplete={(id) => setStatus(id, 'completed')}
            onEdit={handleEdit}
            onDelete={removeReservation}
          />
        </div>

        <div className="col-lg-4 order-1 order-lg-2 d-flex flex-column gap-4">
          {editing && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm align-self-start"
              onClick={() => setEditing(null)}
            >
              ← Cancelar edición
            </button>
          )}

          <ReservationForm
            key={editing ? `edit-${editing.id}` : `${selectedDate}-${selectedTime}`}
            initialDate={selectedDate}
            initialTime={selectedTime}
            reservations={reservations}
            mesas={mesasReservables}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            editing={editing}
            error={error}
            onClearError={() => setError(null)}
          />

          <section className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h6 fw-bold mb-3">Estados de una reserva</h2>
              <ul className="small text-muted mb-0 ps-3 d-flex flex-column gap-2">
                <li><strong>Pendiente:</strong> solicitud enviada por un cliente desde la web.</li>
                <li><strong>Confirmada:</strong> aceptada por el restaurante (o registrada aquí).</li>
                <li><strong>En mesa:</strong> el cliente ya llegó.</li>
                <li><strong>Finalizada / Cancelada:</strong> se puede eliminar del registro.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Calendario

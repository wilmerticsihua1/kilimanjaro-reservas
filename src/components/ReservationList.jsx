import { endTimeOf } from '../data/seed'
import { statusLabel, formatDateLong } from '../data/reservationLogic'

function ReservationList({ reservations, onCancel, onSeat, onComplete, onEdit, onDelete, filterDate }) {
  const sorted = [...reservations]
    .filter((r) => !filterDate || r.date === filterDate)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  if (sorted.length === 0) {
    return (
      <section className="card">
        <div className="card-head">
          <h2>Reservas</h2>
          <p>No hay reservas registradas para este filtro.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="card">
      <div className="card-head">
        <h2>Reservas ({sorted.length})</h2>
        <p>Controla el estado de cada mesa en tiempo real.</p>
      </div>

      <ul className="reservation-list">
        {sorted.map((r) => (
          <li key={r.id} className={`reservation status-${r.status}`}>
            <div className="res-main">
              <div className="res-time">
                <strong>{r.time}</strong>
                <span>→ {endTimeOf(r)}</span>
              </div>
              <div className="res-info">
                <p className="res-name">{r.clientName}</p>
                <p className="res-meta">
                  Mesa {r.tableId} · {r.guests} pers · {r.clientPhone}
                </p>
                <p className="res-date">{formatDateLong(r.date)}</p>
                {r.notes && <p className="res-notes">📝 {r.notes}</p>}
              </div>
            </div>

            <div className="res-actions">
              <span className={`badge ${r.status}`}>{statusLabel[r.status] ?? r.status}</span>
              {r.status === 'confirmed' && (
                <>
                  <button type="button" className="btn small" onClick={() => onSeat(r.id)}>A sentar</button>
                  <button type="button" className="btn small ghost" onClick={() => onEdit(r)}>Editar</button>
                  <button type="button" className="btn small danger" onClick={() => onCancel(r.id)}>Cancelar</button>
                </>
              )}
              {r.status === 'seated' && (
                <button type="button" className="btn small ghost" onClick={() => onComplete(r.id)}>Finalizar</button>
              )}
              {(r.status === 'cancelled' || r.status === 'completed') && (
                <button type="button" className="btn small danger" onClick={() => onDelete(r.id)}>Eliminar</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ReservationList

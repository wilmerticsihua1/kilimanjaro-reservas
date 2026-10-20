import { endTimeOf } from '../data/seed'
import { statusLabel, formatDateLong } from '../data/reservationLogic'

const badgeClass = {
  confirmed: 'text-bg-brand',
  seated: 'text-bg-warning',
  cancelled: 'text-bg-secondary',
  completed: 'text-bg-success',
}

function ReservationList({ reservations, onCancel, onSeat, onComplete, onEdit, onDelete, filterDate }) {
  const sorted = [...reservations]
    .filter((r) => !filterDate || r.date === filterDate)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  if (sorted.length === 0) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-bold mb-1">Reservas</h2>
          <p className="text-muted small mb-0">No hay reservas registradas para este filtro.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="mb-3">
          <h2 className="h5 fw-bold mb-1">Reservas ({sorted.length})</h2>
          <p className="text-muted small mb-0">Controla el estado de cada mesa en tiempo real.</p>
        </div>

        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
          {sorted.map((r) => (
            <li key={r.id} className={`reservation border-start border-4 status-${r.status} rounded shadow-sm p-3 bg-white`}>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="d-flex gap-3 flex-grow-1">
                  <div className="res-time text-center rounded px-2 py-1">
                    <div className="fw-bold text-brand">{r.time}</div>
                    <small className="text-muted">→ {endTimeOf(r)}</small>
                  </div>
                  <div>
                    <p className="fw-bold mb-0">{r.clientName}</p>
                    <p className="text-muted small mb-0">
                      Mesa {r.tableId} · {r.guests} pers · {r.clientPhone}
                    </p>
                    <p className="text-muted small mb-0">{formatDateLong(r.date)}</p>
                    {r.notes && <p className="text-warning-emphasis small mb-0">📝 {r.notes}</p>}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className={`badge ${badgeClass[r.status] ?? 'text-bg-secondary'}`}>
                    {statusLabel[r.status] ?? r.status}
                  </span>
                  {r.status === 'confirmed' && (
                    <>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onSeat(r.id)}>A sentar</button>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(r)}>Editar</button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onCancel(r.id)}>Cancelar</button>
                    </>
                  )}
                  {r.status === 'seated' && (
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onComplete(r.id)}>Finalizar</button>
                  )}
                  {(r.status === 'cancelled' || r.status === 'completed') && (
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r.id)}>Eliminar</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ReservationList

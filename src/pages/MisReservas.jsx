import { Link, Navigate } from 'react-router-dom'
import { formatDateLong, statusLabel } from '../data/reservationLogic'

const colorEstado = {
  pending: 'text-bg-info',
  confirmed: 'text-bg-success',
  seated: 'text-bg-warning',
  completed: 'text-bg-secondary',
  cancelled: 'text-bg-danger',
}

// Reservas del cliente que inició sesión (solo puede verlas).
function MisReservas({ usuario, reservations }) {
  if (!usuario) return <Navigate to="/ingresar?volver=/mis-reservas" replace />
  if (usuario.rol === 'admin') return <Navigate to="/panel/reservas" replace />

  const mias = reservations
    .filter((r) => r.clientId === usuario.email)
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold h2 mb-1">Mis reservas</h1>
          <p className="text-muted mb-0">
            {usuario.nombre} · {usuario.email}
          </p>
        </div>
        <Link to="/reservar" className="btn btn-warning fw-semibold">
          Nueva reserva
        </Link>
      </div>

      {mias.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-5">
            <p className="text-muted mb-3">Todavía no tienes reservas.</p>
            <Link to="/reservar" className="btn btn-brand">Reservar una mesa</Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {mias.map((r) => (
            <div className="col-md-6" key={r.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="small text-muted">Código</div>
                      <div className="fw-bold text-brand">{r.code ?? '—'}</div>
                    </div>
                    <span className={`badge ${colorEstado[r.status] ?? 'text-bg-secondary'}`}>
                      {statusLabel[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="mb-1 fw-semibold">{formatDateLong(r.date)} · {r.time}</p>
                  <p className="mb-0 text-muted small">
                    Mesa {r.tableId} · {r.guests} personas
                    {r.notes ? ` · ${r.notes}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="small text-muted mt-4 mb-0">
        Para cambiar o cancelar una reserva, comunícate con el restaurante al (01) 3727985.
      </p>
    </div>
  )
}

export default MisReservas

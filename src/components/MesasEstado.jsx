import { findConflict, formatDateLong, statusLabel } from '../data/reservationLogic'

// Estado de las mesas (libre / reservada) para el día y la hora elegidos.
// Se muestra en "Gestionar reservas". Los datos de las mesas se registran en "Gestionar mesas".
function MesasEstado({ mesas, todasLasMesas = [], reservations, fecha, hora }) {
  const estado = mesas.map((t) => {
    const reserva = findConflict(reservations, { date: fecha, time: hora, tableId: t.id })
    return { ...t, reserva }
  })
  const libres = estado.filter((m) => !m.reserva).length
  const fueraDeServicio = todasLasMesas.filter((m) => !m.operativa)

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Estado de las mesas</h2>
            <p className="text-muted small mb-0">{formatDateLong(fecha)} · {hora}</p>
          </div>
          <span className="text-muted small">{libres} de {mesas.length} libres</span>
        </div>

        <div className="row g-2">
          {estado.map((m) => (
            <div className="col-6 col-md-4 col-xl-3" key={m.id}>
              <div className={`mesa-card h-100 ${m.reserva ? 'mesa-ocupada' : 'mesa-libre'}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <span className="fw-bold">Mesa {m.id}</span>
                  <span className={`badge ${m.reserva ? 'text-bg-danger' : 'text-bg-success'}`}>
                    {m.reserva ? 'Reservada' : 'Libre'}
                  </span>
                </div>
                <p className="small mb-1 opacity-75">{m.capacity} sillas · {m.zone}</p>
                {m.reserva ? (
                  <p className="small mb-0">
                    {m.reserva.time} · {m.reserva.clientName}
                    <span className="d-block text-muted">{statusLabel[m.reserva.status]}</span>
                  </p>
                ) : (
                  <p className="small text-muted mb-0">Sin reserva</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {fueraDeServicio.length > 0 && (
          <p className="small text-muted mt-3 mb-0">
            No operativas (no se pueden reservar): {fueraDeServicio.map((m) => `Mesa ${m.id}`).join(', ')}.
          </p>
        )}
      </div>
    </section>
  )
}

export default MesasEstado

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ReservationForm from '../components/ReservationForm'
import { HOURS, findConflict, formatDateLong, nextDays, todayISO } from '../data/reservationLogic'

// Página pública "Reservar".
//  - Cualquier visitante ve las mesas del día y la hora elegidos: libres u ocupadas (en verde).
//  - Para reservar debe iniciar sesión (o crear su cuenta).
//  - Con la sesión iniciada, el formulario aparece con sus datos ya completados.
function Reservar({ usuario, reservations, mesas: tables = [], error, setError, addReservation }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [fecha, setFecha] = useState(params.get('fecha') || todayISO())
  const [hora, setHora] = useState(params.get('hora') || '19:00')
  const [mesaElegida, setMesaElegida] = useState(
    usuario?.rol === 'cliente' && params.get('mesa') ? Number(params.get('mesa')) : null
  )
  const [aviso, setAviso] = useState('')
  const [registrada, setRegistrada] = useState(null)

  const dias = nextDays(7)

  // Estado de cada mesa en la fecha y hora seleccionadas
  const estadoMesas = tables.map((t) => ({
    ...t,
    ocupada: Boolean(findConflict(reservations, { date: fecha, time: hora, tableId: t.id })),
  }))
  const libres = estadoMesas.filter((m) => !m.ocupada).length

  const elegirMesa = (mesa) => {
    setAviso('')
    if (!usuario) {
      // Pide iniciar sesión y luego regresa aquí con la mesa elegida
      const volver = `/reservar?fecha=${fecha}&hora=${hora}&mesa=${mesa.id}`
      navigate(`/ingresar?volver=${encodeURIComponent(volver)}`)
      return
    }
    if (usuario.rol === 'admin') {
      setAviso('Estás como administrador. Las reservas se registran desde el Panel Administrativo.')
      return
    }
    setMesaElegida(mesa.id)
    setTimeout(() => document.getElementById('detalle-reserva')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleAdd = (draft) => {
    const result = addReservation({ ...draft, status: 'pending', clientId: usuario.email })
    if (result.ok) {
      setRegistrada(result.reservation)
      setMesaElegida(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return result
  }

  // ---------- Reserva registrada ----------
  if (registrada) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body p-4 p-md-5">
                <div className="display-5 mb-2" aria-hidden="true">✅</div>
                <h1 className="h3 fw-bold">¡Reserva registrada!</h1>
                <p className="text-muted mb-4">
                  Gracias, <strong>{registrada.clientName}</strong>. El restaurante revisará tu reserva
                  y te confirmará al teléfono <strong>{registrada.clientPhone}</strong>.
                </p>

                <div className="codigo-reserva mx-auto mb-4">
                  <small className="text-muted d-block">Tu código de reserva</small>
                  <span className="fs-2 fw-bold text-brand">{registrada.code}</span>
                </div>

                <ul className="list-group list-group-flush text-start mb-4">
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Fecha</span>
                    <span className="fw-semibold">{formatDateLong(registrada.date)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Hora</span>
                    <span className="fw-semibold">{registrada.time}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Mesa / Personas</span>
                    <span className="fw-semibold">Mesa {registrada.tableId} · {registrada.guests} personas</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Estado</span>
                    <span className="badge text-bg-info align-self-center">Pendiente de confirmación</span>
                  </li>
                </ul>

                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <Link to="/mis-reservas" className="btn btn-brand">Ver mis reservas</Link>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setRegistrada(null)}>
                    Reservar otra mesa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const mesa = estadoMesas.find((m) => m.id === mesaElegida)

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Reserva tu mesa</h1>
        <p className="text-muted mb-0">Elige el día y la hora para ver qué mesas están libres.</p>
      </div>

      {/* Aviso según el tipo de usuario */}
      {!usuario && (
        <div className="alert alert-light border d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>
            <i className="fas fa-user-lock me-2 text-brand"></i>
            Puedes ver la disponibilidad sin cuenta. Para reservar, <strong>inicia sesión</strong>.
          </span>
          <span className="d-flex gap-2">
            <Link to={`/ingresar?volver=${encodeURIComponent('/reservar')}`} className="btn btn-sm btn-brand">Iniciar sesión</Link>
            <Link to={`/ingresar?modo=registro&volver=${encodeURIComponent('/reservar')}`} className="btn btn-sm btn-outline-secondary">Crear cuenta</Link>
          </span>
        </div>
      )}
      {usuario?.rol === 'cliente' && (
        <div className="alert alert-success d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>
            <i className="fas fa-user-check me-2"></i>
            Reservando como <strong>{usuario.nombre}</strong>. Elige una mesa libre.
          </span>
          <Link to="/mis-reservas" className="btn btn-sm btn-outline-success">Mis reservas</Link>
        </div>
      )}
      {aviso && (
        <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>{aviso}</span>
          <Link to="/panel/reservas" className="btn btn-sm btn-dark">Ir al panel</Link>
        </div>
      )}

      {/* Día y hora */}
      <section className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-7">
              <span className="form-label small fw-semibold d-block">Día</span>
              <div className="d-flex gap-2 overflow-auto pb-1" role="tablist" aria-label="Días">
                {dias.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    role="tab"
                    aria-selected={fecha === d.iso}
                    className={`day-pill ${fecha === d.iso ? 'day-pill-active' : ''}`}
                    onClick={() => { setFecha(d.iso); setMesaElegida(null) }}
                  >
                    <span className="text-uppercase text-muted" style={{ fontSize: '0.66rem' }}>{d.day}</span>
                    <span className="fs-5 fw-bold">{d.num}</span>
                    {d.iso === todayISO() && <span className="day-tag">hoy</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-5">
              <span className="form-label small fw-semibold d-block">Hora</span>
              <div className="d-flex flex-wrap gap-2">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`btn btn-sm ${hora === h ? 'btn-brand' : 'btn-outline-secondary'}`}
                    onClick={() => { setHora(h); setMesaElegida(null) }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mesas */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h5 fw-bold mb-0">
          Mesas · {formatDateLong(fecha)} · {hora}
        </h2>
        <div className="d-flex align-items-center gap-3 small">
          <span><span className="leyenda leyenda-libre"></span> Libre</span>
          <span><span className="leyenda leyenda-ocupada"></span> Ocupada</span>
          <span className="text-muted">{libres} de {tables.length} libres</span>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {estadoMesas.map((m) => (
          <div className="col-6 col-md-4 col-lg-3" key={m.id}>
            <div
              className={`mesa-card h-100 ${m.ocupada ? 'mesa-ocupada' : 'mesa-libre'} ${mesaElegida === m.id ? 'mesa-elegida' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <span className="fs-4" aria-hidden="true">🍽️</span>
                <span className={`badge ${m.ocupada ? 'text-bg-danger' : 'text-bg-light border'}`}>
                  {m.ocupada ? 'Ocupada' : 'Libre'}
                </span>
              </div>
              <h3 className="h6 fw-bold mt-2 mb-0">Mesa {m.id}</h3>
              <p className="small mb-3 opacity-75">
                {m.capacity} personas · {m.zone}
              </p>
              {m.ocupada ? (
                <button type="button" className="btn btn-sm btn-danger w-100" disabled>
                  No disponible
                </button>
              ) : (
                <button type="button" className="btn btn-sm btn-success w-100 fw-semibold" onClick={() => elegirMesa(m)}>
                  {mesaElegida === m.id ? 'Elegida ✓' : 'Reservar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detalle + formulario: solo para el cliente con sesión */}
      {usuario?.rol === 'cliente' && mesa && (
        <div className="row g-4" id="detalle-reserva">
          <div className="col-lg-5">
            <section className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 fw-bold mb-3">Detalle de tu reserva</h2>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Mesa</span>
                    <span className="fw-semibold">Mesa {mesa.id} · {mesa.zone}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Capacidad</span>
                    <span className="fw-semibold">Hasta {mesa.capacity} personas</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Día</span>
                    <span className="fw-semibold">{formatDateLong(fecha)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Hora</span>
                    <span className="fw-semibold">{hora} (2 horas)</span>
                  </li>
                </ul>
                <h3 className="h6 fw-bold">Tus datos</h3>
                <p className="small text-muted mb-0">
                  {usuario.nombre}<br />
                  {usuario.telefono}<br />
                  {usuario.email}
                </p>
                <hr />
                <p className="small text-muted mb-0">
                  <i className="fas fa-info-circle me-1"></i>
                  La mesa queda separada mientras el restaurante confirma tu reserva.
                </p>
              </div>
            </section>
          </div>
          <div className="col-lg-7">
            <ReservationForm
              publico
              key={`${fecha}-${hora}-${mesa.id}`}
              initialDate={fecha}
              initialTime={hora}
              reservations={reservations}
              mesas={tables}
              onAdd={handleAdd}
              error={error}
              onClearError={() => setError(null)}
              datosIniciales={{
                clientName: usuario.nombre,
                clientPhone: usuario.telefono,
                clientEmail: usuario.email,
                tableId: mesa.id,
                guests: Math.min(2, mesa.capacity),
              }}
            />
          </div>
        </div>
      )}

      <p className="text-center small text-muted mt-4 mb-0">
        ¿Tienes un código de reserva? <Link to="/mi-reserva" className="text-brand">Consulta tu reserva aquí</Link>
      </p>
    </div>
  )
}

export default Reservar

import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { formatDateLong, statusLabel } from '../data/reservationLogic'

const colorEstado = {
  pending: 'text-bg-info',
  confirmed: 'text-bg-success',
  seated: 'text-bg-warning',
  completed: 'text-bg-secondary',
  cancelled: 'text-bg-danger',
}

const mensajeEstado = {
  pending: 'Tu reserva está registrada y el restaurante la está revisando.',
  confirmed: '¡Tu reserva está confirmada! Te esperamos.',
  seated: 'Ya estás en tu mesa. ¡Buen provecho!',
  completed: 'Gracias por visitarnos.',
  cancelled: 'Esta reserva fue cancelada. Si tienes dudas, llámanos al (01) 3727985.',
}

// Página pública: el cliente consulta SU reserva con el código y su teléfono.
// Solo puede verla; no puede editarla ni eliminarla.
function ConsultarReserva({ reservations }) {
  const [params] = useSearchParams()
  const [codigo, setCodigo] = useState(params.get('codigo') ?? '')
  const [telefono, setTelefono] = useState('')
  const [resultado, setResultado] = useState(null)
  const [buscado, setBuscado] = useState(false)

  const consultar = (e) => {
    e.preventDefault()
    const c = codigo.trim().toUpperCase()
    const t = telefono.replace(/\D/g, '')
    const r = reservations.find(
      (x) => (x.code ?? '').toUpperCase() === c && x.clientPhone.replace(/\D/g, '') === t
    )
    setResultado(r ?? null)
    setBuscado(true)
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="text-center mb-4">
            <h1 className="fw-bold">Consultar mi reserva</h1>
            <p className="text-muted mb-0">
              Ingresa el código que recibiste al registrar tu reserva y tu teléfono.
            </p>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <form onSubmit={consultar}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="codigoReserva" className="form-label small fw-semibold">Código de reserva</label>
                    <input
                      id="codigoReserva"
                      className="form-control text-uppercase"
                      placeholder="KJ-XXXX"
                      value={codigo}
                      onChange={(e) => { setCodigo(e.target.value); setBuscado(false) }}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="telefonoReserva" className="form-label small fw-semibold">Teléfono</label>
                    <input
                      id="telefonoReserva"
                      className="form-control"
                      inputMode="tel"
                      placeholder="987654321"
                      value={telefono}
                      onChange={(e) => { setTelefono(e.target.value); setBuscado(false) }}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-brand w-100 mt-3 fw-semibold">
                  Consultar
                </button>
              </form>
            </div>
          </div>

          {buscado && !resultado && (
            <div className="alert alert-warning">
              No encontramos una reserva con ese código y teléfono. Revisa los datos e inténtalo otra vez.
            </div>
          )}

          {resultado && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 fw-bold mb-0">Reserva {resultado.code}</h2>
                  <span className={`badge ${colorEstado[resultado.status] ?? 'text-bg-secondary'}`}>
                    {statusLabel[resultado.status] ?? resultado.status}
                  </span>
                </div>
                <p className="mb-3">{mensajeEstado[resultado.status]}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">A nombre de</span>
                    <span className="fw-semibold">{resultado.clientName}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Fecha</span>
                    <span className="fw-semibold">{formatDateLong(resultado.date)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Hora</span>
                    <span className="fw-semibold">{resultado.time}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Personas / Mesa</span>
                    <span className="fw-semibold">{resultado.guests} · Mesa {resultado.tableId}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/reservar" className="text-brand">Registrar una nueva reserva</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultarReserva

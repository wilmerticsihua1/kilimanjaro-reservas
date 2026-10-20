
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Header({ statsToday }) {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active fw-semibold' : 'nav-link'

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-brand shadow-sm sticky-top">
      <div className="container">

        <NavLink
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="fs-3" aria-hidden="true">🍽️</span>

          <span className="d-flex flex-column lh-1">
            <span className="fw-bold">Kilimanjaro</span>
            <small
              className="opacity-75"
              style={{ fontSize: '0.68rem' }}
            >
              Reservas de restaurante
            </small>
          </span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainNav"
          aria-expanded={open}
          aria-label="Alternar navegación"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse ${open ? 'show' : ''}`}
          id="mainNav"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <li className="nav-item">
              <NavLink
                to="/"
                className={linkClass}
                end
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/reservas"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Reservas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/nosotros"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Nosotros
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/servicios"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Servicios
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contacto"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Contacto
              </NavLink>
            </li>

            <li className="nav-item">
              <span className="badge rounded-pill text-bg-warning text-dark ms-lg-2">
                {statsToday} hoy
              </span>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header

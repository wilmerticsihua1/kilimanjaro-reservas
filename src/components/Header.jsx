import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const enlaces = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/menu', texto: 'Menú' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/servicios', texto: 'Servicios' },
  { to: '/contacto', texto: 'Contacto' },
]

function Header({ usuario, onLogout }) {
  const [open, setOpen] = useState(false)
  const [menuUsuario, setMenuUsuario] = useState(false)
  const navigate = useNavigate()

  const salir = () => {
    setMenuUsuario(false)
    setOpen(false)
    onLogout()
    navigate('/')
  }

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
            <small className="opacity-75" style={{ fontSize: '0.68rem' }}>
              Restaurante
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

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {enlaces.map((e) => (
              <li className="nav-item" key={e.to}>
                <NavLink
                  to={e.to}
                  end={e.end}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {e.texto}
                </NavLink>
              </li>
            ))}

            {/* Botón destacado para que el cliente reserve fácilmente */}
            <li className="nav-item">
              <NavLink
                to="/reservar"
                className="btn btn-warning btn-sm fw-semibold ms-lg-2 my-2 my-lg-0"
                onClick={() => setOpen(false)}
              >
                Reservar mesa
              </NavLink>
            </li>

            {/* Según el tipo de usuario */}
            {!usuario && (
              <li className="nav-item">
                <NavLink
                  to="/ingresar"
                  className="btn btn-light btn-sm fw-semibold ms-lg-2 my-2 my-lg-0"
                  onClick={() => setOpen(false)}
                >
                  Iniciar sesión
                </NavLink>
              </li>
            )}

            {usuario?.rol === 'admin' && (
              <li className="nav-item">
                <NavLink
                  to="/panel"
                  className="btn btn-light btn-sm fw-semibold ms-lg-2 my-2 my-lg-0"
                  onClick={() => setOpen(false)}
                >
                  Ir al panel
                </NavLink>
              </li>
            )}

            {usuario?.rol === 'cliente' && (
              <li className="nav-item dropdown ms-lg-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm fw-semibold dropdown-toggle my-2 my-lg-0"
                  aria-expanded={menuUsuario}
                  onClick={() => setMenuUsuario((v) => !v)}
                >
                  Hola, {usuario.nombre.split(' ')[0]}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${menuUsuario ? 'show' : ''}`}>
                  <li>
                    <span className="dropdown-item-text small text-muted">{usuario.email}</span>
                  </li>
                  <li>
                    <NavLink
                      to="/mis-reservas"
                      className="dropdown-item"
                      onClick={() => { setMenuUsuario(false); setOpen(false) }}
                    >
                      Mis reservas
                    </NavLink>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button type="button" className="dropdown-item" onClick={salir}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header

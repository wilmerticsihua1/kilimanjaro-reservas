import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { CLIENTE_DEMO_EMAIL, CLIENTE_DEMO_PASSWORD } from '../hooks/useAuth'

// Login y registro del CLIENTE (dentro de la web pública).
// Si quien entra es el administrador, lo lleva al Panel Administrativo.
function Ingresar({ usuario, onLogin, onRegistrar }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const volver = params.get('volver') || '/reservar'

  const [modo, setModo] = useState(params.get('modo') === 'registro' ? 'registro' : 'login')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', password2: '' })

  if (usuario) return <Navigate to={usuario.rol === 'admin' ? '/panel' : volver} replace />

  const cambiar = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }))
    setError('')
  }

  const entrar = (e) => {
    e.preventDefault()
    const r = onLogin(form.email, form.password)
    if (!r.ok) return setError(r.error)
    navigate(r.usuario.rol === 'admin' ? '/panel' : volver, { replace: true })
  }

  const crearCuenta = (e) => {
    e.preventDefault()
    if (form.nombre.trim().length < 3) return setError('Escribe tu nombre completo.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Escribe un correo válido.')
    if (!/^[0-9+\s-]{6,}$/.test(form.telefono.trim())) return setError('Escribe un teléfono válido (ej. 987654321).')
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (form.password !== form.password2) return setError('Las contraseñas no coinciden.')
    const r = onRegistrar(form)
    if (!r.ok) return setError(r.error)
    navigate(volver, { replace: true })
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="text-center mb-4">
            <h1 className="fw-bold h2">{modo === 'login' ? 'Inicia sesión para reservar' : 'Crea tu cuenta'}</h1>
            <p className="text-muted mb-0">
              {modo === 'login'
                ? 'Con tu cuenta tus datos se completan solos al reservar.'
                : 'Solo te tomará un momento.'}
            </p>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white p-0">
              <div className="nav nav-tabs nav-fill border-0">
                <button
                  type="button"
                  className={`nav-link rounded-0 py-3 ${modo === 'login' ? 'active fw-semibold' : 'text-muted'}`}
                  onClick={() => { setModo('login'); setError('') }}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  className={`nav-link rounded-0 py-3 ${modo === 'registro' ? 'active fw-semibold' : 'text-muted'}`}
                  onClick={() => { setModo('registro'); setError('') }}
                >
                  Crear cuenta
                </button>
              </div>
            </div>

            <div className="card-body p-4">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              {modo === 'login' ? (
                <form onSubmit={entrar}>
                  <div className="mb-3">
                    <label htmlFor="ingEmail" className="form-label small fw-semibold">Correo electrónico</label>
                    <input id="ingEmail" type="email" className="form-control" value={form.email}
                      onChange={cambiar('email')} autoComplete="email" required />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="ingPassword" className="form-label small fw-semibold">Contraseña</label>
                    <input id="ingPassword" type="password" className="form-control" value={form.password}
                      onChange={cambiar('password')} autoComplete="current-password" required />
                  </div>
                  <button type="submit" className="btn btn-brand w-100 fw-semibold">Ingresar</button>

                  <div className="alert alert-light border small mt-4 mb-0">
                    <strong>Cliente de prueba:</strong> {CLIENTE_DEMO_EMAIL} / {CLIENTE_DEMO_PASSWORD}
                  </div>
                </form>
              ) : (
                <form onSubmit={crearCuenta} noValidate>
                  <div className="mb-3">
                    <label htmlFor="regNombre" className="form-label small fw-semibold">Nombre completo</label>
                    <input id="regNombre" className="form-control" value={form.nombre}
                      onChange={cambiar('nombre')} autoComplete="name" placeholder="Ej. María López" />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-sm-7">
                      <label htmlFor="regEmail" className="form-label small fw-semibold">Correo</label>
                      <input id="regEmail" type="email" className="form-control" value={form.email}
                        onChange={cambiar('email')} autoComplete="email" placeholder="tucorreo@ejemplo.com" />
                    </div>
                    <div className="col-sm-5">
                      <label htmlFor="regTelefono" className="form-label small fw-semibold">Teléfono</label>
                      <input id="regTelefono" className="form-control" inputMode="tel" value={form.telefono}
                        onChange={cambiar('telefono')} autoComplete="tel" placeholder="987654321" />
                    </div>
                  </div>
                  <div className="row g-2 mb-4">
                    <div className="col-sm-6">
                      <label htmlFor="regPassword" className="form-label small fw-semibold">Contraseña</label>
                      <input id="regPassword" type="password" className="form-control" value={form.password}
                        onChange={cambiar('password')} autoComplete="new-password" placeholder="Mínimo 6 caracteres" />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="regPassword2" className="form-label small fw-semibold">Repetir contraseña</label>
                      <input id="regPassword2" type="password" className="form-control" value={form.password2}
                        onChange={cambiar('password2')} autoComplete="new-password" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-brand w-100 fw-semibold">Crear cuenta y continuar</button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center small text-muted mt-4">
            ¿Eres el administrador? <Link to="/login" className="text-brand">Entra al Panel Administrativo</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Ingresar

import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../hooks/useAuth'
import './admin/admin.css'

// Login del Panel Administrativo — igual al modelo del profesor (SB Admin)
export const Login = ({ isAdmin, onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Si ya inició sesión, va directo al panel
  if (isAdmin) return <Navigate to="/panel" replace />

  const handleSubmit = (event) => {
    event.preventDefault()
    const r = onLogin(email, password)
    if (!r.ok) return setError(r.error)
    // Un cliente que entra por aquí vuelve a la web
    navigate(r.usuario.rol === 'admin' ? '/panel' : '/reservar')
  }

  return (
    <div className="login-admin">

     <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                                    <div className="card-body">
                                        {error && <div className="alert alert-danger py-2 small">{error}</div>}
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-floating mb-3">
                                                <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com"
                                                  value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} required />
                                                <label htmlFor="inputEmail">Email address</label>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input className="form-control" id="inputPassword" type="password" placeholder="Password"
                                                  value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} required />
                                                <label htmlFor="inputPassword">Password</label>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
                                                <label className="form-check-label" htmlFor="inputRememberPassword">Remember Password</label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">

                                                <button className="btn btn-primary" type="submit">Login</button>

                                            </div>
                                        </form>
                                    </div>

                                </div>
                                {/* Usuario de prueba para la presentación */}
                                <p className="text-center text-muted small mt-3">
                                    Usuario de prueba: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div id="layoutAuthentication_footer">
                <footer className="py-4 bg-light mt-auto">
                    <div className="container-fluid px-4">
                        <div className="d-flex align-items-center justify-content-between small">
                            <div className="text-muted">Copyright &copy; Your Website 2023</div>
                            <div>
                                <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>




    </div>
  )
}

export default Login

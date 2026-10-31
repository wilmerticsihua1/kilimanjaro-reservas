import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Barra superior del Panel Administrativo — igual al modelo del profesor (SB Admin)
export const Panelbarra = ({ onToggleMenu, onLogout }) => {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [menuUsuario, setMenuUsuario] = useState(false)

  const buscar = (e) => {
    e.preventDefault()
    if (busqueda.trim()) navigate(`/panel/buscar?q=${encodeURIComponent(busqueda.trim())}`)
  }

  const logout = () => {
    setMenuUsuario(false)
    onLogout()
    navigate('/login')
  }

  return (
    <div>

<nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">

            <Link className="navbar-brand ps-3" to="/panel">Administracion</Link>

            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" type="button" onClick={onToggleMenu}><i className="fas fa-bars"></i></button>

            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0" onSubmit={buscar}>
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="submit"><i className="fas fa-search"></i></button>
                </div>
            </form>

            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" aria-expanded={menuUsuario}
                      onClick={(e) => { e.preventDefault(); setMenuUsuario((v) => !v) }}><i className="fas fa-user fa-fw"></i></a>
                    <ul className={`dropdown-menu dropdown-menu-end ${menuUsuario ? 'show' : ''}`} style={{ position: 'absolute', right: 0 }} aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to="/" onClick={() => setMenuUsuario(false)}>Settings</Link></li>
                        <li><Link className="dropdown-item" to="/panel/reporte01" onClick={() => setMenuUsuario(false)}>Activity Log</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#!" onClick={(e) => { e.preventDefault(); logout() }}>Logout</a></li>
                    </ul>
                </li>
            </ul>
        </nav>


    </div>
  )
}

export default Panelbarra

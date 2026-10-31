import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// Menú lateral del Panel Administrativo — igual al modelo del profesor (SB Admin)
export const Panelmenu = ({ pendientes = 0, onNavegar }) => {
  const { pathname } = useLocation()
  const [horariosAbierto, setHorariosAbierto] = useState(pathname.startsWith('/panel/reservas'))
  const [reportesAbierto, setReportesAbierto] = useState(true)

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <div>

 <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                        <div className="nav">

                            <NavLink to="/panel/mesas" className={linkClass} onClick={onNavegar}>
                                <div className="sb-nav-link-icon"><i className="fas fa-chair"></i></div>
                                Gestionar Mesas
                            </NavLink>

                            <NavLink to="/panel/platos" className={linkClass} onClick={onNavegar}>
                                <div className="sb-nav-link-icon"><i className="fas fa-utensils"></i></div>
                                Gestionar Platos
                            </NavLink>

                            <a className={`nav-link ${horariosAbierto ? '' : 'collapsed'}`} href="#" aria-expanded={horariosAbierto} aria-controls="collapseLayouts"
                              onClick={(e) => { e.preventDefault(); setHorariosAbierto(!horariosAbierto) }}>
                                <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                               Gestionar Horarios
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </a>
                            <div className={`collapse ${horariosAbierto ? 'show' : ''}`} id="collapseLayouts">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <NavLink to="/panel/reservas" className={linkClass} onClick={onNavegar}>
                                        Gestionar Reservas
                                        {pendientes > 0 && <span className="badge rounded-pill text-bg-warning ms-2">{pendientes}</span>}
                                    </NavLink>
                                </nav>
                            </div>

                            <a className={`nav-link ${reportesAbierto ? '' : 'collapsed'}`} href="#" aria-expanded={reportesAbierto} aria-controls="collapsePages"
                              onClick={(e) => { e.preventDefault(); setReportesAbierto(!reportesAbierto) }}>
                                <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                               Reportes
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </a>

                            {reportesAbierto && (
                              <>
                               <NavLink className={linkClass} to="/panel/reporte01" onClick={onNavegar}>
                                <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                Reporte 01
                            </NavLink>
                            <NavLink className={linkClass} to="/panel/reporte02" onClick={onNavegar}>
                                <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                               Reporte 02
                            </NavLink>
                            <NavLink className={linkClass} to="/panel/reporte03" onClick={onNavegar}>
                                <div className="sb-nav-link-icon"><i className="fas fa-chair"></i></div>
                               Reporte 03
                            </NavLink>
                            <NavLink className={linkClass} to="/panel/reporte04" onClick={onNavegar}>
                                <div className="sb-nav-link-icon"><i className="fas fa-utensils"></i></div>
                               Reporte 04
                            </NavLink>
                              </>
                            )}
                        </div>
                    </div>

                </nav>
            </div>


    </div>
  )
}

export default Panelmenu

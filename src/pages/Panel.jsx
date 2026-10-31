import { Link } from 'react-router-dom';
import { todayISO } from '../data/reservationLogic';

// Inicio del panel de administración (dashboard)
export const Panel = ({ reservations = [], platos = [], mesas = [] }) => {
  const hoy = todayISO();
  const reservasHoy = reservations.filter((r) => r.date === hoy && r.status !== 'cancelled').length;
  const pendientes = reservations.filter((r) => r.status === 'pending');
  const platosActivos = platos.filter((p) => p.disponible).length;

  const tarjetas = [
    { titulo: 'Solicitudes pendientes', valor: pendientes.length, color: 'bg-info', icono: 'fa-bell', to: '/panel/reservas', link: 'Revisar solicitudes' },
    { titulo: 'Reservas de hoy', valor: reservasHoy, color: 'bg-primary', icono: 'fa-calendar-day', to: '/panel/reservas', link: 'Gestionar reservas' },
    { titulo: 'Platos en el menú', valor: `${platosActivos} / ${platos.length}`, color: 'bg-success', icono: 'fa-hamburger', to: '/panel/platos', link: 'Gestionar platos' },
    { titulo: 'Mesas operativas', valor: `${mesas.filter((m) => m.operativa).length} / ${mesas.length}`, color: 'bg-warning text-dark', icono: 'fa-chair', to: '/panel/mesas', link: 'Gestionar mesas' },
  ];

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Gestion administrativa del Restaurante</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/panel">Dashboard</Link></li>
        <li className="breadcrumb-item active">Static Navigation</li>
      </ol>

      <div className="row">
        {tarjetas.map((t) => (
          <div className="col-xl-3 col-md-6 mb-4" key={t.titulo}>
            <div className={`card ${t.color} ${t.color.includes('text-dark') ? '' : 'text-white'} h-100`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="small opacity-75">{t.titulo}</div>
                  <div className="fs-2 fw-bold">{t.valor}</div>
                </div>
                <i className={`fas ${t.icono} fa-2x opacity-50`}></i>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link to={t.to} className="text-reset text-decoration-none small fw-semibold">
                  {t.link} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-bell me-2 text-info"></i>
          Últimas solicitudes de reserva desde la web
        </div>
        <div className="card-body">
          {pendientes.length === 0 ? (
            <p className="text-muted mb-0">No hay solicitudes pendientes.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Personas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pendientes.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td>{r.clientName}</td>
                      <td>{r.clientPhone}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>{r.guests}</td>
                      <td className="text-end">
                        <Link to="/panel/reservas" className="btn btn-sm btn-outline-primary">
                          Atender
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;

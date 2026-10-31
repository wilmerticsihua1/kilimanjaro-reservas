import Encabezado from './Encabezado';
import { statusLabel } from '../../data/reservationLogic';

function Reporte01({ reservations }) {
  const activas = reservations.filter((r) => r.status !== 'cancelled');
  const canceladas = reservations.filter((r) => r.status === 'cancelled');
  const pendientes = reservations.filter((r) => r.status === 'pending');

  return (
    <div className="container-fluid px-4">
      <Encabezado titulo="Reporte 01: Resumen de reservas" actual="Reporte 01" descripcion="Resumen general de las reservas del restaurante." />

      <div className="row g-3 my-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total de reservas</h6>
              <h2>{reservations.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Reservas activas (no canceladas)</h6>
              <h2 className="text-success">{activas.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Solicitudes pendientes</h6>
              <h2 className="text-info">{pendientes.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Reservas canceladas</h6>
              <h2 className="text-danger">{canceladas.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5>Listado de reservas</h5>

          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Mesa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay reservas registradas.
                    </td>
                  </tr>
                ) : (
                  reservations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.clientName || 'Sin nombre'}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>{r.tableId}</td>
                      <td>
                        {statusLabel[r.status] ?? r.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reporte01;

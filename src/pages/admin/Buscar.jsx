import { Link, useSearchParams } from 'react-router-dom';
import Encabezado from './Encabezado';
import { statusLabel } from '../../data/reservationLogic';

// Resultados del buscador de la barra superior
function Buscar({ reservations = [], platos = [] }) {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim().toLowerCase();

  const reservas = q
    ? reservations.filter(
        (r) =>
          r.clientName.toLowerCase().includes(q) ||
          r.clientPhone.includes(q) ||
          (r.code ?? '').toLowerCase().includes(q)
      )
    : [];
  const platosEncontrados = q
    ? platos.filter((p) => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))
    : [];

  return (
    <div className="container-fluid px-4">
      <Encabezado titulo="Resultados de búsqueda" actual={`Buscar: "${params.get('q') ?? ''}"`} />

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-calendar-check me-1"></i> Reservas ({reservas.length})
        </div>
        <div className="card-body">
          {reservas.length === 0 ? (
            <p className="text-muted mb-0">Ninguna reserva coincide con la búsqueda.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Mesa</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id}>
                      <td>{r.code ?? '—'}</td>
                      <td>{r.clientName}</td>
                      <td>{r.clientPhone}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>{r.tableId}</td>
                      <td>{statusLabel[r.status] ?? r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link to="/panel/reservas" className="btn btn-sm btn-outline-primary mt-3">Ir a Gestionar reservas</Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-hamburger me-1"></i> Platos ({platosEncontrados.length})
        </div>
        <div className="card-body">
          {platosEncontrados.length === 0 ? (
            <p className="text-muted mb-0">Ningún plato coincide con la búsqueda.</p>
          ) : (
            <ul className="list-group mb-0">
              {platosEncontrados.map((p) => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <span>
                    {p.nombre} <small className="text-muted">· {p.categoria}</small>
                  </span>
                  <span>S/ {Number(p.precio).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/panel/platos" className="btn btn-sm btn-outline-primary mt-3">Ir a Gestionar platos</Link>
        </div>
      </div>
    </div>
  );
}

export default Buscar;

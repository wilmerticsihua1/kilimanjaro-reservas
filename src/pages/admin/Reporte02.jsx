import { useState } from 'react';
import Encabezado from './Encabezado';
import { statusLabel, todayISO } from '../../data/reservationLogic';

function Reporte02({ reservations }) {
  const [fecha, setFecha] = useState(todayISO());

  const filtradas = reservations.filter((r) => r.date === fecha);

  return (
    <div className="container-fluid px-4">
      <Encabezado titulo="Reporte 02: Reservas por fecha" actual="Reporte 02" descripcion="Selecciona un día para consultar sus reservas." />

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <label htmlFor="fechaReporte" className="form-label">
            Fecha de consulta
          </label>
          <input
            id="fechaReporte"
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <p className="mt-3 mb-0">
            <strong>Reservas encontradas:</strong> {filtradas.length}
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Hora</th>
                  <th>Mesa</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay reservas para esta fecha.
                    </td>
                  </tr>
                ) : (
                  filtradas.map((r) => (
                    <tr key={r.id}>
                      <td>{r.clientName || 'Sin nombre'}</td>
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

export default Reporte02;

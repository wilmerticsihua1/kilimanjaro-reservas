import Encabezado from './Encabezado';

// Reporte 03: cuántas reservas tiene cada mesa registrada en Gestionar mesas
function Reporte03({ reservations = [], mesas = [] }) {
  // Solo cuentan las reservas que no fueron canceladas
  const validas = reservations.filter((r) => r.status !== 'cancelled');

  const filas = mesas
    .map((m) => {
      const suyas = validas.filter((r) => Number(r.tableId) === m.id);
      const personas = suyas.reduce((total, r) => total + (Number(r.guests) || 0), 0);
      return { ...m, reservas: suyas.length, personas };
    })
    .sort((a, b) => b.reservas - a.reservas || a.id - b.id);

  const maximo = Math.max(1, ...filas.map((f) => f.reservas));
  const operativas = mesas.filter((m) => m.operativa).length;
  const masUsada = filas.length > 0 && filas[0].reservas > 0 ? filas[0] : null;
  const sinUso = filas.filter((f) => f.operativa && f.reservas === 0).length;

  return (
    <div className="container-fluid px-4">
      <Encabezado
        titulo="Reporte 03: Ocupación de mesas"
        actual="Reporte 03"
        descripcion="Cantidad de reservas por mesa (sin contar las canceladas)."
      />

      <div className="row g-3 my-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Mesas registradas</h6>
              <h2>{mesas.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Mesas operativas</h6>
              <h2 className="text-success">{operativas}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Mesa más reservada</h6>
              <h2 className="text-info">{masUsada ? `Mesa ${masUsada.id}` : '—'}</h2>
              {masUsada && <small className="text-muted">{masUsada.reservas} reserva(s)</small>}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Operativas sin reservas</h6>
              <h2 className="text-danger">{sinUso}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5>Reservas por mesa</h5>

          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Mesa</th>
                  <th>Ubicación</th>
                  <th>Tipo</th>
                  <th className="text-center">Sillas</th>
                  <th>Estado</th>
                  <th className="text-center">Reservas</th>
                  <th className="text-center">Personas</th>
                  <th style={{ minWidth: 140 }}>Uso</th>
                </tr>
              </thead>
              <tbody>
                {filas.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No hay mesas registradas.</td>
                  </tr>
                ) : (
                  filas.map((f) => (
                    <tr key={f.id} className={f.operativa ? '' : 'opacity-50'}>
                      <td className="fw-semibold">Mesa {f.id}</td>
                      <td>{f.ubicacion}</td>
                      <td>{f.tipo}</td>
                      <td className="text-center">{f.sillas}</td>
                      <td>
                        <span className={`badge ${f.operativa ? 'text-bg-success' : 'text-bg-secondary'}`}>
                          {f.operativa ? 'Operativa' : 'No operativa'}
                        </span>
                      </td>
                      <td className="text-center fw-semibold">{f.reservas}</td>
                      <td className="text-center">{f.personas}</td>
                      <td>
                        <div className="progress" role="progressbar" aria-label={`Uso de la mesa ${f.id}`} aria-valuenow={f.reservas} aria-valuemin="0" aria-valuemax={maximo}>
                          <div className="progress-bar bg-warning" style={{ width: `${(f.reservas / maximo) * 100}%` }}></div>
                        </div>
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

export default Reporte03;

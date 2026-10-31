import { useState } from 'react';
import Encabezado from './Encabezado';
import { CATEGORIAS } from '../../hooks/useMenu';

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

// Reporte 04: resumen de la carta (platos disponibles/ocultos y precios por categoría)
function Reporte04({ platos = [] }) {
  const [categoria, setCategoria] = useState('Todas');

  const disponibles = platos.filter((p) => p.disponible).length;
  const ocultos = platos.length - disponibles;
  const promedio = platos.length
    ? platos.reduce((total, p) => total + Number(p.precio || 0), 0) / platos.length
    : 0;

  const resumen = CATEGORIAS.map((c) => {
    const lista = platos.filter((p) => p.categoria === c);
    const precios = lista.map((p) => Number(p.precio || 0));
    return {
      categoria: c,
      total: lista.length,
      disponibles: lista.filter((p) => p.disponible).length,
      minimo: precios.length ? Math.min(...precios) : null,
      maximo: precios.length ? Math.max(...precios) : null,
    };
  });

  const lista = platos
    .filter((p) => categoria === 'Todas' || p.categoria === categoria)
    .sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre));

  return (
    <div className="container-fluid px-4">
      <Encabezado
        titulo="Reporte 04: Platos de la carta"
        actual="Reporte 04"
        descripcion="Resumen de los platos registrados, su disponibilidad y sus precios."
      />

      <div className="row g-3 my-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Total de platos</h6>
              <h2>{platos.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Disponibles en la carta</h6>
              <h2 className="text-success">{disponibles}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Ocultos</h6>
              <h2 className="text-danger">{ocultos}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Precio promedio</h6>
              <h2 className="text-info">{soles(promedio)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5>Resumen por categoría</h5>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th className="text-center">Platos</th>
                  <th className="text-center">Disponibles</th>
                  <th className="text-end">Precio mínimo</th>
                  <th className="text-end">Precio máximo</th>
                </tr>
              </thead>
              <tbody>
                {resumen.map((r) => (
                  <tr key={r.categoria}>
                    <td className="fw-semibold">{r.categoria}</td>
                    <td className="text-center">{r.total}</td>
                    <td className="text-center">{r.disponibles}</td>
                    <td className="text-end">{r.minimo === null ? '—' : soles(r.minimo)}</td>
                    <td className="text-end">{r.maximo === null ? '—' : soles(r.maximo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h5 className="mb-0">Listado de platos ({lista.length})</h5>
            <select
              className="form-select form-select-sm w-auto"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              <option>Todas</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Plato</th>
                  <th>Categoría</th>
                  <th className="text-end">Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lista.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No hay platos en esta categoría.</td>
                  </tr>
                ) : (
                  lista.map((p) => (
                    <tr key={p.id} className={p.disponible ? '' : 'opacity-50'}>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td className="text-end">{soles(p.precio)}</td>
                      <td>
                        <span className={`badge ${p.disponible ? 'text-bg-success' : 'text-bg-secondary'}`}>
                          {p.disponible ? 'Disponible' : 'Oculto'}
                        </span>
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

export default Reporte04;

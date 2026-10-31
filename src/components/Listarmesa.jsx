import { useState } from 'react';
import Encabezado from '../pages/admin/Encabezado';
import { UBICACIONES, TIPOS } from '../hooks/useMesas';

const formularioVacio = (numero) => ({
  id: String(numero),
  ubicacion: UBICACIONES[0],
  tipo: TIPOS[0],
  sillas: '2',
  operativa: true,
});

// Gestionar mesas: aquí SOLO se registran los datos de cada mesa
// (número, ubicación, tipo, cantidad de sillas y si está operativa).
// Saber si una mesa está libre o reservada se ve en "Gestionar reservas".
export const Listarmesa = ({
  mesas = [],
  siguienteNumero,
  agregarMesa,
  actualizarMesa,
  eliminarMesa,
  cambiarOperativa,
  restaurarMesas,
  setToast = () => {},
}) => {
  const [form, setForm] = useState(() => formularioVacio(siguienteNumero()));
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [porEliminar, setPorEliminar] = useState(null);
  const [filtro, setFiltro] = useState('Todas');

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setError('');
  };

  const limpiar = () => {
    setForm(formularioVacio(siguienteNumero()));
    setEditandoId(null);
    setError('');
  };

  const guardar = (e) => {
    e.preventDefault();
    const numero = Number(form.id);
    const sillas = Number(form.sillas);

    if (!form.id || !Number.isInteger(numero) || numero <= 0)
      return setError('El número de mesa debe ser un entero mayor a 0.');
    if (!form.sillas || !Number.isInteger(sillas) || sillas < 1 || sillas > 20)
      return setError('La cantidad de sillas debe estar entre 1 y 20.');

    const datos = {
      id: numero,
      ubicacion: form.ubicacion,
      tipo: form.tipo,
      sillas,
      operativa: form.operativa,
    };

    const resultado = editandoId !== null ? actualizarMesa(editandoId, datos) : agregarMesa(datos);
    if (!resultado.ok) return setError(resultado.error);

    setToast(editandoId !== null ? 'Mesa actualizada' : 'Mesa registrada');
    // Al terminar, el formulario queda listo para la siguiente mesa
    setForm(formularioVacio(Math.max(numero, ...mesas.map((m) => m.id)) + 1));
    setEditandoId(null);
  };

  const editar = (mesa) => {
    setEditandoId(mesa.id);
    setForm({
      id: String(mesa.id),
      ubicacion: mesa.ubicacion,
      tipo: mesa.tipo,
      sillas: String(mesa.sillas),
      operativa: mesa.operativa,
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmarEliminar = (id) => {
    eliminarMesa(id);
    setPorEliminar(null);
    if (editandoId === id) limpiar();
    setToast('Mesa eliminada');
  };

  const lista = mesas.filter((m) => filtro === 'Todas' || m.ubicacion === filtro);
  const operativas = mesas.filter((m) => m.operativa).length;

  return (
    <div className="container-fluid px-4">
      <Encabezado
        titulo="Gestionar mesas"
        descripcion="Registra los datos de cada mesa del local. Para ver si están libres o reservadas, entra a Gestionar reservas."
      />

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-bold mb-3">
                {editandoId !== null ? `Editar mesa ${editandoId}` : 'Nueva mesa'}
              </h2>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={guardar} noValidate>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label htmlFor="mesaNumero" className="form-label small fw-semibold">N.º de mesa *</label>
                    <input
                      id="mesaNumero"
                      type="number"
                      min="1"
                      className="form-control"
                      value={form.id}
                      onChange={cambiar('id')}
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="mesaSillas" className="form-label small fw-semibold">Cant. de sillas *</label>
                    <input
                      id="mesaSillas"
                      type="number"
                      min="1"
                      max="20"
                      className="form-control"
                      value={form.sillas}
                      onChange={cambiar('sillas')}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="mesaUbicacion" className="form-label small fw-semibold">Ubicación *</label>
                  <select
                    id="mesaUbicacion"
                    className="form-select"
                    value={form.ubicacion}
                    onChange={cambiar('ubicacion')}
                  >
                    {UBICACIONES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="mesaTipo" className="form-label small fw-semibold">Tipo de mesa *</label>
                  <select
                    id="mesaTipo"
                    className="form-select"
                    value={form.tipo}
                    onChange={cambiar('tipo')}
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    id="mesaOperativa"
                    className="form-check-input"
                    type="checkbox"
                    checked={form.operativa}
                    onChange={cambiar('operativa')}
                  />
                  <label htmlFor="mesaOperativa" className="form-check-label">
                    Operativa (en buen estado y disponible para usar)
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-brand flex-grow-1 fw-semibold">
                    {editandoId !== null ? 'Guardar cambios' : 'Registrar mesa'}
                  </button>
                  {editandoId !== null && (
                    <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Listado */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h2 className="h5 fw-bold mb-0">
                  Mesas registradas ({lista.length})
                  <span className="text-muted fs-6 fw-normal ms-2">· {operativas} operativas</span>
                </h2>
                <select
                  className="form-select form-select-sm w-auto"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  aria-label="Filtrar por ubicación"
                >
                  <option>Todas</option>
                  {UBICACIONES.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>N.º</th>
                      <th>Ubicación</th>
                      <th>Tipo</th>
                      <th className="text-center">Sillas</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No hay mesas registradas en esta ubicación.
                        </td>
                      </tr>
                    )}
                    {lista.map((m) => (
                      <tr key={m.id} className={m.operativa ? '' : 'opacity-50'}>
                        <td className="fw-semibold">Mesa {m.id}</td>
                        <td>{m.ubicacion}</td>
                        <td>{m.tipo}</td>
                        <td className="text-center">{m.sillas}</td>
                        <td>
                          <button
                            type="button"
                            className={`badge border-0 ${m.operativa ? 'text-bg-success' : 'text-bg-secondary'}`}
                            onClick={() => cambiarOperativa(m.id)}
                            title="Clic para cambiar"
                          >
                            {m.operativa ? 'Operativa' : 'No operativa'}
                          </button>
                        </td>
                        <td className="text-end text-nowrap">
                          {porEliminar === m.id ? (
                            <>
                              <span className="small me-2">¿Eliminar?</span>
                              <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => confirmarEliminar(m.id)}>
                                Sí
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setPorEliminar(null)}>
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => editar(m)}>
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPorEliminar(m.id)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-end">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={restaurarMesas}>
                  Restaurar mesas de ejemplo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listarmesa;

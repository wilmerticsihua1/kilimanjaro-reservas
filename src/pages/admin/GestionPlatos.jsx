import { useState } from 'react';
import { CATEGORIAS } from '../../hooks/useMenu';
import Encabezado from './Encabezado';
import FotoPlato from '../../components/FotoPlato';

const formularioVacio = {
  nombre: '',
  categoria: CATEGORIAS[0],
  precio: '',
  descripcion: '',
  disponible: true,
  imagen: '',
};

// Fotos que ya existen en la web (carpeta public/img)
const galeria = ['/img/plato1.jpg', '/img/plato2.jpg', '/img/plato3.jpg', '/img/ambiente.jpg', '/img/terraza.jpg', '/img/hero.jpg'];

// Reduce la foto subida para que no ocupe mucho espacio
const reducirFoto = (archivo) =>
  new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = reject;
    lector.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const escala = Math.min(1, 600 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });

const soles = (n) => `S/ ${Number(n).toFixed(2)}`;

// Gestionar platos: el dueño agrega, edita, oculta o elimina los platos del menú.
// Lo que se guarda aquí es lo que ve el cliente en la página pública "Menú".
function GestionPlatos({
  platos,
  agregarPlato,
  actualizarPlato,
  eliminarPlato,
  cambiarDisponible,
  restaurarMenu,
  setToast,
}) {
  const [form, setForm] = useState(formularioVacio);
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
    setForm(formularioVacio);
    setEditandoId(null);
    setError('');
  };

  const guardar = (e) => {
    e.preventDefault();
    const precio = Number(form.precio);

    if (!form.nombre.trim()) return setError('Escribe el nombre del plato.');
    if (!form.precio || Number.isNaN(precio) || precio <= 0) return setError('El precio debe ser mayor a 0.');
    if (!form.descripcion.trim()) return setError('Escribe una descripción corta.');

    const datos = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      precio,
      descripcion: form.descripcion.trim(),
      disponible: form.disponible,
      imagen: form.imagen ?? '',
      // Si el admin cambió la foto, ya no corresponde el crédito ni la foto original de Wikimedia
      credito: (form.imagen ?? '').includes('wikimedia.org') ? form.credito ?? '' : '',
      imagenOriginal: (form.imagen ?? '').includes('wikimedia.org') ? form.imagenOriginal ?? '' : '',
    };

    const resultado = editandoId ? actualizarPlato(editandoId, datos) : agregarPlato(datos);
    if (!resultado.ok) return setError(resultado.error);

    setToast(editandoId ? 'Plato actualizado' : 'Plato registrado en el menú');
    limpiar();
  };

  const editar = (plato) => {
    setEditandoId(plato.id);
    setForm({ ...formularioVacio, ...plato, precio: String(plato.precio) });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmarEliminar = (id) => {
    eliminarPlato(id);
    setPorEliminar(null);
    if (editandoId === id) limpiar();
    setToast('Plato eliminado');
  };

  const lista = platos.filter((p) => filtro === 'Todas' || p.categoria === filtro);

  return (
    <div className="container-fluid px-4">
      <Encabezado
        titulo="Gestionar platos"
        descripcion="Los platos marcados como disponibles aparecen en la página pública Menú."
      />

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 fw-bold mb-3">
                {editandoId ? 'Editar plato' : 'Nuevo plato'}
              </h2>

              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <form onSubmit={guardar} noValidate>
                <div className="mb-3">
                  <label htmlFor="platoNombre" className="form-label small fw-semibold">Nombre *</label>
                  <input
                    id="platoNombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={cambiar('nombre')}
                    placeholder="Ej. Lomo saltado"
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-7">
                    <label htmlFor="platoCategoria" className="form-label small fw-semibold">Categoría *</label>
                    <select
                      id="platoCategoria"
                      className="form-select"
                      value={form.categoria}
                      onChange={cambiar('categoria')}
                    >
                      {CATEGORIAS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-5">
                    <label htmlFor="platoPrecio" className="form-label small fw-semibold">Precio (S/) *</label>
                    <input
                      id="platoPrecio"
                      type="number"
                      min="0"
                      step="0.50"
                      className="form-control"
                      value={form.precio}
                      onChange={cambiar('precio')}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="platoDescripcion" className="form-label small fw-semibold">Descripción *</label>
                  <textarea
                    id="platoDescripcion"
                    rows="3"
                    className="form-control"
                    value={form.descripcion}
                    onChange={cambiar('descripcion')}
                    placeholder="Ingredientes o acompañamientos"
                  />
                </div>

                <div className="mb-3">
                  <span className="form-label small fw-semibold d-block">Foto del plato</span>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="foto-plato-preview">
                      {form.imagen ? <FotoPlato key={form.imagen} plato={form} alt="Vista previa" /> : <span className="text-muted small">Sin foto</span>}
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <label htmlFor="platoFoto" className="btn btn-sm btn-outline-primary mb-0">
                        <i className="fas fa-upload me-1"></i> Subir foto
                      </label>
                      <input
                        id="platoFoto"
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={async (e) => {
                          const archivo = e.target.files?.[0];
                          e.target.value = '';
                          if (!archivo) return;
                          try {
                            const imagen = await reducirFoto(archivo);
                            setForm((prev) => ({ ...prev, imagen }));
                          } catch {
                            setError('No se pudo leer la imagen. Prueba con otra foto.');
                          }
                        }}
                      />
                      {form.imagen && (
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setForm((prev) => ({ ...prev, imagen: '' }))}>
                          Quitar foto
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-1" aria-label="Elegir de la galería">
                    {galeria.map((src) => (
                      <button
                        key={src}
                        type="button"
                        className={`foto-galeria ${form.imagen === src ? 'activa' : ''}`}
                        onClick={() => setForm((prev) => ({ ...prev, imagen: src }))}
                        title="Usar esta foto"
                      >
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    id="platoDisponible"
                    className="form-check-input"
                    type="checkbox"
                    checked={form.disponible}
                    onChange={cambiar('disponible')}
                  />
                  <label htmlFor="platoDisponible" className="form-check-label">
                    Disponible (se muestra en el menú)
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-brand flex-grow-1 fw-semibold">
                    {editandoId ? 'Guardar cambios' : 'Registrar plato'}
                  </button>
                  {editandoId && (
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
                <h2 className="h5 fw-bold mb-0">Platos registrados ({lista.length})</h2>
                <select
                  className="form-select form-select-sm w-auto"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  aria-label="Filtrar por categoría"
                >
                  <option>Todas</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Plato</th>
                      <th>Categoría</th>
                      <th className="text-end">Precio</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No hay platos en esta categoría.
                        </td>
                      </tr>
                    )}
                    {lista.map((p) => (
                      <tr key={p.id} className={p.disponible ? '' : 'opacity-50'}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FotoPlato plato={p} alt="" className="foto-plato-mini" />
                            <div className="fw-semibold">{p.nombre}</div>
                          </div>
                          <div className="small text-muted">{p.descripcion}</div>
                        </td>
                        <td className="small">{p.categoria}</td>
                        <td className="text-end text-nowrap">{soles(p.precio)}</td>
                        <td>
                          <button
                            type="button"
                            className={`badge border-0 ${p.disponible ? 'text-bg-success' : 'text-bg-secondary'}`}
                            onClick={() => cambiarDisponible(p.id)}
                            title="Clic para cambiar"
                          >
                            {p.disponible ? 'Disponible' : 'Oculto'}
                          </button>
                        </td>
                        <td className="text-end text-nowrap">
                          {porEliminar === p.id ? (
                            <>
                              <span className="small me-2">¿Eliminar?</span>
                              <button type="button" className="btn btn-sm btn-danger me-1" onClick={() => confirmarEliminar(p.id)}>
                                Sí
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setPorEliminar(null)}>
                                No
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => editar(p)}>
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPorEliminar(p.id)}>
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
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={restaurarMenu}>
                  Restaurar menú de ejemplo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionPlatos;

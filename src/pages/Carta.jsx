import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIAS } from '../hooks/useMenu'
import FotoPlato from '../components/FotoPlato'

const iconos = {
  Entradas: '🥗',
  'Platos de fondo': '🍲',
  Postres: '🍮',
  Bebidas: '🥤',
}

const soles = (n) => `S/ ${Number(n).toFixed(2)}`

// Foto cuadrada del plato (nunca queda en blanco)
function FotoCuadrada({ plato }) {
  return (
    <div className="foto-cuadrada">
      <FotoPlato plato={plato} />
    </div>
  )
}

// Página pública del menú. Los platos se administran desde el panel (Gestionar Platos).
function Carta({ platos }) {
  const [filtro, setFiltro] = useState('Todos')

  const visibles = platos.filter((p) => p.disponible)
  const categorias = CATEGORIAS.filter((c) => filtro === 'Todos' || c === filtro)
  const creditos = visibles.filter((p) => p.credito)

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <span className="badge rounded-pill text-bg-warning mb-3 px-3 py-2">NUESTRA CARTA</span>
        <h1 className="fw-bold">Menú Kilimanjaro</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '640px' }}>
          Cocina peruana preparada al momento con ingredientes frescos. Precios en soles, incluyen IGV.
        </p>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {['Todos', ...CATEGORIAS].map((c) => (
          <button
            key={c}
            type="button"
            className={`btn btn-sm rounded-pill ${filtro === c ? 'btn-brand' : 'btn-outline-secondary'}`}
            onClick={() => setFiltro(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {visibles.length === 0 && (
        <p className="text-center text-muted">Por ahora no hay platos disponibles. Vuelve pronto.</p>
      )}

      {categorias.map((cat) => {
        const lista = visibles.filter((p) => p.categoria === cat)
        if (lista.length === 0) return null
        return (
          <section key={cat} className="mb-5">
            <h2 className="h4 fw-bold mb-3 d-flex align-items-center gap-2">
              <span aria-hidden="true">{iconos[cat]}</span> {cat}
              <small className="text-muted fw-normal fs-6">({lista.length})</small>
            </h2>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
              {lista.map((p) => (
                <div className="col" key={p.id}>
                  <div className="card border-0 shadow-sm h-100 plato-card overflow-hidden">
                    <FotoCuadrada plato={p} />
                    <div className="card-body d-flex flex-column p-3">
                      <h3 className="h6 fw-bold mb-1">{p.nombre}</h3>
                      <p className="text-muted small mb-2 plato-descripcion">{p.descripcion}</p>
                      <span className="fw-bold text-brand mt-auto">{soles(p.precio)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <div className="text-center bg-white rounded-4 shadow-sm p-4 p-md-5">
        <h2 className="h4 fw-bold mb-2">¿Te provocó algo?</h2>
        <p className="text-muted mb-4">Separa tu mesa y ven a disfrutarlo.</p>
        <Link to="/reservar" className="btn btn-warning btn-lg fw-semibold">
          Reservar una mesa
        </Link>
      </div>

      {creditos.length > 0 && (
        <details className="small text-muted mt-4">
          <summary>Créditos de las fotos</summary>
          <p className="mb-1 mt-2">
            Fotos de Wikimedia Commons con licencias libres. Autor y licencia de cada foto en su página:
          </p>
          <ul className="mb-0">
            {creditos.map((p) => (
              <li key={p.id}>
                <a href={p.credito} target="_blank" rel="noreferrer">{p.nombre}</a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

export default Carta

import { Link } from 'react-router-dom'

const galeria = [
  { src: '/img/ambiente.jpg', titulo: 'Ambiente cálido', texto: 'Salón principal con iluminación cálida y servicio atento.' },
  { src: '/img/terraza.jpg', titulo: 'Terraza', texto: 'Espacio al aire libre ideal para cenas y celebraciones.' },
  { src: '/img/plato3.jpg', titulo: 'Cocina de autor', texto: 'Platos de temporada preparados por nuestro equipo.' },
]

function Inicio({ mesas: tables = [] }) {
  return (
    <>
      <section className="hero-inicio text-white">
        <div className="hero-overlay">
          <div className="container py-5">
            <span className="badge bg-warning text-dark mb-3">Reservas en línea</span>
            <h1 className="display-4 fw-bold">Bienvenido a KILIMANJARO</h1>
            <p className="lead col-lg-7">
              Reserva tu mesa de forma rápida y sin llamadas. Consulta la disponibilidad
              por día y horario, elige la mesa según tu número de personas y recibe
              confirmación al instante.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/reservar" className="btn btn-warning btn-lg fw-semibold">
                Reservar una mesa
              </Link>
              <Link to="/menu" className="btn btn-outline-light btn-lg">
                Ver nuestro menú
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">Nuestro restaurante</h2>
            <p className="text-muted">
              En KILIMANJARO combinamos una cocina de temporada con un servicio que
              cuida cada detalle. Nuestro sistema de reservas evita duplicados y
              conflictos de horario para que disfrutes sin contratiempos.
            </p>
            <ul className="list-unstyled row g-3 mt-4">
              <li className="col-6 d-flex align-items-center gap-2">
                <span className="dot-icon" aria-hidden="true">🍽️</span>
                <span>8 mesas disponibles</span>
              </li>
              <li className="col-6 d-flex align-items-center gap-2">
                <span className="dot-icon" aria-hidden="true">👥</span>
                <span>Capacidad de 2 a 8 personas</span>
              </li>
              <li className="col-6 d-flex align-items-center gap-2">
                <span className="dot-icon" aria-hidden="true">🌿</span>
                <span>Zona terraza e interior</span>
              </li>
              <li className="col-6 d-flex align-items-center gap-2">
                <span className="dot-icon" aria-hidden="true">⏱️</span>
                <span>Almuerzo y cena</span>
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <img src="/img/hero.jpg" alt="Interior del restaurante Kilimanjaro" className="img-fluid rounded-4 shadow-sm w-100 galeria-img" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <h2 className="fw-bold mb-4 text-center">Conoce nuestro espacio</h2>
        <div className="row g-4">
          {galeria.map((g) => (
            <div className="col-6 col-md-4" key={g.titulo}>
              <div className="card h-100 border-0 shadow-sm">
                <img src={g.src} className="card-img-top galeria-img" alt={g.titulo} loading="lazy" />
                <div className="card-body">
                  <h3 className="h6 fw-bold mb-1">{g.titulo}</h3>
                  <p className="text-muted small mb-0">{g.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <h2 className="fw-bold mb-4 text-center">Nuestras mesas</h2>
        <div className="row g-3">
          {tables.map((t) => (
            <div className="col-6 col-md-3" key={t.id}>
              <div className="card border-0 shadow-sm text-center h-100">
                <div className="card-body">
                  <span className="fs-4" aria-hidden="true">🍽️</span>
                  <h3 className="h6 fw-bold mt-2 mb-1">Mesa {t.id}</h3>
                  <p className="text-muted small mb-0">{t.capacity} personas · {t.zone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-dark text-white">
        <div className="container py-5 text-center">
          <h2 className="fw-bold">¿Listo para reservar?</h2>
          <p className="text-white-50 mb-4">Tu mesa te espera. Confirma en segundos.</p>
          <Link to="/reservar" className="btn btn-warning btn-lg fw-semibold">
            Ir al calendario de reservas
          </Link>
        </div>
      </section>
    </>
  )
}

export default Inicio

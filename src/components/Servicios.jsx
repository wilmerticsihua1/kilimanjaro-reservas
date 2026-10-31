
import { Link } from 'react-router-dom'

const servicios = [
  {
    imagen: '/img/plato1.jpg',
    titulo: 'Experiencia gastronómica',
    texto: 'Disfruta de una propuesta gastronómica preparada con dedicación, sabores que invitan a volver y una presentación que cuida cada detalle.'
  },
  {
    imagen: '/img/plato2.jpg',
    titulo: 'Atención personalizada',
    texto: 'Nuestro objetivo es hacerte sentir bienvenido desde el primer momento, con una atención amable y atenta a tus necesidades.'
  },
  {
    imagen: '/img/plato3.jpg',
    titulo: 'Reservas de mesas',
    texto: 'Organiza tu visita con anticipación y reserva tu mesa para disfrutar de una comida agradable sin complicaciones.'
  }
]

export default function Servicios() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge rounded-pill text-bg-warning mb-3 px-3 py-2">
          RESTAURANTE KILIMANJARO
        </span>

        <h1 className="fw-bold mb-3">Nuestros servicios</h1>

        <p className="lead text-secondary mx-auto" style={{ maxWidth: '800px' }}>
          Más que un restaurante, un lugar para disfrutar,
          compartir y crear buenos recuerdos. En Kilimanjaro
          nos esforzamos por brindarte una experiencia agradable,
          con atención cordial y momentos que merecen repetirse.
        </p>
      </div>

      <div className="row g-4">
        {servicios.map((servicio, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={servicio.titulo}>
            <div className="card h-100 border-0 shadow-sm">
              <img
                src={servicio.imagen}
                className="card-img-top galeria-img"
                alt={servicio.titulo}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              <div className="card-body p-4">
                <span className="text-warning fw-bold">
                  SERVICIO {String(index + 1).padStart(2, '0')}
                </span>

                <h5 className="card-title fw-bold mt-2">
                  {servicio.titulo}
                </h5>

                <p className="card-text text-secondary mb-0">
                  {servicio.texto}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-light rounded-4 p-4 p-md-5 mt-5">
        <h2 className="fw-bold mb-3">
          ¡Te esperamos en Kilimanjaro!
        </h2>

        <p className="text-secondary mb-4">
          Comparte una buena comida, disfruta de una atención
          especial y vive momentos agradables con las personas
          que más quieres.
        </p>

        <Link to="/reservar" className="btn btn-warning btn-lg fw-semibold">
          Reserva tu mesa
        </Link>
      </div>
    </div>
  )
}

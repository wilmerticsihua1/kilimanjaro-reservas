import { useState } from 'react'

const contactos = [
  { icono: '📍', texto: 'Av. Primavera 464, Santiago de Surco 15038, Perú' },
  { icono: '📞', texto: '(01) 3727985' },
  { icono: '✉️', texto: 'mail@miproyecto.com' },
]

const redes = [
  { nombre: 'Twitter', url: 'https://twitter.com' },
  { nombre: 'Facebook', url: 'https://facebook.com' },
  { nombre: 'YouTube', url: 'https://youtube.com' },
  { nombre: 'Instagram', url: 'https://instagram.com' },
  { nombre: 'TikTok', url: 'https://tiktok.com' },
  { nombre: 'WhatsApp', url: 'https://wa.me/' },
]

const initialForm = { nombre: '', email: '', asunto: '', mensaje: '' }

export default function Contacto() {
  const [form, setForm] = useState(initialForm)
  const [enviado, setEnviado] = useState(false)

  const update = (field) => (ev) => {
    setForm((prev) => ({ ...prev, [field]: ev.target.value }))
    setEnviado(false)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    setEnviado(true)
    setForm(initialForm)
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-md-12 text-center">
          <h1 className="fw-bold">Contacto</h1>
          <p className="mt-3">Puedes usar los siguientes medios para contactarnos.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <h4 className="mb-4">Formulario</h4>

          {enviado && (
            <div className="alert alert-success" role="status">
              ¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="nya" className="form-label fw-semibold">Nombres y Apellidos</label>
              <input
                type="text"
                className="form-control"
                id="nya"
                aria-describedby="nyaHelp"
                value={form.nombre}
                onChange={update('nombre')}
                required
              />
              <div id="nyaHelp" className="form-text">Ejemplo: Carlos Torres Rojas</div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                value={form.email}
                onChange={update('email')}
                required
              />
              <div id="emailHelp" className="form-text">Ejemplo: miemail@mail.com</div>
            </div>
            <div className="mb-3">
              <label htmlFor="asunto" className="form-label fw-semibold">Asunto</label>
              <input
                type="text"
                className="form-control"
                id="asunto"
                value={form.asunto}
                onChange={update('asunto')}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label fw-semibold">Mensaje</label>
              <textarea
                className="form-control"
                id="mensaje"
                rows="3"
                value={form.mensaje}
                onChange={update('mensaje')}
                required
              />
            </div>
            <button type="submit" className="btn btn-brand fw-semibold">Enviar mensaje</button>
          </form>
        </div>

        <div className="col-md-6">
          <h4 className="mb-4">Datos de Contacto</h4>
          {contactos.map((c) => (
            <div className="mb-3 d-flex align-items-center gap-2" key={c.texto}>
              <span className="fs-5" aria-hidden="true">{c.icono}</span>
              <span>{c.texto}</span>
            </div>
          ))}

          <h4 className="mt-4 mb-3">Redes Sociales</h4>
          <ul className="list-inline d-flex flex-wrap gap-2 mb-0">
            {redes.map((r) => (
              <li className="list-inline-item" key={r.nombre}>
                <a
                  href={r.url}
                  className="btn btn-sm btn-outline-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

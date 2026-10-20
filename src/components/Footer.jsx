const anio = new Date().getFullYear()

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <h5 className="fw-bold mb-2">🍽️ Restaurante Kilimanjaro</h5>

        <p className="mb-2">
          Compartimos buenos momentos alrededor de la mesa.
        </p>

        <p className="text-white-50 small mb-2">
          Calidad, sabor y una atención dedicada a cada cliente.
        </p>

        <hr className="border-secondary" />

        <p className="text-white-50 small mb-0">
          © {anio} Restaurante Kilimanjaro.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer

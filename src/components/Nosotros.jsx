
import React from 'react'

export default function Nosotros() {
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>Nosotros</h1>
          <p className="lead">
            Restaurante Kilimanjaro: sabor, calidad y una
            experiencia especial en cada visita.
          </p>
        </div>
      </div>

      <div className="row align-items-center mb-5">
        <div className="col-md-12">
          <img
            src="/img/hero.jpg"
            className="img-fluid rounded shadow-sm w-100"
            alt="Restaurante Kilimanjaro"
          />

          <p className="mt-3 text-justify">
            En el restaurante Kilimanjaro trabajamos para ofrecer
            a nuestros clientes una experiencia gastronómica
            agradable, donde la calidad de los alimentos, la buena
            atención y un ambiente acogedor sean parte fundamental
            de cada visita. Nos esforzamos por brindar un servicio
            amable y atento, procurando que cada persona disfrute
            de sus comidas y comparta momentos especiales con
            familiares y amigos. Nuestro compromiso es mejorar
            continuamente, cuidar cada detalle y generar confianza
            en quienes nos eligen. En Kilimanjaro creemos que una
            buena experiencia no depende únicamente de la comida,
            sino también del trato y la atención que recibe cada
            cliente.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <img
            src="/img/ambiente.jpg"
            className="img-fluid rounded shadow-sm"
            alt="Objetivo del restaurante"
          />
          <h4 className="text-center mt-3">Objetivo</h4>
          <p>
            Brindar un servicio gastronómico de calidad que
            satisfaga las necesidades de nuestros clientes,
            ofreciendo alimentos preparados con dedicación,
            atención cordial y un ambiente adecuado para
            disfrutar de cada ocasión. Asimismo, buscamos
            fortalecer la confianza de nuestros visitantes
            mediante un servicio eficiente y una mejora
            constante de nuestros procesos.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <img
            src="/img/terraza.jpg"
            className="img-fluid rounded shadow-sm"
            alt="Misión del restaurante"
          />
          <h4 className="text-center mt-3">Misión</h4>
          <p>
            Ofrecer a nuestros clientes una experiencia
            gastronómica satisfactoria, combinando calidad,
            responsabilidad y una atención personalizada.
            En Kilimanjaro buscamos atender a cada visitante
            con respeto y amabilidad, manteniendo el compromiso
            de brindar un servicio que motive a nuestros
            clientes a regresar y recomendarnos.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <img
            src="/img/plato3.jpg"
            className="img-fluid rounded shadow-sm"
            alt="Visión del restaurante"
          />
          <h4 className="text-center mt-3">Visión</h4>
          <p>
            Ser un restaurante reconocido por la calidad de
            sus productos, la excelencia en la atención y la
            satisfacción de sus clientes. Aspiramos a crecer
            de manera sostenible, innovar en nuestros servicios
            y consolidar una relación duradera con nuestros
            visitantes, destacándonos por ofrecer experiencias
            agradables en cada comida.
          </p>
        </div>
      </div>
    </div>
  )
}

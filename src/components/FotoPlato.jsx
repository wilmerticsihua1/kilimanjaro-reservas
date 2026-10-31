import { useState } from 'react'
import { FOTOS_RESPALDO } from '../hooks/useMenu'

// Foto de un plato que nunca queda en blanco:
// 1) foto de 500 px  2) foto original  3) foto local de la categoría (sin internet)
function FotoPlato({ plato, className = '', alt }) {
  const fuentes = [plato.imagen, plato.imagenOriginal, FOTOS_RESPALDO[plato.categoria] ?? '/img/plato1.jpg']
    .filter(Boolean)
  const [intento, setIntento] = useState(0)

  return (
    <img
      key={fuentes[intento]}
      src={fuentes[Math.min(intento, fuentes.length - 1)]}
      alt={alt ?? plato.nombre}
      className={className}
      loading="lazy"
      onError={() => setIntento((i) => (i < fuentes.length - 1 ? i + 1 : i))}
    />
  )
}

export default FotoPlato

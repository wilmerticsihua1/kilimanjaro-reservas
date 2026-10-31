import { Link } from 'react-router-dom';

// Título + migas de pan de cada página del panel (igual que el modelo SB Admin)
function Encabezado({ titulo, actual, descripcion }) {
  return (
    <>
      <h1 className="mt-4">{titulo}</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/panel">Dashboard</Link>
        </li>
        <li className="breadcrumb-item active">{actual ?? titulo}</li>
      </ol>
      {descripcion && <p className="text-muted mt-n2 mb-4">{descripcion}</p>}
    </>
  );
}

export default Encabezado;

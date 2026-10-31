import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Plantilla de la web pública: header + contenido + footer
function PublicLayout({ usuario, onLogout }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header usuario={usuario} onLogout={onLogout} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;

import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Panelbarra from '../Panelbarra';
import Panelmenu from '../Panelmenu';
import './admin.css';

// Plantilla del Panel Administrativo (modelo SB Admin del profesor).
// NO usa el Header ni el Footer de la web: solo la barra superior (Panelbarra),
// el menú lateral (Panelmenu) y el contenido de cada opción, que se muestra
// aquí mismo con <Outlet />.
function AdminLayout({ isAdmin, onLogout, pendientes }) {
  const [menuOculto, setMenuOculto] = useState(false);

  // Protección: si no inició sesión, lo manda al login
  if (!isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className={`sb-nav-fixed admin-app ${menuOculto ? 'sb-sidenav-toggled' : ''}`}>
      <Panelbarra
        onToggleMenu={() => setMenuOculto((v) => !v)}
        onLogout={onLogout}
      />

      <div id="layoutSidenav">
        <Panelmenu
          pendientes={pendientes}
          onNavegar={() => {
            // En celulares el menú se cierra al elegir una opción
            if (window.innerWidth < 992) setMenuOculto(false);
          }}
        />

        <div id="layoutSidenav_content">
          <main>
            <Outlet />
          </main>

          {/* Pie de página igual al modelo del profesor */}
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Your Website 2023</div>
                <div>
                  <a href="#">Privacy Policy</a>
                  &middot;
                  <a href="#">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

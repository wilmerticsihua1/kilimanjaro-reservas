import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Web pública
import PublicLayout from './components/PublicLayout';
import Nosotros from './components/Nosotros';
import Servicios from './components/Servicios';
import Contacto from './components/Contacto';
import Inicio from './pages/Inicio';
import Carta from './pages/Carta';
import Reservar from './pages/Reservar';
import ConsultarReserva from './pages/ConsultarReserva';
import Login from './pages/Login';
import Ingresar from './pages/Ingresar';
import MisReservas from './pages/MisReservas';

// Panel de administración
import AdminLayout from './pages/admin/AdminLayout';
import Panel from './pages/Panel';
import Calendario from './pages/Calendario';
import { Listarmesa } from './components/Listarmesa';
import GestionPlatos from './pages/admin/GestionPlatos';
import Reporte01 from './pages/admin/Reporte01';
import Reporte02 from './pages/admin/Reporte02';
import Reporte03 from './pages/admin/Reporte03';
import Reporte04 from './pages/admin/Reporte04';
import Buscar from './pages/admin/Buscar';

import { useReservations } from './hooks/useReservations';
import { useMenu } from './hooks/useMenu';
import { useMesas } from './hooks/useMesas';
import { useAuth } from './hooks/useAuth';

function App() {
  const {
    reservations,
    error,
    setError,
    addReservation,
    updateReservation,
    cancelReservation,
    setStatus,
    removeReservation,
    resetDemo,
  } = useReservations();

  const menu = useMenu();
  const mesasHook = useMesas();
  const { mesas, mesasReservables } = mesasHook;
  const auth = useAuth();
  const { usuario, isAdmin, login, logout } = auth;

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <>
      <Routes>
        {/* ===== WEB PÚBLICA (con header y footer) ===== */}
        <Route element={<PublicLayout usuario={usuario} onLogout={logout} />}>
          <Route path="/" element={<Inicio mesas={mesasReservables} />} />
          <Route path="/menu" element={<Carta platos={menu.platos} />} />
          <Route
            path="/reservar"
            element={
              <Reservar
                usuario={usuario}
                reservations={reservations}
                mesas={mesasReservables}
                error={error}
                setError={setError}
                addReservation={addReservation}
              />
            }
          />
          <Route path="/mi-reserva" element={<ConsultarReserva reservations={reservations} />} />
          <Route
            path="/ingresar"
            element={<Ingresar usuario={usuario} onLogin={login} onRegistrar={auth.registrar} />}
          />
          <Route
            path="/mis-reservas"
            element={<MisReservas usuario={usuario} reservations={reservations} />}
          />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
        </Route>

        {/* ===== LOGIN (sin header ni footer) ===== */}
        <Route path="/login" element={<Login isAdmin={isAdmin} onLogin={login} />} />

        {/* ===== PANEL DE ADMINISTRACIÓN (sin header ni footer de la web) ===== */}
        <Route
          path="/panel"
          element={
            <AdminLayout
              isAdmin={isAdmin}
              onLogout={logout}
              pendientes={reservations.filter((r) => r.status === 'pending').length}
            />
          }
        >
          <Route
            index
            element={<Panel reservations={reservations} platos={menu.platos} mesas={mesas} />}
          />
          <Route path="mesas" element={<Listarmesa {...mesasHook} setToast={setToast} />} />
          <Route
            path="reservas"
            element={
              <Calendario
                reservations={reservations}
                mesas={mesas}
                mesasReservables={mesasReservables}
                error={error}
                setError={setError}
                addReservation={addReservation}
                updateReservation={updateReservation}
                cancelReservation={cancelReservation}
                setStatus={setStatus}
                removeReservation={removeReservation}
                resetDemo={resetDemo}
                setToast={setToast}
              />
            }
          />
          <Route
            path="platos"
            element={<GestionPlatos {...menu} setToast={setToast} />}
          />
          <Route path="reporte01" element={<Reporte01 reservations={reservations} />} />
          <Route path="reporte02" element={<Reporte02 reservations={reservations} />} />
          <Route path="reporte03" element={<Reporte03 reservations={reservations} mesas={mesas} />} />
          <Route path="reporte04" element={<Reporte04 platos={menu.platos} />} />
          <Route
            path="buscar"
            element={<Buscar reservations={reservations} platos={menu.platos} />}
          />
          <Route path="*" element={<Navigate to="/panel" replace />} />
        </Route>

        {/* Rutas antiguas: se redirigen al panel */}
        <Route path="/reservas" element={<Navigate to="/reservar" replace />} />
        <Route path="/listarmesa" element={<Navigate to="/panel/mesas" replace />} />
        <Route path="/reporte01" element={<Navigate to="/panel/reporte01" replace />} />
        <Route path="/reporte02" element={<Navigate to="/panel/reporte02" replace />} />
        <Route path="/reporte03" element={<Navigate to="/panel/reporte03" replace />} />
        <Route path="/reporte04" element={<Navigate to="/panel/reporte04" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {toast && (
        <div
          className="toast-container position-fixed top-50 start-50 translate-middle p-3"
          style={{ zIndex: 1080 }}
        >
          <div className="toast show text-bg-success border-0" role="status" aria-live="polite">
            <div className="toast-body fw-semibold">{toast}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

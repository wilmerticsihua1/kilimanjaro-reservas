import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Nosotros from './components/Nosotros';
import Servicios from './components/Servicios';
import Contacto from './components/Contacto';
import Inicio from './pages/Inicio';
import Calendario from './pages/Calendario';
import { useReservations } from './hooks/useReservations';
import { todayISO } from './data/reservationLogic';

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

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const statsToday = useMemo(
    () => reservations.filter((r) => r.date === todayISO() && r.status !== 'cancelled').length,
    [reservations]
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header statsToday={statsToday} />

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route
            path="/reservas"
            element={
              <Calendario
                reservations={reservations}
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
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>

      {toast && (
        <div className="toast-container position-fixed top-50 start-50 translate-middle p-3" style={{ zIndex: 1080 }}>
          <div className="toast show text-bg-success border-0" role="status" aria-live="polite">
            <div className="toast-body fw-semibold">{toast}</div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Calendario from './pages/Calendario'
import Inicio from './pages/Inicio'
import { useReservations } from './hooks/useReservations'
import { DURATION_MINUTES, todayISO, formatDateLong } from './data/reservationLogic'

function App() {
  const {
    reservations,
    error,
    setError,
    addReservation,
    cancelReservation,
    setStatus,
    removeReservation,
    resetDemo,
  } = useReservations()

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
      <Header statsToday={reservations.filter((r) => r.date === todayISO() && r.status !== 'cancelled').length} />

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
                cancelReservation={cancelReservation}
                setStatus={setStatus}
                removeReservation={removeReservation}
                resetDemo={resetDemo}
                setToast={setToast}
              />
            }
          />
        </Routes>
      </main>

      <footer className="bg-dark text-white-50 py-3 mt-auto">
        <div className="container text-center small">
          MesaFácil · Prototipo funcional React + Bootstrap · {formatDateLong(todayISO())} · Duración estándar {DURATION_MINUTES} min
        </div>
      </footer>

      {toast && (
        <div className="toast show align-items-center text-bg-dark position-fixed bottom-0 start-50 translate-middle-x mb-3" role="status" style={{ zIndex: 1080 }}>
          <div className="d-flex">
            <div className="toast-body">✅ {toast}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

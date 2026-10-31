import { HOURS, todayISO, nextDays } from '../data/reservationLogic'

function CalendarView({ selectedDate, onSelectDate, reservations, onPickSlot, publico = false }) {
  const today = todayISO()
  const days = nextDays(7)

  const countAt = (iso, hour) =>
    reservations.filter((r) => r.date === iso && r.time === hour && r.status !== 'cancelled').length

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="mb-3">
          <h2 className="h5 fw-bold mb-1">Disponibilidad por día y horario</h2>
          <p className="text-muted small mb-0">Selecciona un horario libre para completar los datos de la reserva.</p>
        </div>

        <div className="d-flex gap-2 overflow-auto pb-2 mb-3" role="tablist" aria-label="Días">
          {days.map((d) => {
            const active = selectedDate === d.iso
            return (
              <button
                key={d.iso}
                type="button"
                role="tab"
                aria-selected={active}
                className={`day-pill ${active ? 'day-pill-active' : ''}`}
                onClick={() => onSelectDate(d.iso)}
              >
                <span className="text-uppercase text-muted" style={{ fontSize: '0.66rem' }}>{d.day}</span>
                <span className="fs-5 fw-bold">{d.num}</span>
                {d.iso === today && <span className="day-tag">hoy</span>}
              </button>
            )
          })}
        </div>

        <div className="row g-2">
          {HOURS.map((hour) => {
            const used = countAt(selectedDate, hour)
            const full = used >= 4
            return (
              <div className="col-6 col-sm-4 col-md-3" key={hour}>
                <button
                  type="button"
                  className={`slot-btn w-100 ${full ? 'slot-full' : 'slot-free'}`}
                  disabled={full}
                  onClick={() => onPickSlot(selectedDate, hour)}
                >
                  <span className="fw-bold">{hour}</span>
                  <span className={`d-block ${full ? 'text-danger fw-semibold' : 'text-muted'}`} style={{ fontSize: '0.68rem' }}>
                    {full ? 'Alta demanda' : publico ? 'Disponible' : `${used} reserva(s)`}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CalendarView

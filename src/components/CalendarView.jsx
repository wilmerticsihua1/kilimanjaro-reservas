import { HOURS, todayISO, nextDays } from '../data/reservationLogic'

function CalendarView({ selectedDate, onSelectDate, reservations, onPickSlot }) {
  const today = todayISO()
  const days = nextDays(7)

  const countAt = (iso, hour) =>
    reservations.filter(
      (r) => r.date === iso && r.time === hour && r.status !== 'cancelled'
    ).length

  return (
    <section className="card calendar">
      <div className="card-head">
        <h2>Disponibilidad por día y horario</h2>
        <p>Selecciona un horario libre para iniciar una reserva.</p>
      </div>

      <div className="day-strip" role="tablist" aria-label="Días">
        {days.map((d) => (
          <button
            key={d.iso}
            type="button"
            role="tab"
            aria-selected={selectedDate === d.iso}
            className={selectedDate === d.iso ? 'day-pill active' : 'day-pill'}
            onClick={() => onSelectDate(d.iso)}
          >
            <span className="day-name">{d.day}</span>
            <span className="day-num">{d.num}</span>
            {d.iso === today && <span className="day-tag">hoy</span>}
          </button>
        ))}
      </div>

      <div className="slot-grid">
        {HOURS.map((hour) => {
          const used = countAt(selectedDate, hour)
          const full = used >= 4
          return (
            <button
              key={hour}
              type="button"
              className={full ? 'slot full' : 'slot free'}
              disabled={full}
              onClick={() => onPickSlot(selectedDate, hour)}
            >
              <span className="slot-time">{hour}</span>
              <span className="slot-info">{full ? 'Alta demanda' : `${used} reserva(s)`}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CalendarView

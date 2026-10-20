import { useMemo, useState } from 'react'
import { HOURS, DURATION_MINUTES, addMinutes, availableTables, formatDateLong, todayISO } from '../data/reservationLogic'

const emptyDraft = (date, time) => ({
  clientName: '',
  clientPhone: '',
  date,
  time,
  guests: 2,
  tableId: '',
  notes: '',
  duration: DURATION_MINUTES,
})

export function ReservationForm({ initialDate, initialTime, reservations, onAdd, error, onClearError, editing, onUpdate }) {
  const [draft, setDraft] = useState(() => (editing ? { ...editing } : emptyDraft(initialDate, initialTime)))
  const [touched, setTouched] = useState(false)

  const tables = useMemo(
    () => availableTables(reservations, draft.date, draft.time, draft.duration, Number(draft.guests) || 1),
    [reservations, draft.date, draft.time, draft.duration, draft.guests]
  )

  const selectedTableId = useMemo(() => {
    if (draft.tableId && tables.some((t) => t.id === Number(draft.tableId))) return Number(draft.tableId)
    return tables.length ? tables[0].id : ''
  }, [draft.tableId, tables])

  const errors = useMemo(() => {
    const e = {}
    if (!draft.clientName.trim()) e.clientName = 'Ingrese el nombre del cliente'
    if (!/^[0-9+\s-]{6,}$/.test(draft.clientPhone.trim())) e.clientPhone = 'Teléfono inválido'
    if (!draft.date) e.date = 'Seleccione una fecha'
    if (!draft.time) e.time = 'Seleccione un horario'
    if (!selectedTableId) e.tableId = 'No hay mesas disponibles para esa capacidad'
    return e
  }, [draft, selectedTableId])

  const update = (field) => (ev) => {
    const value = ev.target.value
    setDraft((prev) => ({ ...prev, [field]: value }))
    onClearError?.()
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    const payload = { ...draft, guests: Number(draft.guests), tableId: Number(selectedTableId) }
    const result = editing ? onUpdate?.(payload) : onAdd(payload)
    if (result?.ok) {
      setDraft(emptyDraft(draft.date, draft.time))
      setTouched(false)
    }
  }

  const fieldError = (name) => (touched ? errors[name] : null)

  return (
    <section className="card form-card" aria-labelledby="form-title">
      <div className="card-head">
        <h2 id="form-title">{editing ? 'Editar reserva' : 'Nueva reserva'}</h2>
        <p>{formatDateLong(draft.date)} · {draft.time} → {addMinutes(draft.time, draft.duration)}</p>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="clientName">Nombre del cliente *</label>
          <input
            id="clientName"
            value={draft.clientName}
            onChange={update('clientName')}
            placeholder="Ej. María López"
            aria-invalid={Boolean(fieldError('clientName'))}
          />
          {fieldError('clientName') && <span className="hint error-text">{fieldError('clientName')}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="clientPhone">Teléfono *</label>
            <input
              id="clientPhone"
              value={draft.clientPhone}
              onChange={update('clientPhone')}
              placeholder="987654321"
              inputMode="tel"
              aria-invalid={Boolean(fieldError('clientPhone'))}
            />
            {fieldError('clientPhone') && <span className="hint error-text">{fieldError('clientPhone')}</span>}
          </div>

          <div className="field">
            <label htmlFor="guests">Personas *</label>
            <input
              id="guests"
              type="number"
              min="1"
              max="12"
              value={draft.guests}
              onChange={update('guests')}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Fecha *</label>
            <input
              id="date"
              type="date"
              value={draft.date}
              min={todayISO()}
              onChange={update('date')}
              aria-invalid={Boolean(fieldError('date'))}
            />
          </div>

          <div className="field">
            <label htmlFor="time">Hora *</label>
            <select id="time" value={draft.time} onChange={update('time')} aria-invalid={Boolean(fieldError('time'))}>
              {HOURS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <span className="label-text">Mesa sugerida *</span>
          <div className="table-options" role="radiogroup" aria-label="Mesa">
            {tables.length === 0 && (
              <p className="hint error-text">No hay mesas libres para {draft.guests} personas a esa hora.</p>
            )}
            {tables.map((t) => (
              <label key={t.id} className={selectedTableId === t.id ? 'table-chip active' : 'table-chip'}>
                <input
                  type="radio"
                  name="table"
                  value={t.id}
                  checked={selectedTableId === t.id}
                  onChange={update('tableId')}
                />
                <span>Mesa {t.id}</span>
                <small>{t.capacity} pers · {t.zone}</small>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            rows="2"
            value={draft.notes}
            onChange={update('notes')}
            placeholder="Alergias, ocasión especial, ubicación preferida…"
          />
        </div>

        <button type="submit" className="btn primary" disabled={tables.length === 0}>
          {editing ? 'Guardar cambios' : 'Confirmar reserva'}
        </button>
      </form>
    </section>
  )
}

export default ReservationForm

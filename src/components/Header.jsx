function Header({ view, onChangeView, stats }) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true">🍽️</span>
        <div>
          <h1>MesaFácil</h1>
          <p>Gestión de reservas para restaurantes</p>
        </div>
      </div>

      <nav className="tabs" aria-label="Secciones">
        <button
          type="button"
          className={view === 'calendar' ? 'tab active' : 'tab'}
          aria-current={view === 'calendar'}
          onClick={() => onChangeView('calendar')}
        >
          Calendario
        </button>
        <button
          type="button"
          className={view === 'admin' ? 'tab active' : 'tab'}
          aria-current={view === 'admin'}
          onClick={() => onChangeView('admin')}
        >
          Mis reservas
        </button>
      </nav>

      <div className="header-stats" aria-label="Resumen del día">
        <span className="stat"><strong>{stats.today}</strong> hoy</span>
        <span className="stat"><strong>{stats.confirmed}</strong> confirmadas</span>
      </div>
    </header>
  )
}

export default Header

function Header({ onHome, onBookings }) {
  return (
    <header className="header">
      <button className="brand" onClick={onHome}>
        <span className="brand-icon">🎟️</span>
        TicketEase
      </button>

      <nav className="nav">
        <button onClick={onHome}>Explore Events</button>
        <button onClick={onBookings}>My Bookings</button>
      </nav>
    </header>
  );
}

export default Header;

import { useEffect, useState } from "react";
import Header from "./components/Header";
import EventCard from "./components/EventCard";
import BookingModal from "./components/BookingModal";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load events");
        return response.json();
      })
      .then(setEvents)
      .catch(() => setError("Unable to load events. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  async function loadBookings() {
    try {
      const response = await fetch("http://localhost:5000/api/bookings");
      if (!response.ok) throw new Error("Failed to load bookings");
      const data = await response.json();
      setBookings(data);
    } catch {
      setMessage("Unable to load bookings. Please try again.");
    }
  }

  const categories = [
    "All",
    ...new Set(events.map((event) => event.category))
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.venue.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  async function handleBooking(customer) {
    if (!selectedEvent || bookingLoading) return;

    setBookingLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...customer,
          eventId: selectedEvent.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      setSelectedEvent(null);
      await loadBookings();
      setShowBookings(true);
      setMessage(`Booking successful! Reference: ${data.booking.reference}`);
    } catch (err) {
      setMessage(err.message || "Unable to create booking.");
    } finally {
      setBookingLoading(false);
    }
  }

  function goHome() {
    setShowBookings(false);
    setMessage("");
  }

  async function goToBookings() {
    setShowBookings(true);
    setMessage("");
    await loadBookings();
  }

  return (
    <div className="app">
      <Header onHome={goHome} onBookings={goToBookings} />

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT EXPERIENCE STARTS HERE</span>
            <h1>
              Discover events.
              <br />
              <span>Make memories.</span>
            </h1>
            <p>
              Find exciting events, explore new experiences and
              book your tickets in just a few clicks.
            </p>

            {!showBookings && (
              <button
                className="hero-button"
                onClick={() =>
                  document.getElementById("events")?.scrollIntoView({
                    behavior: "smooth"
                  })
                }
              >
                Explore Events ↓
              </button>
            )}
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-ticket">
              <span>YOUR TICKET</span>
              <span className="ticket-emoji">🎫</span>
              <strong>Great experiences</strong>
              <span>One click away</span>
              <div className="ticket-dots">•••• •••• ••••</div>
            </div>
            <span className="floating-star star-one">✦</span>
            <span className="floating-star star-two">✧</span>
          </div>
        </section>

        {message && (
          <div className="success-message" role="status">
            {message}
          </div>
        )}

        {showBookings ? (
          <section className="section bookings-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR TICKETS</span>
                <h2>My Bookings</h2>
              </div>
              <button className="secondary-button" onClick={goHome}>
                Browse Events
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-state">
                <span>🎟️</span>
                <h3>No bookings yet</h3>
                <p>Your bookings will appear here after you book an event.</p>
                <button className="primary-button" onClick={goHome}>
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <article className="booking-card" key={booking.reference}>
                    <div>
                      <span className="category-tag">Confirmed</span>
                      <h3>{booking.eventTitle}</h3>
                      <p>Booked by: {booking.name}</p>
                      <p>Tickets: {booking.quantity}</p>
                      <p>Reference: {booking.reference}</p>
                    </div>
                    <strong>₹{booking.total}</strong>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="section" id="events">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FIND YOUR NEXT EXPERIENCE</span>
                <h2>Upcoming Events</h2>
                <p className="section-subtitle">
                  Choose an event and reserve your spot.
                </p>
              </div>
              <span className="event-count">
                {filteredEvents.length} events
              </span>
            </div>

            {loading && <p>Loading events...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && (
              <>
                <div className="search-box">
                  <span>⌕</span>
                  <input
                    aria-label="Search events"
                    placeholder="Search by event name or venue..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="category-filters">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={
                        category === item
                          ? "filter-button active"
                          : "filter-button"
                      }
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {filteredEvents.length === 0 ? (
                  <div className="empty-state">
                    <span>🔎</span>
                    <h3>No events found</h3>
                    <p>Try another search term or category.</p>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="event-grid">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onBook={setSelectedEvent}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <span>🎟️ TicketEase</span>
        <p>Discover events. Make memories.</p>
        <small>Student project prototype · Demo bookings only</small>
      </footer>

      <BookingModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onConfirm={handleBooking}
        isSubmitting={bookingLoading}
      />
    </div>
  );
}

export default App;

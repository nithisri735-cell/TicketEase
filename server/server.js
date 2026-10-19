
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const events = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    category: "Technology",
    date: "2026-11-15",
    time: "10:00 AM",
    venue: "KCT Auditorium, Coimbatore",
    price: 299,
    emoji: "💻",
    description: "Explore new technologies and meet innovators."
  },
  {
    id: 2,
    title: "Live Music Night",
    category: "Music",
    date: "2026-11-20",
    time: "6:00 PM",
    venue: "Open Air Theatre, Coimbatore",
    price: 499,
    emoji: "🎸",
    description: "Enjoy an evening filled with music."
  },
  {
    id: 3,
    title: "Startup Pitch Fest",
    category: "Business",
    date: "2026-11-25",
    time: "11:00 AM",
    venue: "Innovation Centre, Coimbatore",
    price: 199,
    emoji: "🚀",
    description: "Discover startup ideas and entrepreneurship."
  },
  {
    id: 4,
    title: "Photography Workshop",
    category: "Workshop",
    date: "2026-12-02",
    time: "2:00 PM",
    venue: "Creative Studio, Coimbatore",
    price: 149,
    emoji: "📸",
    description: "Learn photography basics and creative techniques."
  },
  {
    id: 5,
    title: "Campus Cultural Fest",
    category: "Music",
    date: "2026-12-10",
    time: "5:00 PM",
    venue: "College Ground, Coimbatore",
    price: 249,
    emoji: "🎉",
    description: "Celebrate music, dance and campus culture."
  },
  {
    id: 6,
    title: "AI and Future Workshop",
    category: "Technology",
    date: "2026-12-15",
    time: "9:30 AM",
    venue: "Seminar Hall, Coimbatore",
    price: 199,
    emoji: "🤖",
    description: "Learn about AI applications and future careers."
  }
];

const bookings = [];

app.get("/", (req, res) => {
  res.json({
    message: "TicketEase backend is running!"
  });
});

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const { name, email, quantity, eventId } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) < 1 ||
    Number(quantity) > 10
  ) {
    return res.status(400).json({
      message: "Enter a valid name, email, and quantity from 1 to 10."
    });
  }

  const event = events.find(
    (item) => item.id === Number(eventId)
  );

  if (!event) {
    return res.status(404).json({
      message: "Event not found."
    });
  }

  const booking = {
    reference: `TE-${Date.now().toString().slice(-8)}`,
    name: name.trim(),
    email: email.trim(),
    quantity: Number(quantity),
    eventId: event.id,
    eventTitle: event.title,
    price: event.price,
    total: event.price * Number(quantity),
    bookedAt: new Date().toISOString()
  };

  bookings.unshift(booking);

  res.status(201).json({
    message: "Booking created successfully.",
    booking
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `TicketEase backend running at http://localhost:${PORT}`
    );
  });
}

module.exports = app;

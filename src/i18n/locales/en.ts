const en = {
  nav: { home: "Home", book: "Book" },
  hero: {
    alt: "Indoor surfskate hall – hero image",
    title: "Surfskate Hall – Book Your Flow",
    subtitle:
      "Reserve your slot in our surfskate hall. Simple booking, fair sessions, global community – DE/EN.",
    cta: "Book now",
  },
  features: {
    title: "Why book with us?",
    items: [
      { title: "Flexible Slots", desc: "Hourly sessions from 10am–10pm – pick your perfect time." },
      { title: "Community Vibes", desc: "Meet riders from around the world – surf-style progression." },
      { title: "Fast & Easy", desc: "Book in seconds, instant confirmation – mobile optimized." },
    ],
  },
  booking: {
    title: "Booking",
    subtitle: "Pick a date and a time slot, then enter your details.",
    pickDate: "Pick a date",
    availableSlots: "Available slots",
    selectedDate: "Selected date",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone (optional)",
      level: "Level",
      levelOptions: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
      notes: "Notes (optional)",
      submit: "Book slot",
    },
    success: "Your slot is reserved! We've saved your booking.",
    errors: { selectSlot: "Please select a time slot first.", selectDate: "Please select a date." },
  },
} as const;

export default en;

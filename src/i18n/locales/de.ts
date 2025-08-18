const de = {
  common: {
    back: "Zurück",
    cancel: "Abbrechen",
    submit: "Senden",
    save: "Speichern",
    delete: "Löschen",
    edit: "Bearbeiten",
    create: "Erstellen",
    update: "Aktualisieren",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolgreich",
    required: "Erforderlich"
  },
  hero: {
    title: "Surfskate Hall Wiesbaden",
    subtitle: "Die erste Indoor-Surfskate-Halle in Wiesbaden • Buche jetzt deinen Slot",
    cta: "Jetzt buchen",
    alt: "Surfskate Hall - Indoor-Surfing in Wiesbaden"
  },
  nav: {
    home: "Startseite",
    book: "Buchen",
    about: "Über uns",
    contact: "Kontakt",
    blog: "Blog",
    profile: "Profil",
    login: "Anmelden"
  },
  features: {
    title: "Warum Surfskate Hall?",
    items: [
      {
        title: "Ganzjährig surfen",
        desc: "Egal ob Regen oder Schnee – bei uns surfst du das ganze Jahr über."
      },
      {
        title: "Für alle Levels",
        desc: "Vom Anfänger bis zum Profi – jeder findet hier seinen Flow."
      },
      {
        title: "Professionelle Ausrüstung",
        desc: "Hochwertige Boards und Sicherheitsausrüstung inklusive."
      }
    ]
  },
  booking: {
    title: "Buche deinen Surfskate-Slot",
    subtitle: "Wähle dein Datum und deine bevorzugte Zeit",
    metaDescription: "Surfskate Buchung in Wiesbaden – Slots wählen, Daten eintragen, fertig. Deutsch/Englisch.",
    pickDate: "Datum wählen",
    selectDateDesc: "Wähle dein gewünschtes Datum für die Surfskate Session",
    selectDateFirst: "Bitte wähle zuerst ein Datum aus",
    selectTimeDesc: "Wähle deine bevorzugten Zeiten aus",
    availableSlots: "Verfügbare Slots",
    selectedSlots: "Ausgewählte Slots",
    selectedSlotsCount: "{{count}} Slot(s) ausgewählt",
    selected: "Ausgewählt",
    slot: "Slot",
    slots: "Slots",
    selectedTotal: "gesamt ausgewählt",
    booked: "Belegt",
    sessionReady: "Session bereit",
    sessionsReady: "Sessions bereit",
    personalInfo: "Persönliche Informationen",
    form: {
      name: "Name",
      namePlaceholder: "Dein vollständiger Name",
      email: "E-Mail",
      emailPlaceholder: "deine@email.de",
      phone: "Telefon (optional)",
      phonePlaceholder: "+49 123 456789",
      level: "Erfahrungslevel",
      levelOptions: {
        beginner: "Anfänger",
        intermediate: "Fortgeschritten",
        advanced: "Profi"
      },
      notes: "Anmerkungen (optional)",
      notesPlaceholder: "Besondere Wünsche oder Anmerkungen...",
      submit: "Jetzt buchen"
    },
    errors: {
      selectDate: "Bitte wähle ein Datum aus",
      selectSlot: "Bitte wähle mindestens einen Slot aus"
    },
    proceedingToPayment: "Weiterleitung zur Zahlung...",
    bookNow: "Jetzt buchen",
    summary: "Buchungsübersicht",
    total: "Gesamt",
    proceedToPayment: "Zur Zahlung",
    today: "Heute",
    tomorrow: "Morgen",
    dayFormat: "EEE, d. MMM",
    noSlotsAvailable: "Keine Slots verfügbar",
    selectSlotFirst: "Bitte wähle zuerst einen Slot aus",
    instructions: "Fülle das Formular aus und gehe zur Zahlung, um deine Buchung zu bestätigen.",
    paymentDescription: "Sichere Zahlung über Stripe"
  },
  profile: {
    hello: "Hallo",
    notLoggedIn: "Du bist nicht angemeldet.",
    loginPrompt: "Melde dich an, um dein Profil zu sehen und deine Buchungen zu verwalten.",
    loginButton: "Anmelden",
    changePassword: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Passwort bestätigen",
    updating: "Aktualisiere...",
    updatePassword: "Passwort aktualisieren",
    passwordsNoMatch: "Passwörter stimmen nicht überein",
    passwordTooShort: "Passwort muss mindestens 6 Zeichen lang sein",
    cancelMembership: "Mitgliedschaft kündigen",
    cancelMembershipConfirm: "Mitgliedschaft wirklich kündigen?",
    cancelMembershipDescription: "Diese Aktion kann nicht rückgängig gemacht werden. Deine Premium-Vorteile gehen verloren.",
    canceling: "Kündige...",
    deleteAccount: "Konto löschen",
    deleteAccountConfirm: "Konto wirklich löschen?",
    deleteAccountDescription: "Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden permanent gelöscht.",
    deleting: "Lösche..."
  },
  auth: {
    signIn: "Anmelden",
    signUp: "Registrieren",
    email: "E-Mail",
    password: "Passwort",
    dontHaveAccount: "Noch kein Konto?",
    alreadyHaveAccount: "Bereits ein Konto?",
    forgotPassword: "Passwort vergessen?",
    resetPassword: "Passwort zurücksetzen",
    sendResetEmail: "Reset-E-Mail senden",
    backToLogin: "Zurück zur Anmeldung",
    resetEmailSent: "Reset-E-Mail gesendet!",
    resetEmailSentDesc: "Überprüfe deine E-Mails für Anweisungen zum Zurücksetzen deines Passworts.",
    authError: "Authentifizierungsfehler",
    signUpSuccess: "Registrierung erfolgreich",
    signUpSuccessDesc: "Dein Konto wurde erstellt. Du kannst dich jetzt anmelden.",
    signInSuccess: "Anmeldung erfolgreich",
    signInSuccessDesc: "Willkommen zurück!",
    passwordResetSent: "Passwort-Reset gesendet",
    passwordResetSentDesc: "Überprüfe deine E-Mails für weitere Anweisungen."
  },
  subscription: {
    title: "Premium Mitgliedschaft",
    subtitle: "Unbegrenzter Zugang zur Surfskate Hall",
    price: "29,99 €",
    period: "/Monat",
    benefits: "Was ist enthalten:",
    features: [
      "Unbegrenzter Zugang zur Halle",
      "Vorrangige Buchung von Slots",
      "10% Rabatt auf Equipment",
      "Kostenlose Workshops und Events",
      "Community-Zugang"
    ],
    cta: "Premium werden",
    ctaDescription: "Jederzeit kündbar • Keine Bindung",
    loading: "Lädt...",
    authRequired: "Anmeldung erforderlich",
    authRequiredDesc: "Du musst angemeldet sein, um eine Premium-Mitgliedschaft abzuschließen.",
    whySignUp: "Warum registrieren?",
    signUpBenefits: [
      "Sichere Speicherung deiner Buchungen",
      "Einfache Mitgliedschaftsverwaltung",
      "Exklusive Angebote und Updates",
      "Zugang zur Premium-Community"
    ],
    signInToContinue: "Anmelden um fortzufahren",
    subscribed: "Premium Aktiv",
    currentPlan: "Aktueller Plan",
    expires: "Läuft ab am",
    managePlan: "Mitgliedschaft verwalten"
  },
  admin: {
    title: "Surfskate Hall Admin",
    loading: "Lade Admin Panel...",
    navigation: {
      dashboard: "Dashboard",
      blog: "Blog Verwaltung",
      prices: "Preisverwaltung"
    },
    auth: {
      logout: "Abmelden",
      logoutSuccess: "Erfolgreich abgemeldet",
      logoutDescription: "Sie wurden vom Admin Panel abgemeldet.",
      logoutError: "Abmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      error: "Fehler"
    },
    dashboard: {
      title: "Admin Dashboard",
      subtitle: "Übersicht über alle Buchungen und Finanzen in Echtzeit",
      loading: "Lade Buchungsdaten...",
      totalBookings: "Gesamte Buchungen",
      totalRevenue: "Gesamtumsatz",
      today: "Heute",
      thisMonth: "Dieser Monat",
      confirmedBookings: "Bestätigte Buchungen",
      allConfirmedBookings: "Alle bestätigten Buchungen",
      todayBookings: "Buchungen für heute",
      thisMonthRevenue: "Umsatz diesen Monat",
      allBookingsCount: "Alle Buchungen ({{count}})",
      bookingsDescription: "Übersicht über alle Buchungen in chronologischer Reihenfolge • Aktualisiert in Echtzeit",
      bookingDate: "Buchungsdatum",
      slot: "Slot",
      name: "Name",
      email: "E-Mail",
      level: "Level",
      amount: "Betrag",
      status: "Status",
      created: "Erstellt",
      confirmed: "Bestätigt",
      pending: "Ausstehend",
      noBookings: "Keine Buchungen gefunden",
      loadError: "Fehler beim Laden der Buchungen",
      error: "Fehler",
      unexpectedError: "Ein unerwarteter Fehler ist aufgetreten"
    },
    blogManagement: {
      title: "Blog Verwaltung",
      description: "Verwalten Sie Ihre Blog-Beiträge und Nachrichten",
      error: "Fehler",
      success: "Erfolg",
      fetchError: "Fehler beim Laden der Blog-Beiträge",
      updateSuccess: "Blog-Beitrag erfolgreich aktualisiert",
      createSuccess: "Blog-Beitrag erfolgreich erstellt",
      saveError: "Fehler beim Speichern des Blog-Beitrags",
      deleteSuccess: "Blog-Beitrag erfolgreich gelöscht",
      deleteError: "Fehler beim Löschen des Blog-Beitrags",
      publishSuccess: "Beitrag erfolgreich veröffentlicht",
      unpublishSuccess: "Beitrag erfolgreich unveröffentlicht",
      statusError: "Fehler beim Aktualisieren des Beitragsstatus",
      viewBlog: "Blog anzeigen",
      newPost: "Neuer Beitrag",
      editPost: "Beitrag bearbeiten",
      createPost: "Neuen Beitrag erstellen",
      editDescription: "Aktualisieren Sie Ihren Blog-Beitrag",
      createDescription: "Erstellen Sie einen neuen Blog-Beitrag oder Nachrichtenartikel",
      blogTitle: "Titel",
      excerpt: "Auszug (Optional)",
      excerptPlaceholder: "Kurze Beschreibung des Beitrags...",
      imageUrl: "Bild-URL (Optional)",
      content: "Inhalt",
      contentPlaceholder: "Schreiben Sie hier Ihren Blog-Beitrag...",
      publishImmediately: "Sofort veröffentlichen",
      post: "Beitrag",
      noPosts: "Noch keine Blog-Beiträge",
      noPostsDescription: "Erstellen Sie Ihren ersten Blog-Beitrag, um Neuigkeiten und Updates mit Ihrer Community zu teilen.",
      published: "Veröffentlicht",
      draft: "Entwurf",
      created: "Erstellt",
      updated: "Aktualisiert",
      deletePost: "Beitrag löschen",
      deleteConfirmation: "Sind Sie sicher, dass Sie \"{{title}}\" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
    },
    priceManagement: {
      title: "Preisverwaltung",
      description: "Verwalten Sie Buchungs- und Abonnementpreise, synchronisiert mit Stripe",
      totalPrices: "{{count}} Preise insgesamt",
      newPrice: "Neuer Preis",
      editPrice: "Preis bearbeiten",
      createPrice: "Preis erstellen",
      editDescription: "Bearbeiten Sie den ausgewählten Preis",
      createDescription: "Erstellen Sie einen neuen Preis für Buchungen oder Abonnements",
      type: "Typ",
      typeBooking: "Buchung",
      typeSubscription: "Abonnement",
      name: "Name",
      amount: "Betrag (EUR)",
      active: "Aktiv",
      inactive: "Inaktiv",
      updated: "Aktualisiert",
      syncWithStripe: "Mit Stripe synchronisieren",
      deleteConfirm: "Preis löschen",
      deleteDescription: "Sind Sie sicher, dass Sie \"{{name}}\" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      error: "Fehler",
      success: "Erfolg",
      fetchError: "Fehler beim Laden der Preise",
      saveError: "Fehler beim Speichern des Preises",
      deleteError: "Fehler beim Löschen des Preises",
      syncError: "Fehler bei der Synchronisation mit Stripe",
      createSuccess: "Preis erfolgreich erstellt",
      updateSuccess: "Preis erfolgreich aktualisiert",
      deleteSuccess: "Preis erfolgreich gelöscht",
      syncSuccess: "Erfolgreich mit Stripe synchronisiert",
      noPrices: "Keine Preise konfiguriert",
      noPricesDescription: "Erstellen Sie Ihren ersten Preis für Buchungen oder Abonnements."
    }
  },
  pages: {
    about: {
      title: "Über Surfskate Hall",
      desc: "Die erste Indoor-Surfskate-Halle in Wiesbaden",
      text: "Surfskate Hall bietet einzigartiges Indoor-Surferlebnis mit professioneller Ausrüstung."
    },
    contact: {
      title: "Kontakt",
      desc: "So erreichst du uns.",
      text: "Wir freuen uns auf deinen Besuch oder deine Nachricht!"
    },
    datenschutz: {
      title: "Datenschutzerklärung",
      desc: "Informationen zur Verarbeitung deiner Daten.",
      text: "Wir nehmen den Schutz deiner persönlichen Daten ernst und halten uns an die DSGVO."
    },
    impressum: {
      title: "Impressum",
      desc: "Rechtliche Informationen über Surfskate Hall.",
      text: "Verantwortlich für den Inhalt: Surfskate Hall Wiesbaden"
    },
    terms: {
      title: "Allgemeine Geschäftsbedingungen",
      desc: "Die Nutzungsbedingungen für Surfskate Hall.",
      text: "Diese AGB regeln die Nutzung unserer Einrichtungen und Dienstleistungen."
    },
    widerruf: {
      title: "Widerrufsbelehrung",
      desc: "Hinweise zum Widerrufsrecht für Verbraucher.",
      text: "Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen (Ausnahmen bei terminbezogenen Freizeitdienstleistungen möglich)."
    }
  },
  footer: {
    aboutUs: "Über uns",
    contact: "Kontakt",
    datenschutz: "Datenschutz",
    impressum: "Impressum",
    terms: "AGB",
    widerruf: "Widerruf",
    blog: "Blog",
    copyright: "© 2024 Surfskate Hall Wiesbaden. Alle Rechte vorbehalten."
  },
  errors: {
    notFound: "Seite nicht gefunden",
    notFoundDesc: "Die angeforderte Seite existiert nicht.",
    goHome: "Zur Startseite"
  },
  payment: {
    success: {
      title: "Zahlung erfolgreich!",
      description: "Deine Buchung wurde bestätigt. Du erhältst eine Bestätigungs-E-Mail.",
      bookingConfirmed: "Buchung bestätigt",
      emailSent: "Bestätigungs-E-Mail gesendet",
      returnHome: "Zur Startseite"
    },
    canceled: {
      title: "Zahlung abgebrochen",
      description: "Deine Zahlung wurde abgebrochen. Du kannst es jederzeit erneut versuchen.",
      tryAgain: "Erneut versuchen",
      returnHome: "Zur Startseite"
    }
  },
  actions: {
    edit: "Bearbeiten",
    delete: "Löschen"
  }
} as const;

export default de;
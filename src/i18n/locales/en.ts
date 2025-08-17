const en = {
  common: {
    back: "Back",
    cancel: "Cancel",
    submit: "Submit",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    required: "Required"
  },
  hero: {
    title: "Surfskate Hall Wiesbaden",
    subtitle: "The first indoor surfskate hall in Wiesbaden • Book your slot now",
    cta: "Book now",
    alt: "Surfskate Hall - Indoor surfing in Wiesbaden"
  },
  nav: {
    home: "Home",
    book: "Book",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    profile: "Profile",
    login: "Login"
  },
  features: {
    title: "Why Surfskate Hall?",
    items: [
      {
        title: "Surf all year round",
        desc: "Rain or shine - you can surf with us all year long."
      },
      {
        title: "For all levels",
        desc: "From beginner to pro - everyone finds their flow here."
      },
      {
        title: "Professional equipment",
        desc: "High-quality boards and safety equipment included."
      }
    ]
  },
  booking: {
    title: "Book your surfskate slot",
    subtitle: "Choose your date and preferred time",
    metaDescription: "Surfskate booking in Wiesbaden – Select slots, enter data, done. German/English.",
    pickDate: "Select date",
    selectDateDesc: "Choose your desired date for the surfskate session",
    selectDateFirst: "Please select a date first",
    selectTimeDesc: "Choose your preferred times",
    availableSlots: "Available slots",
    selectedSlots: "Selected slots",
    selectedSlotsCount: "{{count}} slot(s) selected",
    selected: "Selected",
    slot: "Slot",
    slots: "Slots",
    selectedTotal: "total selected",
    booked: "Booked",
    sessionReady: "Session ready",
    sessionsReady: "Sessions ready",
    personalInfo: "Personal information",
    form: {
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone (optional)",
      phonePlaceholder: "+49 123 456789",
      level: "Experience level",
      levelOptions: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced"
      },
      notes: "Notes (optional)",
      notesPlaceholder: "Special requests or notes...",
      submit: "Book now"
    },
    errors: {
      selectDate: "Please select a date",
      selectSlot: "Please select at least one slot"
    },
    proceedingToPayment: "Proceeding to payment...",
    bookNow: "Book now",
    summary: "Booking summary",
    total: "Total",
    proceedToPayment: "Proceed to payment",
    today: "Today",
    tomorrow: "Tomorrow",
    dayFormat: "EEE, MMM d",
    noSlotsAvailable: "No slots available",
    selectSlotFirst: "Please select a slot first",
    instructions: "Fill out the form and proceed to payment to confirm your booking.",
    paymentDescription: "Secure payment via Stripe"
  },
  blog: {
    title: "Blog & News",
    subtitle: "Latest news, tips and updates from Surfskate Hall Wiesbaden",
    noPostsYet: "No posts yet",
    readMore: "Read more"
  },
  profile: {
    hello: "Hello",
    notLoggedIn: "You are not logged in.",
    loginPrompt: "Log in to view your profile and manage your bookings.",
    loginButton: "Login",
    changePassword: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    updating: "Updating...",
    updatePassword: "Update password",
    passwordsNoMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    cancelMembership: "Cancel membership",
    cancelMembershipConfirm: "Really cancel membership?",
    cancelMembershipDescription: "This action cannot be undone. You will lose your premium benefits.",
    canceling: "Canceling...",
    deleteAccount: "Delete account",
    deleteAccountConfirm: "Really delete account?",
    deleteAccountDescription: "This action cannot be undone. All your data will be permanently deleted.",
    deleting: "Deleting..."
  },
  auth: {
    signIn: "Sign in",
    signUp: "Sign up",
    email: "Email",
    password: "Password",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset password",
    sendResetEmail: "Send reset email",
    backToLogin: "Back to login",
    resetEmailSent: "Reset email sent!",
    resetEmailSentDesc: "Check your email for instructions to reset your password.",
    authError: "Authentication error",
    signUpSuccess: "Sign up successful",
    signUpSuccessDesc: "Your account has been created. You can now sign in.",
    signInSuccess: "Sign in successful",
    signInSuccessDesc: "Welcome back!",
    passwordResetSent: "Password reset sent",
    passwordResetSentDesc: "Check your email for further instructions."
  },
  subscription: {
    title: "Premium Membership",
    subtitle: "Unlimited access to Surfskate Hall",
    price: "€29.99",
    period: "/month",
    benefits: "What's included:",
    features: [
      "Unlimited hall access",
      "Priority slot booking",
      "10% equipment discount",
      "Free workshops and events",
      "Community access"
    ],
    cta: "Go Premium",
    ctaDescription: "Cancel anytime • No commitment",
    loading: "Loading...",
    authRequired: "Login required",
    authRequiredDesc: "You need to be logged in to subscribe to premium membership.",
    whySignUp: "Why sign up?",
    signUpBenefits: [
      "Secure storage of your bookings",
      "Easy membership management",
      "Exclusive offers and updates",
      "Access to premium community"
    ],
    signInToContinue: "Sign in to continue",
    subscribed: "Premium Active",
    currentPlan: "Current Plan",
    expires: "Expires on",
    managePlan: "Manage Membership"
  },
  admin: {
    title: "Surfskate Hall Admin",
    loading: "Loading admin panel...",
    navigation: {
      dashboard: "Dashboard",
      blog: "Blog Management",
      prices: "Price Management"
    },
    auth: {
      logout: "Logout",
      logoutSuccess: "Logged out successfully",
      logoutDescription: "You have been logged out of the admin panel.",
      logoutError: "Failed to log out. Please try again.",
      error: "Error"
    },
    dashboard: {
      title: "Admin Dashboard",
      subtitle: "Overview of all bookings and finances in real-time",
      loading: "Loading booking data...",
      totalBookings: "Total Bookings",
      totalRevenue: "Total Revenue",
      today: "Today",
      thisMonth: "This Month",
      confirmedBookings: "Confirmed Bookings",
      allConfirmedBookings: "All confirmed bookings",
      todayBookings: "Today's bookings",
      thisMonthRevenue: "This month's revenue",
      allBookingsCount: "All Bookings ({{count}})",
      bookingsDescription: "Overview of all bookings in chronological order • Updated in real-time",
      bookingDate: "Booking Date",
      slot: "Slot",
      name: "Name",
      email: "Email",
      level: "Level",
      amount: "Amount",
      status: "Status",
      created: "Created",
      confirmed: "Confirmed",
      pending: "Pending",
      noBookings: "No bookings found",
      loadError: "Error loading bookings",
      error: "Error",
      unexpectedError: "An unexpected error occurred"
    },
    blogManagement: {
      title: "Blog Management",
      description: "Manage your blog posts and news",
      error: "Error",
      success: "Success",
      fetchError: "Failed to fetch blog posts",
      updateSuccess: "Blog post updated successfully",
      createSuccess: "Blog post created successfully",
      saveError: "Failed to save blog post",
      deleteSuccess: "Blog post deleted successfully",
      deleteError: "Failed to delete blog post",
      publishSuccess: "Post published successfully",
      unpublishSuccess: "Post unpublished successfully",
      statusError: "Failed to update post status",
      viewBlog: "View Blog",
      newPost: "New Post",
      editPost: "Edit Post",
      createPost: "Create New Post",
      editDescription: "Update your blog post",
      createDescription: "Create a new blog post or news article",
      blogTitle: "Title",
      excerpt: "Excerpt (Optional)",
      excerptPlaceholder: "Short description of the post...",
      imageUrl: "Image URL (Optional)",
      content: "Content",
      contentPlaceholder: "Write your blog post content here...",
      publishImmediately: "Publish immediately",
      post: "Post",
      noPosts: "No blog posts yet",
      noPostsDescription: "Create your first blog post to share news and updates with your community.",
      published: "Published",
      draft: "Draft",
      created: "Created",
      updated: "Updated",
      deletePost: "Delete Post",
      deleteConfirmation: "Are you sure you want to delete \"{{title}}\"? This action cannot be undone."
    },
    priceManagement: {
      title: "Price Management",
      description: "Manage booking and subscription prices, synchronized with Stripe",
      totalPrices: "{{count}} prices total",
      newPrice: "New Price",
      editPrice: "Edit Price",
      createPrice: "Create Price",
      editDescription: "Edit the selected price",
      createDescription: "Create a new price for bookings or subscriptions",
      type: "Type",
      typeBooking: "Booking",
      typeSubscription: "Subscription",
      name: "Name",
      amount: "Amount (EUR)",
      active: "Active",
      inactive: "Inactive",
      updated: "Updated",
      syncWithStripe: "Sync with Stripe",
      deleteConfirm: "Delete Price",
      deleteDescription: "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.",
      error: "Error",
      success: "Success",
      fetchError: "Failed to fetch prices",
      saveError: "Failed to save price",
      deleteError: "Failed to delete price",
      syncError: "Failed to sync with Stripe",
      createSuccess: "Price created successfully",
      updateSuccess: "Price updated successfully",
      deleteSuccess: "Price deleted successfully",
      syncSuccess: "Successfully synced with Stripe",
      noPrices: "No prices configured",
      noPricesDescription: "Create your first price for bookings or subscriptions."
    }
  },
  pages: {
    about: {
      title: "About Surfskate Hall",
      desc: "The first indoor surfskate hall in Wiesbaden",
      text: "Surfskate Hall offers a unique indoor surfing experience with professional equipment."
    },
    contact: {
      title: "Contact",
      desc: "How to reach us.",
      text: "We look forward to your visit or message!"
    },
    datenschutz: {
      title: "Privacy Policy",
      desc: "Information about data processing.",
      text: "We take the protection of your personal data seriously and comply with GDPR."
    },
    impressum: {
      title: "Imprint",
      desc: "Legal information about Surfskate Hall.",
      text: "Responsible for content: Surfskate Hall Wiesbaden"
    },
    terms: {
      title: "Terms and Conditions",
      desc: "Terms of use for Surfskate Hall.",
      text: "These terms govern the use of our facilities and services."
    },
    widerruf: {
      title: "Right of Withdrawal",
      desc: "Information about withdrawal rights for consumers.",
      text: "Consumers have the right to withdraw from this contract within 14 days without giving reasons (exceptions may apply for time-bound leisure services)."
    }
  },
  footer: {
    aboutUs: "About us",
    contact: "Contact",
    datenschutz: "Privacy",
    impressum: "Imprint",
    terms: "Terms",
    widerruf: "Withdrawal",
    blog: "Blog",
    copyright: "© 2024 Surfskate Hall Wiesbaden. All rights reserved."
  },
  errors: {
    notFound: "Page not found",
    notFoundDesc: "The requested page does not exist.",
    goHome: "Go home"
  },
  payment: {
    success: {
      title: "Payment successful!",
      description: "Your booking has been confirmed. You will receive a confirmation email.",
      bookingConfirmed: "Booking confirmed",
      emailSent: "Confirmation email sent",
      returnHome: "Return home"
    },
    canceled: {
      title: "Payment canceled",
      description: "Your payment was canceled. You can try again anytime.",
      tryAgain: "Try again",
      returnHome: "Return home"
    }
  },
  actions: {
    edit: "Edit",
    delete: "Delete"
  }
} as const;

export default en;
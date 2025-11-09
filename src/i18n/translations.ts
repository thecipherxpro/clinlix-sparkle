export type Language = 'en' | 'pt';

interface TranslationStructure {
  // App branding
  app: {
    name: string;
    tagline: string;
  };
  auth: {
    welcomeBack: string;
    createAccount: string;
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    phoneOptional: string;
    iAmCustomer: string;
    iAmProvider: string;
    continueWithGoogle: string;
    or: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    forgotPassword: string;
    resetPassword: string;
    backToSignIn: string;
    sendResetLink: string;
    resetEmailSent: string;
    accountCreated: string;
    signInSuccess: string;
    signInError: string;
    passwordTooShort: string;
    passwordMismatch: string;
    allFieldsRequired: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    submit: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    confirm: string;
    yes: string;
    no: string;
    ok: string;
    settings: string;
    profile: string;
    logout: string;
    language: string;
    currency: string;
    notifications: string;
    security: string;
    account: string;
    continue: string;
    welcome: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    customer: string;
    saving: string;
    saveChanges: string;
    logoutSuccess: string;
  };
  dashboard: {
    welcome: string;
    myBookings: string;
    findProviders: string;
    myAddresses: string;
    paymentMethods: string;
    settings: string;
    profile: string;
    upcomingBookings: string;
    noBookings: string;
    startBooking: string;
    bookCleaning: string;
  };
  settings: {
    title: string;
    customerSettings: string;
    providerSettings: string;
    accountInfo: string;
    accountDetails: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    emailCannotChange: string;
    notifications: string;
    notificationsDesc: string;
    pushNotifications: string;
    pushNotificationsDesc: string;
    emailNotifications: string;
    emailNotificationsDesc: string;
    smsNotifications: string;
    smsNotificationsDesc: string;
    language: string;
    languageDesc: string;
    selectLanguage: string;
    currencyPreference: string;
    currencyDesc: string;
    currencyAuto: string;
    security: string;
    securityDesc: string;
    changePassword: string;
    passwordResetInfo: string;
    changesSaved: string;
    failedToSave: string;
    failedToLoad: string;
    passwordResetSent: string;
    failedToSendReset: string;
    pushEnabled: string;
    pushDisabled: string;
    countryCannotChange: string;
    dangerZone: string;
  };
  provider: {
    availabilityPreferences: string;
    availabilityDesc: string;
    acceptRecurring: string;
    acceptRecurringDesc: string;
    currentlyAvailable: string;
    currentlyAvailableDesc: string;
    verification: string;
    verificationDesc: string;
    becomeVerified: string;
    verifiedInfo: string;
    languageRegion: string;
    myJobs: string;
    jobRequests: string;
    requests: string;
    confirmed: string;
    completed: string;
    dashboard: string;
    schedule: string;
    wallet: string;
    reviews: string;
    available: string;
    offline: string;
    earnings: string;
    pending: string;
    paid: string;
    totalEarned: string;
    platformFee: string;
    payoutDue: string;
    pendingJobs: string;
    availableJobs: string;
    earnedThisMonth: string;
    quickActions: string;
    jobs: string;
    viewAllJobs: string;
    manageAvailability: string;
    viewEarnings: string;
    profile: string;
    editProfile: string;
    noPendingJobs: string;
    noConfirmedJobs: string;
    noCompletedJobs: string;
    completeJobsToEarn: string;
    basePrice: string;
    addons: string;
    estimatedEarnings: string;
    viewJobDetails: string;
    viewJob: string;
    earned: string;
    viewSummary: string;
    mySchedule: string;
    addEditSlots: string;
    add: string;
    next30Days: string;
    selectDateToManage: string;
    noAvailabilitySet: string;
    addAvailableSlots: string;
    addAvailability: string;
    slotAvailable: string;
    slotsAvailable: string;
    trackEarnings: string;
    pendingPayout: string;
    earningsHistory: string;
    viewAllTransactions: string;
    all: string;
    noEarningsYet: string;
    base: string;
    fee: string;
    overtime: string;
    customerFeedback: string;
    basedOn: string;
    review: string;
    allReviews: string;
    noReviewsYet: string;
    completeJobsForReviews: string;
    providerSettings: string;
    myProfile: string;
    manageYourInfo: string;
    personalInformation: string;
    updateBasicDetails: string;
    providerInformation: string;
    detailsAboutService: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
    bio: string;
    tellCustomers: string;
    yearsOfExperience: string;
    skills: string;
    selectSkills: string;
    serviceAreas: string;
    selectAreas: string;
    languages: string;
    selectLanguages: string;
    saveChanges: string;
    saving: string;
    previewPublicProfile: string;
    call: string;
    jobDetails: string;
  };
  booking: {
    title: string;
    details: string;
    status: string;
    date: string;
    time: string;
    address: string;
    provider: string;
    customer: string;
    package: string;
    addons: string;
    totalPrice: string;
    notes: string;
    cancel: string;
    confirm: string;
    pending: string;
    accepted: string;
    rejected: string;
    completed: string;
    cancelled: string;
    addAddress: string;
    selectAddress: string;
    selectPackage: string;
    selectDate: string;
    selectTime: string;
    selectProvider: string;
  };
  reviews: {
    title: string;
    rateYourCleaning: string;
    yourFeedback: string;
    rating: string;
    comment: string;
    submitReview: string;
    noReviews: string;
    viewAll: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    oneTime: string;
    recurring: string;
    perCleaning: string;
    perMonth: string;
    bedroom: string;
    bedrooms: string;
    includes: string;
    viewDetails: string;
    selectPackage: string;
  };
  providers: {
    findProviders: string;
    searchProviders: string;
    noProvidersFound: string;
    checkBackSoon: string;
    viewProfile: string;
    bookNow: string;
    newBadge: string;
    verifiedBadge: string;
    findNearYou: string;
    filterProviders: string;
    narrowSearch: string;
    verifiedOnly: string;
    showVerifiedOnly: string;
    minimumRating: string;
    whereNeedService: string;
    enterCity: string;
    checkAvailability: string;
    filterByDate: string;
    resetFilters: string;
    activeFilters: string;
    verified: string;
    stars: string;
    area: string;
    date: string;
    noMatches: string;
    tryDifferentFilters: string;
    providersAvailable: string;
    provider: string;
  };
  addresses: {
    myAddresses: string;
    manageAddresses: string;
    addAddress: string;
    editAddress: string;
    addNewAddress: string;
    addressLabel: string;
    labelPlaceholder: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
    propertyType: string;
    apartment: string;
    house: string;
    layoutType: string;
    studio: string;
    oneBedroom: string;
    twoBedrooms: string;
    threeBedrooms: string;
    fourBedrooms: string;
    rua: string;
    codigoPostal: string;
    portaAndar: string;
    localidade: string;
    distrito: string;
    streetAddress: string;
    aptUnit: string;
    postalCode: string;
    city: string;
    province: string;
    setPrimary: string;
    updateAddress: string;
    saveAddress: string;
    noAddresses: string;
    addFirstAddress: string;
    primary: string;
    deleteAddress: string;
    maxAddresses: string;
    addressAdded: string;
    addressUpdated: string;
    addressDeleted: string;
    failedToLoad: string;
    failedToSave: string;
    failedToDelete: string;
    confirmDelete: string;
  };
  bookings: {
    myBookings: string;
    active: string;
    completed: string;
    cancelled: string;
    viewDetails: string;
    paid: string;
    package: string;
    total: string;
    cancelBooking: string;
    leaveReview: string;
    noCompleted: string;
    noCancelled: string;
    confirmCancel: string;
    bookingCancelled: string;
    failedToCancel: string;
    failedToLoad: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
    step7Title: string;
    step7Desc: string;
    step8Title: string;
    step8Desc: string;
  };
  notifications: {
    bookingConfirmed: string;
    bookingCancelled: string;
    providerAssigned: string;
    jobStarted: string;
    jobCompleted: string;
    newJobRequest: string;
    paymentReceived: string;
  };
  errors: {
    generic: string;
    networkError: string;
    unauthorized: string;
    notFound: string;
    validationError: string;
    serverError: string;
    updateFailed: string;
  };
}

export const translations: Record<Language, TranslationStructure> = {
  en: {
    app: {
      name: 'Clinlix',
      tagline: 'Trusted Cleaning, Every Single Time',
    },
    // Auth Page
    auth: {
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      phoneOptional: 'Phone (Optional)',
      iAmCustomer: "I'm a Customer",
      iAmProvider: "I'm a Service Provider",
      continueWithGoogle: 'Continue with Google',
      or: 'or',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      backToSignIn: 'Back to Sign In',
      sendResetLink: 'Send Reset Link',
      resetEmailSent: 'Password reset email sent! Check your inbox.',
      accountCreated: 'Account created successfully! Welcome!',
      signInSuccess: 'Welcome back!',
      signInError: 'Invalid email or password',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      allFieldsRequired: 'Please fill in all required fields',
    },
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      language: 'Language',
      currency: 'Currency',
      notifications: 'Notifications',
      security: 'Security',
      account: 'Account',
      continue: 'Continue',
      welcome: 'Welcome',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      country: 'Country',
      customer: 'Customer Account',
      saving: 'Saving...',
      saveChanges: 'Save Changes',
      logoutSuccess: 'Logged out successfully',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome',
      myBookings: 'My Bookings',
      findProviders: 'Find Providers',
      myAddresses: 'My Addresses',
      paymentMethods: 'Payment Methods',
      settings: 'Settings',
      profile: 'Profile',
      upcomingBookings: 'Upcoming Bookings',
      noBookings: 'No bookings yet',
      startBooking: 'Start Booking',
      bookCleaning: 'Book a Cleaning',
    },
    // Settings
    settings: {
      title: 'Settings',
      customerSettings: 'Customer Settings',
      providerSettings: 'Provider Settings',
      accountInfo: 'Account Information',
      accountDetails: 'Your basic account details',
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      emailAddress: 'Email Address',
      emailCannotChange: 'Email cannot be changed',
      notifications: 'Notifications',
      notificationsDesc: 'Manage how you receive updates',
      pushNotifications: 'Push Notifications',
      pushNotificationsDesc: 'Receive real-time updates in your browser or app',
      emailNotifications: 'Email Notifications',
      emailNotificationsDesc: 'Receive booking updates via email',
      smsNotifications: 'SMS Notifications',
      smsNotificationsDesc: 'Receive booking updates via SMS',
      language: 'Language',
      languageDesc: 'Choose your preferred language',
      selectLanguage: 'Select language',
      currencyPreference: 'Currency Preference',
      currencyDesc: 'Based on your country selection',
      currencyAuto: 'Currency is automatically set based on your country',
      security: 'Security',
      securityDesc: 'Manage your account security',
      changePassword: 'Change Password',
      passwordResetInfo: "We'll send you an email with instructions to reset your password",
      changesSaved: '✅ Changes saved',
      failedToSave: 'Failed to save changes',
      failedToLoad: 'Failed to load settings',
      passwordResetSent: 'Password reset email sent! Check your inbox.',
      failedToSendReset: 'Failed to send reset email',
      pushEnabled: '✅ Push notifications enabled',
      pushDisabled: 'Push notifications disabled',
      countryCannotChange: 'Country cannot be changed',
      dangerZone: 'Danger Zone',
    },
    // Provider specific
    provider: {
      availabilityPreferences: 'Availability Preferences',
      availabilityDesc: 'Manage your work preferences',
      acceptRecurring: 'Accept Recurring Clients',
      acceptRecurringDesc: 'Allow customers to book you regularly',
      currentlyAvailable: 'Currently Available',
      currentlyAvailableDesc: 'Show as available for new bookings',
      verification: 'Verification',
      verificationDesc: 'Boost your profile credibility',
      becomeVerified: 'Become Verified',
      verifiedInfo: 'Verified providers get more bookings and customer trust',
      languageRegion: 'Language & Region',
      myJobs: 'My Jobs',
      jobRequests: 'Job Requests',
      requests: 'Requests',
      confirmed: 'Confirmed',
      completed: 'Completed',
      dashboard: 'Dashboard',
      schedule: 'Schedule',
      wallet: 'Wallet',
      reviews: 'Reviews',
      available: 'Available',
      offline: 'Offline',
      earnings: 'Earnings',
      pending: 'Pending',
      paid: 'Paid',
      totalEarned: 'Total Earned',
      platformFee: 'Platform Fee',
      payoutDue: 'Payout Due',
      pendingJobs: 'Pending Jobs',
      availableJobs: 'Available Jobs',
      earnedThisMonth: 'Earned This Month',
      quickActions: 'Quick Actions',
      jobs: 'Jobs',
      viewAllJobs: 'View all jobs',
      manageAvailability: 'Manage availability',
      viewEarnings: 'View earnings',
      profile: 'Profile',
      editProfile: 'Edit profile',
      noPendingJobs: 'No pending job requests',
      noConfirmedJobs: 'No confirmed jobs',
      noCompletedJobs: 'No completed jobs yet',
      completeJobsToEarn: 'Complete jobs to start earning',
      basePrice: 'Base Price',
      addons: 'Add-ons',
      estimatedEarnings: 'Estimated Earnings',
      viewJobDetails: 'View Job Details',
      viewJob: 'View Job',
      earned: 'earned',
      viewSummary: 'View Summary',
      mySchedule: 'My Schedule',
      addEditSlots: 'Add or edit your available time slots',
      add: 'Add',
      next30Days: 'Next 30 Days',
      selectDateToManage: 'Select a date to manage availability',
      noAvailabilitySet: 'No availability set for this day',
      addAvailableSlots: 'Add your available time slots to receive bookings',
      addAvailability: 'Add Availability',
      slotAvailable: 'slot available',
      slotsAvailable: 'slots available',
      trackEarnings: 'Track your earnings',
      pendingPayout: 'Pending Payout',
      earningsHistory: 'Earnings History',
      viewAllTransactions: 'View all your transactions',
      all: 'All',
      noEarningsYet: 'No earnings yet',
      base: 'Base',
      fee: 'Fee',
      overtime: 'Overtime',
      customerFeedback: 'Customer feedback',
      basedOn: 'Based on',
      review: 'review',
      allReviews: 'All Reviews',
      noReviewsYet: 'No reviews yet',
      completeJobsForReviews: 'Complete jobs to receive customer reviews',
      providerSettings: 'Provider Settings',
      myProfile: 'My Profile',
      manageYourInfo: 'Manage your information',
      personalInformation: 'Personal Information',
      updateBasicDetails: 'Update your basic details',
      providerInformation: 'Provider Information',
      detailsAboutService: 'Details about your service',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      email: 'Email',
      country: 'Country',
      bio: 'Bio',
      tellCustomers: 'Tell customers about yourself...',
      yearsOfExperience: 'Years of Experience',
      skills: 'Skills',
      selectSkills: 'Select skills...',
      serviceAreas: 'Service Areas',
      selectAreas: 'Select service areas...',
      languages: 'Languages',
      selectLanguages: 'Select languages...',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      previewPublicProfile: 'Preview Public Profile',
      call: 'Call',
      jobDetails: 'Job Details',
    },
    // Bookings
    booking: {
      title: 'Booking',
      details: 'Booking Details',
      status: 'Status',
      date: 'Date',
      time: 'Time',
      address: 'Address',
      provider: 'Provider',
      customer: 'Customer',
      package: 'Package',
      addons: 'Add-ons',
      totalPrice: 'Total Price',
      notes: 'Notes',
      cancel: 'Cancel Booking',
      confirm: 'Confirm Booking',
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      completed: 'Completed',
      cancelled: 'Cancelled',
      addAddress: 'Add Address',
      selectAddress: 'Select Address',
      selectPackage: 'Select Package',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      selectProvider: 'Select Provider',
    },
    // Reviews
    reviews: {
      title: 'Reviews',
      rateYourCleaning: 'Rate Your Cleaning',
      yourFeedback: 'Your feedback helps us improve our service',
      rating: 'Rating',
      comment: 'Comment',
      submitReview: 'Submit Review',
      noReviews: 'No reviews yet',
      viewAll: 'View All Reviews',
    },
    // Pricing
    pricing: {
      title: 'Our Pricing',
      subtitle: 'Transparent pricing for quality cleaning services',
      oneTime: 'One-Time',
      recurring: 'Recurring',
      perCleaning: 'per cleaning',
      perMonth: 'per month',
      bedroom: 'Bedroom',
      bedrooms: 'Bedrooms',
      includes: 'Includes',
      viewDetails: 'View Details',
      selectPackage: 'Select Package',
    },
    // Providers
    providers: {
      findProviders: 'Find Providers',
      searchProviders: 'Search providers...',
      noProvidersFound: 'No providers found yet',
      checkBackSoon: 'Check back soon as we onboard more cleaning professionals',
      viewProfile: 'View Profile',
      bookNow: 'Book Now',
      newBadge: 'NEW',
      verifiedBadge: 'VERIFIED',
      findNearYou: 'Find providers near you...',
      filterProviders: 'Filter Providers',
      narrowSearch: 'Narrow your search',
      verifiedOnly: 'Verified Only',
      showVerifiedOnly: 'Show only verified providers',
      minimumRating: 'Minimum Rating',
      whereNeedService: 'Where do you need service?',
      enterCity: 'Enter your city',
      checkAvailability: 'Check Availability',
      filterByDate: 'Filter by availability on a specific date',
      resetFilters: 'Reset Filters',
      activeFilters: 'Active filters:',
      verified: 'Verified',
      stars: 'stars',
      area: 'Area:',
      date: 'Date:',
      noMatches: 'No matches yet',
      tryDifferentFilters: 'Try different filters or expand your search area',
      providersAvailable: 'providers available',
      provider: 'provider',
    },
    // Addresses
    addresses: {
      myAddresses: 'My Addresses',
      manageAddresses: 'Manage up to 5 addresses',
      addAddress: 'Add Address',
      editAddress: 'Edit Address',
      addNewAddress: 'Add New Address',
      addressLabel: 'Address Label',
      labelPlaceholder: 'Home, Office, etc.',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      email: 'Email',
      country: 'Country',
      propertyType: 'Property Type',
      apartment: 'Apartment',
      house: 'House',
      layoutType: 'Layout Type',
      studio: 'Studio',
      oneBedroom: '1 Bedroom',
      twoBedrooms: '2 Bedrooms',
      threeBedrooms: '3 Bedrooms',
      fourBedrooms: '4 Bedrooms',
      rua: 'Rua',
      codigoPostal: 'Código Postal',
      portaAndar: 'Porta/Andar',
      localidade: 'Localidade',
      distrito: 'Distrito',
      streetAddress: 'Street Address',
      aptUnit: 'Apt/Unit',
      postalCode: 'Postal Code',
      city: 'City',
      province: 'Province',
      setPrimary: 'Set as primary address',
      updateAddress: 'Update Address',
      saveAddress: 'Save Address',
      noAddresses: 'No addresses saved yet',
      addFirstAddress: 'Add Your First Address',
      primary: 'Primary',
      deleteAddress: 'Delete',
      maxAddresses: 'Maximum 5 addresses allowed',
      addressAdded: 'Address added successfully',
      addressUpdated: 'Address updated successfully',
      addressDeleted: 'Address deleted',
      failedToLoad: 'Failed to load addresses',
      failedToSave: 'Failed to save address',
      failedToDelete: 'Failed to delete address',
      confirmDelete: 'Are you sure you want to delete this address?',
    },
    // Bookings
    bookings: {
      myBookings: 'My Bookings',
      active: 'Active',
      completed: 'Completed',
      cancelled: 'Cancelled',
      viewDetails: 'View Details',
      paid: 'Paid',
      package: 'Package',
      total: 'Total',
      cancelBooking: 'Cancel Booking',
      leaveReview: 'Leave a Review',
      noCompleted: 'No completed bookings',
      noCancelled: 'No cancelled bookings',
      confirmCancel: 'Are you sure you want to cancel this booking?',
      bookingCancelled: 'Booking cancelled',
      failedToCancel: 'Failed to cancel booking',
      failedToLoad: 'Failed to load bookings',
    },
    // How It Works
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Simple steps to book your cleaning service',
      step: 'Step',
      step1Title: 'Enter Your Address',
      step1Desc: 'Tell us where you need cleaning services',
      step2Title: 'Choose Your Package',
      step2Desc: 'Select a cleaning package that fits your needs',
      step3Title: 'View Pricing',
      step3Desc: 'See transparent pricing for your selected package',
      step4Title: 'Pick Date & Time',
      step4Desc: 'Choose when you want the cleaning to happen',
      step5Title: 'Select Provider',
      step5Desc: 'Choose from available verified cleaning providers',
      step6Title: 'Add Extras',
      step6Desc: 'Customize with additional services',
      step7Title: 'Confirm & Pay',
      step7Desc: 'Review and confirm your booking',
      step8Title: 'Get Confirmation',
      step8Desc: 'Receive booking confirmation and details',
    },
    // Notifications
    notifications: {
      bookingConfirmed: 'Your booking has been confirmed',
      bookingCancelled: 'Your booking has been cancelled',
      providerAssigned: 'A provider has been assigned to your booking',
      jobStarted: 'Your cleaning has started',
      jobCompleted: 'Your cleaning has been completed',
      newJobRequest: 'New job request received',
      paymentReceived: 'Payment received',
    },
    // Errors
    errors: {
      generic: 'Something went wrong',
      networkError: 'Network error. Please check your connection.',
      unauthorized: 'You are not authorized to perform this action',
      notFound: 'Resource not found',
      validationError: 'Please check your input',
      serverError: 'Server error. Please try again later.',
      updateFailed: 'Failed to update profile',
    },
  },
  pt: {
    app: {
      name: 'Clinlix',
      tagline: 'Limpeza de confiança, todas as vezes',
    },
    // Auth Page
    auth: {
      welcomeBack: 'Bem-vindo de Volta',
      createAccount: 'Criar Conta',
      signIn: 'Entrar',
      signUp: 'Registar',
      email: 'Email',
      password: 'Palavra-passe',
      confirmPassword: 'Confirmar Palavra-passe',
      firstName: 'Primeiro Nome',
      lastName: 'Último Nome',
      phone: 'Número de Telefone',
      phoneOptional: 'Telefone (Opcional)',
      iAmCustomer: 'Sou Cliente',
      iAmProvider: 'Sou Prestador de Serviços',
      continueWithGoogle: 'Continuar com Google',
      or: 'ou',
      dontHaveAccount: 'Não tem conta?',
      alreadyHaveAccount: 'Já tem conta?',
      forgotPassword: 'Esqueceu a Palavra-passe?',
      resetPassword: 'Redefinir Palavra-passe',
      backToSignIn: 'Voltar ao Início de Sessão',
      sendResetLink: 'Enviar Link de Redefinição',
      resetEmailSent: 'Email de redefinição de palavra-passe enviado! Verifique a sua caixa de entrada.',
      accountCreated: 'Conta criada com sucesso! Bem-vindo!',
      signInSuccess: 'Bem-vindo de volta!',
      signInError: 'Email ou palavra-passe inválidos',
      passwordTooShort: 'A palavra-passe deve ter pelo menos 6 caracteres',
      passwordMismatch: 'As palavras-passe não coincidem',
      allFieldsRequired: 'Por favor, preencha todos os campos obrigatórios',
    },
    // Common
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Fechar',
      back: 'Voltar',
      next: 'Seguinte',
      submit: 'Submeter',
      search: 'Pesquisar',
      loading: 'A carregar...',
      error: 'Erro',
      success: 'Sucesso',
      warning: 'Aviso',
      info: 'Informação',
      confirm: 'Confirmar',
      yes: 'Sim',
      no: 'Não',
      ok: 'OK',
      settings: 'Definições',
      profile: 'Perfil',
      logout: 'Sair',
      language: 'Idioma',
      currency: 'Moeda',
      notifications: 'Notificações',
      security: 'Segurança',
      account: 'Conta',
      continue: 'Continuar',
      welcome: 'Bem-vindo',
      firstName: 'Primeiro Nome',
      lastName: 'Último Nome',
      email: 'Email',
      phone: 'Telefone',
      country: 'País',
      customer: 'Conta de Cliente',
      saving: 'A guardar...',
      saveChanges: 'Guardar Alterações',
      logoutSuccess: 'Sessão encerrada com sucesso',
    },
    // Dashboard
    dashboard: {
      welcome: 'Bem-vindo',
      myBookings: 'As Minhas Reservas',
      findProviders: 'Encontrar Prestadores',
      myAddresses: 'As Minhas Moradas',
      paymentMethods: 'Métodos de Pagamento',
      settings: 'Definições',
      profile: 'Perfil',
      upcomingBookings: 'Reservas Futuras',
      noBookings: 'Ainda não tem reservas',
      startBooking: 'Iniciar Reserva',
      bookCleaning: 'Agendar Limpeza',
    },
    // Settings
    settings: {
      title: 'Definições',
      customerSettings: 'Definições de Cliente',
      providerSettings: 'Definições de Prestador',
      accountInfo: 'Informação da Conta',
      accountDetails: 'Os seus dados básicos da conta',
      firstName: 'Primeiro Nome',
      lastName: 'Último Nome',
      phoneNumber: 'Número de Telefone',
      emailAddress: 'Endereço de Email',
      emailCannotChange: 'O email não pode ser alterado',
      notifications: 'Notificações',
      notificationsDesc: 'Gerir como recebe atualizações',
      pushNotifications: 'Notificações Push',
      pushNotificationsDesc: 'Receber atualizações em tempo real no seu navegador ou app',
      emailNotifications: 'Notificações por Email',
      emailNotificationsDesc: 'Receber atualizações de reservas por email',
      smsNotifications: 'Notificações SMS',
      smsNotificationsDesc: 'Receber atualizações de reservas por SMS',
      language: 'Idioma',
      languageDesc: 'Escolha o seu idioma preferido',
      selectLanguage: 'Selecionar idioma',
      currencyPreference: 'Preferência de Moeda',
      currencyDesc: 'Baseado na seleção do seu país',
      currencyAuto: 'A moeda é automaticamente definida com base no seu país',
      security: 'Segurança',
      securityDesc: 'Gerir a segurança da sua conta',
      changePassword: 'Alterar Palavra-passe',
      passwordResetInfo: 'Enviaremos um email com instruções para redefinir a sua palavra-passe',
      changesSaved: '✅ Alterações guardadas',
      failedToSave: 'Falha ao guardar alterações',
      failedToLoad: 'Falha ao carregar definições',
      passwordResetSent: 'Email de redefinição de palavra-passe enviado! Verifique a sua caixa de entrada.',
      failedToSendReset: 'Falha ao enviar email de redefinição',
      pushEnabled: '✅ Notificações push ativadas',
      pushDisabled: 'Notificações push desativadas',
      countryCannotChange: 'O país não pode ser alterado',
      dangerZone: 'Zona de Perigo',
    },
    // Provider specific
    provider: {
      availabilityPreferences: 'Preferências de Disponibilidade',
      availabilityDesc: 'Gerir preferências de trabalho',
      acceptRecurring: 'Aceitar Reservas Recorrentes',
      acceptRecurringDesc: 'Receber pedidos de trabalhos recorrentes',
      currentlyAvailable: 'Disponível Agora',
      currentlyAvailableDesc: 'Mostrar perfil aos clientes',
      verification: 'Verificação',
      verificationDesc: 'Aumente confiança e obtenha mais reservas',
      becomeVerified: 'Tornar-se Prestador Verificado',
      verifiedInfo: 'Prestadores verificados obtêm 3x mais reservas',
      languageRegion: 'Idioma e Região',
      myJobs: 'Meus Trabalhos',
      jobRequests: 'Pedidos de Trabalho',
      requests: 'Pedidos',
      confirmed: 'Confirmados',
      completed: 'Concluídos',
      dashboard: 'Painel',
      schedule: 'Agenda',
      wallet: 'Carteira',
      reviews: 'Avaliações',
      available: 'Disponível',
      offline: 'Offline',
      earnings: 'Ganhos',
      pending: 'Pendente',
      paid: 'Pago',
      totalEarned: 'Total Ganho',
      platformFee: 'Taxa da Plataforma',
      payoutDue: 'Pagamento Devido',
      pendingJobs: 'Trabalhos Pendentes',
      availableJobs: 'Trabalhos Disponíveis',
      earnedThisMonth: 'Ganho Este Mês',
      quickActions: 'Ações Rápidas',
      jobs: 'Trabalhos',
      viewAllJobs: 'Ver todos',
      manageAvailability: 'Gerir disponibilidade',
      viewEarnings: 'Ver ganhos',
      profile: 'Perfil',
      editProfile: 'Editar perfil',
      noPendingJobs: 'Sem pedidos pendentes',
      noConfirmedJobs: 'Sem trabalhos confirmados',
      noCompletedJobs: 'Ainda sem trabalhos concluídos',
      completeJobsToEarn: 'Complete trabalhos para começar a ganhar',
      basePrice: 'Preço Base',
      addons: 'Extras',
      estimatedEarnings: 'Ganho Estimado',
      viewJobDetails: 'Ver Detalhes',
      viewJob: 'Ver Trabalho',
      earned: 'ganho',
      viewSummary: 'Ver Resumo',
      mySchedule: 'Minha Agenda',
      addEditSlots: 'Adicione ou edite horários disponíveis',
      add: 'Adicionar',
      next30Days: 'Próximos 30 Dias',
      selectDateToManage: 'Selecione data para gerir disponibilidade',
      noAvailabilitySet: 'Sem disponibilidade para este dia',
      addAvailableSlots: 'Adicione horários para receber reservas',
      addAvailability: 'Adicionar Disponibilidade',
      slotAvailable: 'horário disponível',
      slotsAvailable: 'horários disponíveis',
      trackEarnings: 'Acompanhe seus ganhos',
      pendingPayout: 'Pagamento Pendente',
      earningsHistory: 'Histórico de Ganhos',
      viewAllTransactions: 'Ver todas as transações',
      all: 'Todos',
      noEarningsYet: 'Ainda sem ganhos',
      base: 'Base',
      fee: 'Taxa',
      overtime: 'Extra',
      customerFeedback: 'Feedback dos clientes',
      basedOn: 'Baseado em',
      review: 'avaliação',
      allReviews: 'Todas as Avaliações',
      noReviewsYet: 'Ainda sem avaliações',
      completeJobsForReviews: 'Complete trabalhos para receber avaliações',
      providerSettings: 'Configurações',
      myProfile: 'Meu Perfil',
      manageYourInfo: 'Gerir informações',
      personalInformation: 'Informação Pessoal',
      updateBasicDetails: 'Atualize seus dados básicos',
      providerInformation: 'Info do Prestador',
      detailsAboutService: 'Detalhes sobre serviço',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      phone: 'Telefone',
      email: 'Email',
      country: 'País',
      bio: 'Biografia',
      tellCustomers: 'Conte aos clientes sobre você...',
      yearsOfExperience: 'Anos de Experiência',
      skills: 'Habilidades',
      selectSkills: 'Selecione habilidades...',
      serviceAreas: 'Áreas de Serviço',
      selectAreas: 'Selecione áreas...',
      languages: 'Idiomas',
      selectLanguages: 'Selecione idiomas...',
      saveChanges: 'Guardar Alterações',
      saving: 'A guardar...',
      previewPublicProfile: 'Pré-visualizar Perfil Público',
      call: 'Ligar',
      jobDetails: 'Detalhes do Trabalho',
    },
    // Bookings
    booking: {
      title: 'Reserva',
      details: 'Detalhes da Reserva',
      status: 'Estado',
      date: 'Data',
      time: 'Hora',
      address: 'Morada',
      provider: 'Prestador',
      customer: 'Cliente',
      package: 'Pacote',
      addons: 'Extras',
      totalPrice: 'Preço Total',
      notes: 'Notas',
      cancel: 'Cancelar Reserva',
      confirm: 'Confirmar Reserva',
      pending: 'Pendente',
      accepted: 'Aceite',
      rejected: 'Rejeitado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      addAddress: 'Adicionar Morada',
      selectAddress: 'Selecionar Morada',
      selectPackage: 'Selecionar Pacote',
      selectDate: 'Selecionar Data',
      selectTime: 'Selecionar Hora',
      selectProvider: 'Selecionar Profissional',
    },
    // Reviews
    reviews: {
      title: 'Avaliações',
      rateYourCleaning: 'Avalie a sua limpeza',
      yourFeedback: 'O seu feedback ajuda-nos a melhorar o serviço',
      rating: 'Avaliação',
      comment: 'Comentário',
      submitReview: 'Enviar Avaliação',
      noReviews: 'Ainda sem avaliações',
      viewAll: 'Ver Todas as Avaliações',
    },
    // Pricing
    pricing: {
      title: 'Os Nossos Preços',
      subtitle: 'Preços transparentes para serviços de limpeza de qualidade',
      oneTime: 'Uma Vez',
      recurring: 'Recorrente',
      perCleaning: 'por limpeza',
      perMonth: 'por mês',
      bedroom: 'Quarto',
      bedrooms: 'Quartos',
      includes: 'Inclui',
      viewDetails: 'Ver Detalhes',
      selectPackage: 'Selecionar Pacote',
    },
    // Providers
    providers: {
      findProviders: 'Encontrar Prestadores',
      searchProviders: 'Procurar prestadores...',
      noProvidersFound: 'Ainda não há prestadores',
      checkBackSoon: 'Volte em breve enquanto integramos mais profissionais',
      viewProfile: 'Ver Perfil',
      bookNow: 'Reservar',
      newBadge: 'NOVO',
      verifiedBadge: 'VERIFICADO',
      findNearYou: 'Encontrar prestadores perto...',
      filterProviders: 'Filtrar Prestadores',
      narrowSearch: 'Refinar a pesquisa',
      verifiedOnly: 'Apenas Verificados',
      showVerifiedOnly: 'Mostrar apenas prestadores verificados',
      minimumRating: 'Classificação Mínima',
      whereNeedService: 'Onde precisa do serviço?',
      enterCity: 'Insira a sua cidade',
      checkAvailability: 'Verificar Disponibilidade',
      filterByDate: 'Filtrar por disponibilidade numa data',
      resetFilters: 'Limpar Filtros',
      activeFilters: 'Filtros ativos:',
      verified: 'Verificado',
      stars: 'estrelas',
      area: 'Área:',
      date: 'Data:',
      noMatches: 'Sem resultados',
      tryDifferentFilters: 'Tente filtros diferentes ou expanda a área',
      providersAvailable: 'prestadores disponíveis',
      provider: 'prestador',
    },
    // Addresses
    addresses: {
      myAddresses: 'As Minhas Moradas',
      manageAddresses: 'Gerir até 5 moradas',
      addAddress: 'Adicionar Morada',
      editAddress: 'Editar Morada',
      addNewAddress: 'Nova Morada',
      addressLabel: 'Nome da Morada',
      labelPlaceholder: 'Casa, Escritório, etc.',
      firstName: 'Primeiro Nome',
      lastName: 'Último Nome',
      phone: 'Telefone',
      email: 'Email',
      country: 'País',
      propertyType: 'Tipo de Propriedade',
      apartment: 'Apartamento',
      house: 'Moradia',
      layoutType: 'Tipologia',
      studio: 'Estúdio',
      oneBedroom: 'T1',
      twoBedrooms: 'T2',
      threeBedrooms: 'T3',
      fourBedrooms: 'T4',
      rua: 'Rua',
      codigoPostal: 'Código Postal',
      portaAndar: 'Porta/Andar',
      localidade: 'Localidade',
      distrito: 'Distrito',
      streetAddress: 'Morada',
      aptUnit: 'Apt/Unidade',
      postalCode: 'Código Postal',
      city: 'Cidade',
      province: 'Província',
      setPrimary: 'Definir como morada principal',
      updateAddress: 'Atualizar Morada',
      saveAddress: 'Guardar Morada',
      noAddresses: 'Ainda não tem moradas',
      addFirstAddress: 'Adicionar a 1ª Morada',
      primary: 'Principal',
      deleteAddress: 'Eliminar',
      maxAddresses: 'Máximo de 5 moradas permitido',
      addressAdded: 'Morada adicionada com sucesso',
      addressUpdated: 'Morada atualizada',
      addressDeleted: 'Morada eliminada',
      failedToLoad: 'Falha ao carregar moradas',
      failedToSave: 'Falha ao guardar morada',
      failedToDelete: 'Falha ao eliminar morada',
      confirmDelete: 'Tem a certeza que quer eliminar esta morada?',
    },
    // Bookings
    bookings: {
      myBookings: 'As Minhas Reservas',
      active: 'Ativas',
      completed: 'Concluídas',
      cancelled: 'Canceladas',
      viewDetails: 'Ver Detalhes',
      paid: 'Pago',
      package: 'Pacote',
      total: 'Total',
      cancelBooking: 'Cancelar Reserva',
      leaveReview: 'Deixar Avaliação',
      noCompleted: 'Sem reservas concluídas',
      noCancelled: 'Sem reservas canceladas',
      confirmCancel: 'Tem a certeza que quer cancelar?',
      bookingCancelled: 'Reserva cancelada',
      failedToCancel: 'Falha ao cancelar',
      failedToLoad: 'Falha ao carregar reservas',
    },
    // How It Works
    howItWorks: {
      title: 'Como Funciona',
      subtitle: 'Passos simples para agendar o seu serviço de limpeza',
      step: 'Passo',
      step1Title: 'Insira a Sua Morada',
      step1Desc: 'Diga-nos onde precisa de serviços de limpeza',
      step2Title: 'Escolha o Seu Pacote',
      step2Desc: 'Selecione um pacote de limpeza adequado às suas necessidades',
      step3Title: 'Ver Preços',
      step3Desc: 'Veja preços transparentes para o seu pacote selecionado',
      step4Title: 'Escolha Data e Hora',
      step4Desc: 'Escolha quando quer que a limpeza aconteça',
      step5Title: 'Selecionar Profissional',
      step5Desc: 'Escolha entre profissionais de limpeza verificados disponíveis',
      step6Title: 'Adicionar Extras',
      step6Desc: 'Personalize com serviços adicionais',
      step7Title: 'Confirmar e Pagar',
      step7Desc: 'Reveja e confirme a sua reserva',
      step8Title: 'Obter Confirmação',
      step8Desc: 'Receba confirmação e detalhes da reserva',
    },
    // Notifications
    notifications: {
      bookingConfirmed: 'A sua reserva foi confirmada',
      bookingCancelled: 'A sua reserva foi cancelada',
      providerAssigned: 'Um profissional foi atribuído à sua reserva',
      jobStarted: 'A sua limpeza foi iniciada',
      jobCompleted: 'A sua limpeza foi concluída',
      newJobRequest: 'Novo pedido de trabalho recebido',
      paymentReceived: 'Pagamento recebido',
    },
    // Errors
    errors: {
      generic: 'Algo correu mal',
      networkError: 'Erro de rede. Verifique a sua conexão.',
      unauthorized: 'Não está autorizado a realizar esta ação',
      notFound: 'Recurso não encontrado',
      validationError: 'Por favor, verifique os seus dados',
      serverError: 'Erro do servidor. Tente novamente mais tarde.',
      updateFailed: 'Falha ao atualizar perfil',
    },
  },
};

export type TranslationKeys = TranslationStructure;
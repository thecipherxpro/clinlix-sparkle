export type Language = 'en' | 'pt';

interface TranslationStructure {
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
    confirmed: string;
    completed: string;
    dashboard: string;
    schedule: string;
    wallet: string;
    reviews: string;
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
  };
  errors: {
    generic: string;
    networkError: string;
    unauthorized: string;
    notFound: string;
    validationError: string;
    serverError: string;
  };
}

export const translations: Record<Language, TranslationStructure> = {
  en: {
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
      confirmed: 'Confirmed',
      completed: 'Completed',
      dashboard: 'Provider Dashboard',
      schedule: 'Schedule',
      wallet: 'Wallet',
      reviews: 'Reviews',
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
    },
    // Errors
    errors: {
      generic: 'Something went wrong',
      networkError: 'Network error. Please check your connection.',
      unauthorized: 'You are not authorized to perform this action',
      notFound: 'Resource not found',
      validationError: 'Please check your input',
      serverError: 'Server error. Please try again later.',
    },
  },
  pt: {
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
    },
    // Provider specific
    provider: {
      availabilityPreferences: 'Preferências de Disponibilidade',
      availabilityDesc: 'Gerir as suas preferências de trabalho',
      acceptRecurring: 'Aceitar Clientes Recorrentes',
      acceptRecurringDesc: 'Permitir que clientes o reservem regularmente',
      currentlyAvailable: 'Atualmente Disponível',
      currentlyAvailableDesc: 'Mostrar como disponível para novas reservas',
      verification: 'Verificação',
      verificationDesc: 'Aumentar a credibilidade do seu perfil',
      becomeVerified: 'Tornar-se Verificado',
      verifiedInfo: 'Prestadores verificados obtêm mais reservas e confiança dos clientes',
      languageRegion: 'Idioma e Região',
      myJobs: 'Os Meus Trabalhos',
      jobRequests: 'Pedidos de Trabalho',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      dashboard: 'Painel do Prestador',
      schedule: 'Horário',
      wallet: 'Carteira',
      reviews: 'Avaliações',
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
    },
    // Errors
    errors: {
      generic: 'Algo correu mal',
      networkError: 'Erro de rede. Verifique a sua conexão.',
      unauthorized: 'Não está autorizado a realizar esta ação',
      notFound: 'Recurso não encontrado',
      validationError: 'Por favor, verifique os seus dados',
      serverError: 'Erro do servidor. Tente novamente mais tarde.',
    },
  },
};

export type TranslationKeys = TranslationStructure;
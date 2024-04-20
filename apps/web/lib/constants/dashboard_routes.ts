export const ROUTES = {
  Dashboard: '/dashboard',
  Hospitals: '/dashboard/hospitals',
  Ambulance: '/ambulance',
  Users: '/users',
  Booking: '/booking',
  Settings: '/settings',
  'Emergency contact': '/emergency-contact',
  'Sign in': '/signin',
  'Manage Admins': '/admins',
  SupportChat: '/support-chat',
  // sub routes
  'Ambulance_Manufacturers': '',
  'Ambulance_AddNewType': '',
  'Ambulance_AddNewManufacturer': '',
  
  'User_Medical_Coorp': '',

  'Booking_Chat': '',
  'Booking_Tracking': '',

  'Settings_Payment': '',
  'Settings_API': '',
  'settings_Policy': ''
};

ROUTES['Ambulance_Manufacturers'] = `${ROUTES['Ambulance']}/manufacturers`
ROUTES['Ambulance_AddNewType'] = `${ROUTES['Ambulance']}/new-type`
ROUTES['Ambulance_AddNewManufacturer']= `${ROUTES['Ambulance']}/new-manufacturer`

ROUTES['User_Medical_Coorp'] = `${ROUTES['Users']}/medicalcrop`

ROUTES['Booking_Chat'] = `${ROUTES['Booking']}/chat`
ROUTES['Booking_Tracking'] = `${ROUTES['Booking']}/map-tracking`

ROUTES['Settings_Payment'] = `${ROUTES['Settings']}/payments`
ROUTES['Settings_API'] = `${ROUTES['Settings']}/api`
ROUTES['settings_Policy'] = `${ROUTES['Settings']}/policy`


export const SUB_ROUTES: Partial<Record<keyof typeof ROUTES, { name: string; link: string }[]>> = {
  Users: [
    { name: 'Individual', link: ROUTES['Users'] },
    { name: 'Medical Coorp', link: ROUTES['User_Medical_Coorp'] },
  ],
  Ambulance: [
    { name: 'Types', link: ROUTES['Ambulance'] },
    { name: 'Manufacturers', link: ROUTES['Ambulance_Manufacturers'] },
  ],
  Settings: [
    { name: 'General', link: ROUTES['Settings'] },
    { name: 'Payment Methods', link: ROUTES['Settings_Payment'] },
    { name: 'API Keys', link: ROUTES['Settings_API'] },
    { name: 'Policy & Terms', link: ROUTES['settings_Policy'] },
  ]
};



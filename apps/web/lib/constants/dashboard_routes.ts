export const ROUTES = {
  Dashboard: '/dashboard',
  Hospitals: '/dashboard/hospitals',
  Patients: '/dashboard/patients',
  Booking: '/booking',
  Settings: '/settings',
  'Emergency contact': '/dashboard/emergency-contact',
  'Sign in': '/signin',
  'Manage Admins': '/admins',
  SupportChat: '/support-chat',
  
  'User_Served': '',

  'Booking_Chat': '',
  'Booking_Tracking': '',

  'Settings_Payment': '',
  'Settings_API': '',
  'settings_Policy': ''
};


ROUTES['User_Served'] = `${ROUTES['Patients']}/served`

ROUTES['Booking_Chat'] = `${ROUTES['Booking']}/chat`
ROUTES['Booking_Tracking'] = `${ROUTES['Booking']}/map-tracking`

ROUTES['Settings_Payment'] = `${ROUTES['Settings']}/payments`
ROUTES['Settings_API'] = `${ROUTES['Settings']}/api`
ROUTES['settings_Policy'] = `${ROUTES['Settings']}/policy`


export const SUB_ROUTES: Partial<Record<keyof typeof ROUTES, { name: string; link: string }[]>> = {
  Patients: [
    { name: 'Pending', link: ROUTES['Patients'] },
    { name: 'Served', link: ROUTES['User_Served'] },
  ],
  Settings: [
    { name: 'General', link: ROUTES['Settings'] },
    { name: 'Payment Methods', link: ROUTES['Settings_Payment'] },
    { name: 'API Keys', link: ROUTES['Settings_API'] },
    { name: 'Policy & Terms', link: ROUTES['settings_Policy'] },
  ]
};


export const SLUG_ROUTES = [
  ROUTES.Hospitals
]

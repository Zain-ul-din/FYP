import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import adminCredentials from './firebase-admin-credentials.json';

const firebaseAdminConfig = {
  credential: cert(adminCredentials as ServiceAccount),
};

export function initAdminSDK() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';

const adminCredentials = {
  type: process.env.TYPE || '',
  project_id: process.env.PROJECT_ID || '',
  private_key_id: process.env.PRIVATE_KEY_ID || '',
  private_key: process.env.PRIVATE_KEY || '',
  client_email: process.env.CLIENT_EMAIL || '',
  client_id: process.env.CLIENT_ID || '',
  auth_uri: process.env.AUTH_URI || '',
  token_uri: process.env.TOKEN_URI || '',
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || '',
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL || '',
  universe_domain: process.env.UNIVERSE_DOMAIN || '',
};

/*
  "type": "service_account",
  "project_id": "fyp-proj-df4a5",
  "private_key_id": "8d8469946a249a8dfd3f10aa47c87da1e55cff92",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiGFOOAJDFKDALF9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbh3LD12/s9+fU\nS4nMGe37iIRkVxyWlIfcvNszsoR9iuc/S/7RSSNWZg++npzaofTdHXHFuoLWJCOI\nAObxD0AeNhdnc+tkWgpIOurefwNQvkqDxsPdi74USM+Ud1l1LLJfGpfgicO1aRuW\nnNkrwtZ780EEsN46a8SsAlS55IO1oA5HcJb8EIMsDcILU2dinpnlKaxQX9bSUZP+\nz+Xm0VTx2vsLk88I1jWl+6EDIsD7u1RwpodgCWEzad9kYJ70io3ieK40xADdlskR\nC+g6+DvUzY+0Ku4+P8jfVBIf7Ds0yNMmRfmR8Tnd5p+lGsB1Au5UerU3xoc70JAr\nn8WZ9manAgMBAAECggEAD6HGhC6UHlIwZ+MLv4rfo4duHxOuWOgm26XTtld7/45F\nfdQqkWhzd8ycSoFwrHzYupyqAcCkQ9ewBoxoqdPpkt/G7Gv3Pcfa/rWFQ8WqVKQ7\noxEIQK059pn22yo/wIo0h2CJ4VSXahVdY37ySPa1ThH99/W68E5CnzNAxspT/p4m\neNJg4BO+Y4fUX1D7ZwiPGbzN/icq4W4Ucchwk7cJL0fLAUfaDvfFzwR2WL3GTPR7\nEDnutpd3PPtgka157v57UJyWKVFoojF33Ipm4Jz2Vfdw8bM7HKhVJaSMT9wVtvxn\nVHTC9XqmGmQ/IndWO1OwvxPdpYVlaPOft50FyPqPEQKBgQDW1Tg1VCXpCeyGeUnh\naCusnmAG90p/YMcsZhsHPaLUVNoj1iBJ2qhzMieKgxrSJEcfBzQ/Ng+c5Q5GN+iA\nCzRHfwS8NMHCOyO8UsmqvndIx3OFN7FG0T2ytOltpnHq9GX+e8kqpEgW76zB4nPj\nWavfZ8uPuQtb5am7pnRDvGYEKQKBgQC5VQnzQ2ORpnRoBpPuNk05INwT/yUUks9k\n16vgytpxSdWSzfX5lhvaDSNbcA2REn9crSX+TRolwrucZbb6ycNRCKFs7pNJ4cFv\n7MTszZ64uCtoOMQ9/a7iq9jTLHjQdmcr2CZRnr4F28B44SReYgmZQIehzqxxPXix\nBxqV9VXuTwKBgHqbx++Pre85TbdVo5e0lzB2VwHCws690g6B260fPT4Hi1Pmkhj0\nZS0Rk8WWm4kRUVHhD61/0htOEv56TAQ/4L9pO6+aQHb0v6lsalI7T+LGiiSeq1tq\ncdb7Lzn4Q42/nDJIPYBLsCT+9s7UyiUX+WKQX3oQNu5kvaEuF67M6EA5AoGAZdmG\nDloKbhC8CC8VPOQ6rBqS16pwBk5oC1M68d6JDZk19eeaNf94buypcaayzfcMZzIA\nnzBgHkBWOizr0gbvf6jujZ7O8ttOIuRLlJerkngj4rLPpgG0Cn3GOsdF3co0CLRQ\n2qoSY8XQkJ2qDvRxsfb0ksexnMnbee4dfivFfaECgYBFeDnCwZQ9n3t/913ImTg9\nB4ndpNsxo1I37+1ZYbf1rXquGCCwLbWJC7NGKH4fzk/0KEs0nMh4kEmM2Zo4VEvT\na9u7yhzynNaNM6A4YOWSUCvKbMl8+3DDq98niaxV/cWtOTE2q6LwoOFEJzQTjKDw\nFGwkrcs582gaYSnVbk5zSQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-24vab@fyp-proj-df4a5.iam.gserviceaccount.com",
  "client_id": "114452160436955196062",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-24vab%40fyp-proj-df4a5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"

  update the keys of adminCredentials make sure to load from .env file

  
*/

const firebaseAdminConfig = {
  credential: cert(adminCredentials as ServiceAccount),
};

export function initAdminSDK() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}

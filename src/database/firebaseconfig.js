import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import Constants from 'expo-constants';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const { extra } = Constants.expoConfig;

// Configuración Web de Firebase
const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
};

// Validación mínima para ayudar a detectar errores de configuración
const requiredKeys = {
  FIREBASE_API_KEY: extra.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: extra.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: extra.FIREBASE_PROJECT_ID,
  FIREBASE_MESSAGING_SENDER_ID: extra.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: extra.FIREBASE_APP_ID,
};

const missing = Object.entries(requiredKeys).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  // Lanzar un error claro — evita el mensaje genérico de Firebase (invalid-api-key)
  throw new Error(
    `Faltan variables de entorno de Firebase: ${missing.join(', ')}. ` +
      `Crea un archivo .env (no lo subas al repositorio) con esas claves o configura las variables de entorno. Revisa app.config.js.`
  );
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };

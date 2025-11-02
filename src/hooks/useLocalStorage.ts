import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// BELANGRIJK: PLAK HIER JE EIGEN FIREBASE CONFIGURATIE
// Je vindt deze in je Firebase project onder:
// Projectinstellingen > tabblad Algemeen > scroll naar 'Jouw apps' en selecteer je web-app.
const firebaseConfig = {
  apiKey: "AIzaSyBf0qReK8c8EY_1tVaJw9oVnpVA2wYf1gQ",
  authDomain: "kerstwensen-3480a.firebaseapp.com",
  // OPGELOST: De 'databaseURL' moet exact overeenkomen met de locatie van je Realtime Database.
  // Ik heb deze nu ingesteld op de standaard 'us-central1' regio.
  // Controleer dit in je Firebase Console: Ga naar Realtime Database, de URL staat bovenaan.
  // Voorbeeld VS (standaard): https://<project-id>-default-rtdb.firebaseio.com
  // Voorbeeld Europa: https://<project-id>-default-rtdb.europe-west1.firebasedatabase.app
  databaseURL: "https://kerstwensen-3480a-default-rtdb.firebaseio.com",
  projectId: "kerstwensen-3480a",
  storageBucket:  "kerstwensen-3480a.appspot.com",
  messagingSenderId: "219745543099",
  appId: "1:219745543099:web:d80877234a011465fc5a9e"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);

// Exporteer de database-instantie zodat deze in de app kan worden gebruikt
export const db = getDatabase(app);

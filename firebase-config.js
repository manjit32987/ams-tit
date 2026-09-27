/**
 * ============================================================================
 * TIT ACADEMIC ATTENDANCE MANAGEMENT SYSTEM (AMS)
 * Firebase Configuration & Connection File
 * ============================================================================
 * 
 * Instructions to connect with your Firebase project:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select or create your project.
 * 3. Go to Project Settings (gear icon) > General > Your apps > Web app (</>).
 * 4. Copy your firebaseConfig object and paste it below.
 * 5. In Firebase Console > Build > Authentication:
 *    - Enable "Email/Password" sign-in provider.
 * 6. In Firebase Console > Build > Firestore Database:
 *    - Click "Create database" (in test or production mode).
 */

const firebaseConfig = {
  apiKey: "AIzaSyDRRF8QEKwD2DjbkCES60cgRaaQb2CvWdQ",
  authDomain: "ams-tit.firebaseapp.com",
  projectId: "ams-tit",
  storageBucket: "ams-tit.firebasestorage.app",
  messagingSenderId: "1086710269991",
  appId: "1:1086710269991:web:88b09bdb3f77cde82be602",
  measurementId: "G-P5PJ13FNKS"
};

// Global helper to check if valid credentials have been supplied
function isFirebaseConfigured() {
  return (
    typeof firebase !== 'undefined' &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}

// Global Firebase service instances
let app = null;
let analytics = null;
let firebaseAuthInstance = null;
let firestoreDbInstance = null;

try {
  if (isFirebaseConfigured()) {
    if (!firebase.apps.length) {
      app = firebase.initializeApp(firebaseConfig);
    } else {
      app = firebase.app();
    }
    firebaseAuthInstance = firebase.auth();
    firestoreDbInstance = firebase.firestore();

    // Initialize Analytics if supported and measurementId is present
    if (typeof firebase.analytics === 'function' && firebaseConfig.measurementId) {
      try {
        analytics = firebase.analytics();
      } catch (analyticsErr) {
        console.warn("ℹ️ Firebase Analytics note:", analyticsErr.message);
      }
    }

    console.log("🔥 Firebase connected successfully to project:", firebaseConfig.projectId);
  } else {
    console.log("ℹ️ Firebase is ready to connect. Add your keys in firebase-config.js to activate cloud sync.");
  }
} catch (error) {
  console.warn("⚠️ Firebase initialization notice:", error.message);
}

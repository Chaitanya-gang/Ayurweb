/* ==========================================================================
   AYURWEB - Firebase Initializer & Authentication Security (js/firebase.js)
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyBlSE5WGaCUcPvKyv8nm3NUlMkQi9lzhb8",
  authDomain: "asep-2ff77.firebaseapp.com",
  projectId: "asep-2ff77",
  storageBucket: "asep-2ff77.firebasestorage.app",
  messagingSenderId: "102128048020",
  appId: "1:102128048020:web:a9e984cb2dad153b382181"
};

let db = null;
let auth = null;
let currentAuthUid = null;

/* ==========================================================================
   FIRESTORE SECURITY RULES RECOMMENDATION
   Deploy to Firebase Console > Firestore Database > Rules:

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/profile/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ========================================================================== */

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    
    if (firebase.auth) {
      auth = firebase.auth();
      auth.onAuthStateChanged(user => {
        if (user) {
          currentAuthUid = user.uid;
          console.log("🔒 Authenticated Session ID:", currentAuthUid);
        } else {
          auth.signInAnonymously().catch(err => {
            console.warn("Anonymous auth fallback:", err.message);
          });
        }
      });
    }
    console.log("Firebase initialized securely.");
  }
} catch (e) {
  console.log('Firebase running in local offline storage fallback mode.');
}

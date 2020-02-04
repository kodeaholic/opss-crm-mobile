import * as firebase from "firebase/app"
import "firebase/messaging"
const initializedFirebaseApp = firebase.initializeApp({
  // Project Settings => Add Firebase to your web app
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})
const messaging = initializedFirebaseApp.messaging()
messaging.usePublicVapidKey(
  // Project Settings => Cloud Messaging => Web Push certificates (key pair)
  process.env.REACT_APP_FIREBASE_VAPID_KEY
)
export { messaging }

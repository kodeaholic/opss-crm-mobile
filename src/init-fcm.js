import * as firebase from 'firebase/app'
import 'firebase/messaging'

const init = () => {
  try {
    if (firebase.messaging.isSupported()) {
      return firebase.initializeApp({
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
      })
    }
    else {
      return undefined
    }
  }
  catch (e) {
    console.log(e.message)
    return undefined
  }
}
const initializedFirebaseApp = init()
const messaging = initializedFirebaseApp ? initializedFirebaseApp.messaging() : undefined
if (messaging) messaging.usePublicVapidKey(
  // Project Settings => Cloud Messaging => Web Push certificates (key pair)
  process.env.REACT_APP_FIREBASE_VAPID_KEY
)
export { messaging }

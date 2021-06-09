import firebaseApp from 'firebase/app'
import 'firebase/storage'
var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};
// Initialize Firebase
firebaseApp.initializeApp(firebaseConfig)

let Storage = firebaseApp.storage();

export default Storage

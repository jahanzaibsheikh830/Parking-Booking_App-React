import firebaseApp from 'firebase/app'
import 'firebase/storage'
var firebaseConfig = {
    apiKey: "AIzaSyDCXEsUcb59iNCf3JBeVaKUrraAsa8A07w",
    authDomain: "bloodapp-31bd2.firebaseapp.com",
    projectId: "bloodapp-31bd2",
    storageBucket: "bloodapp-31bd2.appspot.com",
    messagingSenderId: "61197933681",
    appId: "1:61197933681:web:c8f2db31707bb4e770cfd0"
};
// Initialize Firebase
firebaseApp.initializeApp(firebaseConfig)

let Storage = firebaseApp.storage();

export default Storage
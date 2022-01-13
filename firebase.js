import { getApps, initializeApp, getApp } from '@firebase/app';
import { GoogleAuthProvider, getAuth } from '@firebase/auth';
import { getFirestore } from "@firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbNh-BuUoYPlscr7GN_uh_YARxYOAyesk",
    authDomain: "chatjs-e9ee8.firebaseapp.com",
    projectId: "chatjs-e9ee8",
    storageBucket: "chatjs-e9ee8.appspot.com",
    messagingSenderId: "1024417639732",
    appId: "1:1024417639732:web:51cdd820f631415fa68961",
    measurementId: "${config.measurementId}"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {db, auth, provider};
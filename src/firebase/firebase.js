// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtl3LAbGu_bSNKdRvMmpE6X60RmgDH9AI",
  authDomain: "bachataalist-x7jsy8.firebaseapp.com",
  projectId: "bachataalist-x7jsy8",
  storageBucket: "bachataalist-x7jsy8.appspot.com",
  messagingSenderId: "211271837857",
  appId: "1:211271837857:web:fa181b4f3ff9afbb6368e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { app, db, auth, storage,provider };

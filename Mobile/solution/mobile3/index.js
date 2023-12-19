
import { initializeApp } from "firebase/app"
import { createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyC2G3pFXGQ028mFguwmQ2lTt92MRzRoufw",
    storageBucket: "wtctt2023-secguy888.appspot.com",
    appId: "1:874831948305:android:5606af5d393045e378dfb0",
    databaseURL: "https://wtctt2023-secguy888.firebaseio.com",
    authDomain: "wtctt2023-secguy888.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
//createUserWithEmailAndPassword(auth, "bxdman@gmail.com", "12345678").then((res) => { console.log(res) })
signInWithEmailAndPassword(auth, "bxdman@gmail.com", "12345678").then((res) => { console.log(res) })
// Import the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBudcioEHxsnJTzPBpLSY7IbaccUKHtxOI",
    authDomain: "ime40-fb722.firebaseapp.com",
    projectId: "ime40-fb722",
    storageBucket: "ime40-fb722.appspot.com",
    messagingSenderId: "820377462390",
    appId: "1:820377462390:web:0473e18f3b4b2cfeede157"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
const auth = getAuth(app);

export { auth };

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCrHpFEdR9wMfvvGhNM_6DMlviEA4ORw2k',
  authDomain: 'estate-web-app.firebaseapp.com',
  projectId: 'estate-web-app',
  storageBucket: 'estate-web-app.appspot.com',
  messagingSenderId: '703167342764',
  appId: '1:703167342764:web:6a4cf353c9b2b5870dd709',
};

// Initialize Firebase
 initializeApp(firebaseConfig);
export const db = getFirestore()
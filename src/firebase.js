// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4KwqbI3feD_F7JruVLQL1xIUkhU2Ul3k",
  authDomain: "poker-adebb.firebaseapp.com",
  projectId: "poker-adebb",
  storageBucket: "poker-adebb.firebasestorage.app",
  messagingSenderId: "708726946167",
  appId: "1:708726946167:web:2f29f4fab71b80706c4972"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export default firebaseApp;

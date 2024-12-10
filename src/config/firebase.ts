import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDf0ij7YJVmiw6i5BAAPKnZhWI59s8RpcY",
  authDomain: "newbdvideo.firebaseapp.com",
  databaseURL: "https://newbdvideo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "newbdvideo",
  storageBucket: "newbdvideo.firebasestorage.app",
  messagingSenderId: "201449335799",
  appId: "1:201449335799:web:313ad122d93575b7de5cf2",
  measurementId: "G-PGYSXPPBYP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
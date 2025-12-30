import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY-QWcsEq768rjWPe0pQVQUi1QoL_RWF8",
  authDomain: "aylin-space.firebaseapp.com",
  projectId: "aylin-space",
  storageBucket: "aylin-space.appspot.com",
  messagingSenderId: "1056292970254",
  appId: "1:1056292970254:web:16a91bb54d79a6570b415f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


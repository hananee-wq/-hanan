import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAFTNYeyjZpZMqCMJaTYRJOjs0vp7Hahkg",
  authDomain: "hanansci-3d209.firebaseapp.com",
  projectId: "hanansci-3d209",
  storageBucket: "hanansci-3d209.firebasestorage.app",
  messagingSenderId: "551680904431",
  appId: "1:551680904431:web:5abdeeb751f01363101f1a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

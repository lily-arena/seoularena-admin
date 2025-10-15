import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'; 
import { getStorage } from 'firebase/storage';

const firebaseConfig = { 
  apiKey: "AIzaSyDDMRJ9xVU79BPN6gF0KsEf4N1sQJeuxWw",
  authDomain: "gen-lang-client-0460432266.firebaseapp.com",
  projectId: "gen-lang-client-0460432266",
  storageBucket: "gen-lang-client-0460432266.firebasestorage.app",
  messagingSenderId: "908504758145",
  appId: "1:908504758145:web:b2666ac5fd7cef2bbf1a80"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// 5. 나중에 사용할 수 있도록 내보내기
export { db, collection, doc, setDoc };
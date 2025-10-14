import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
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

// 데이터베이스와 파일 저장소 기능을 사용할 수 있게 준비합니다.
export const db = getFirestore(app);
export const storage = getStorage(app);
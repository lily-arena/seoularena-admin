import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { set } from "firebase/database";
import { ref } from "firebase/database";
import { push } from "firebase/database";

const firebaseConfig = { 
  apiKey: "AIzaSyDDMRJ9xVU79BPN6gF0KsEf4N1sQJeuxWw",
  authDomain: "gen-lang-client-0460432266.firebaseapp.com",
  projectId: "gen-lang-client-0460432266",
  storageBucket: "gen-lang-client-0460432266.firebasestorage.app",
  messagingSenderId: "908504758145",
  appId: "1:908504758145:web:b2666ac5fd7cef2bbf1a80"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
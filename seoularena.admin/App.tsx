import React, { useState } from 'react';
import { ConstructionUpdate } from './components/ConstructionUpdate';
import { NewsUpdate } from './components/NewsUpdate';
import { Header } from './components/Header';
import { INITIAL_CONSTRUCTION_IMAGE, INITIAL_NEWS_ARTICLES } from './constants';
import type { NewsArticle } from './types';
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

const App: React.FC = () => {
  const [constructionImage, setConstructionImage] = useState<string>(INITIAL_CONSTRUCTION_IMAGE);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleUpdateConstructionImage = (newImageUrl: string) => {
    setConstructionImage(newImageUrl);
    showNotification('공사 현황 이미지가 성공적으로 업데이트되었습니다.');
  };

  const handleSaveNewsArticle = (articleToSave: NewsArticle) => {
    const existingIndex = newsArticles.findIndex(a => a.id === articleToSave.id);
    if (existingIndex > -1) {
      const updatedArticles = [...newsArticles];
      updatedArticles[existingIndex] = articleToSave;
      setNewsArticles(updatedArticles);
      showNotification('뉴스 기사가 수정되었습니다.');
    } else {
      setNewsArticles([articleToSave, ...newsArticles]);
      showNotification('새 뉴스 기사가 추가되었습니다.');
    }
  };

  const handleDeleteNewsArticle = (articleId: string) => {
    setNewsArticles(newsArticles.filter(a => a.id !== articleId));
    showNotification('뉴스 기사가 삭제되었습니다.');
  };

  /**
 * Creates a new article entry in the Firebase Realtime Database.
 * * @param {string} title - The article's title.
 * @param {string} url - The article's main URL.
 * @param {string} imageResourceUrl - The URL of the article's image.
 */
function createArticle(title, url, imageResourceUrl) {
  // 1. Get a reference to the 'articles' node
  const articlesRef = ref(database, 'articles');

  // 2. The data object for the new article
  const articleData = {
    title: title,
    url: url,
    // Use an ISO string for the date to ensure chronological sorting
    date: new Date().toISOString(), 
    imageResource: imageResourceUrl
  };

  // 3. Use push() to generate a unique key for the new article
  const newArticleRef = push(articlesRef);

  // 4. Use set() to write the data to that new, unique location
  set(newArticleRef, articleData)
    .then(() => {
      console.log("✅ Article added successfully with key:", newArticleRef.key);
      // Optional: Get the unique ID for later use
      const newArticleId = newArticleRef.key;
    })
    .catch((error) => {
      console.error("❌ Error adding article:", error);
    });
}

  return (
    <div className="min-h-screen bg-white text-brand-gray-900">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-12">
          <ConstructionUpdate 
            currentImage={constructionImage} 
            onUpdate={handleUpdateConstructionImage} 
          />
          <NewsUpdate
            articles={newsArticles}
            onSave={handleSaveNewsArticle}
            onDelete={handleDeleteNewsArticle}
          />
        </div>
      </main>

      {notification && (
        <div className="fixed bottom-5 right-5 bg-brand-gray-800 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}
       <style>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
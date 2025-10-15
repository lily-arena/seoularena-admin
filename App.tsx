import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, remove, DataSnapshot } from "firebase/database";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";

// =================================================================
// 0. 타입 및 상수 정의 (외부 파일 import 대신 내부 정의)
// =================================================================

// NewsArticle 타입 정의
type NewsArticle = {
  id: string; // Firebase Key
  title: string;
  link: string; // 기사 URL
  date: string; // YYYY-MM-DD 형식
  imageUrl: string; // 이미지 URL을 저장합니다.
};

// 상수 정의
export const INITIAL_CONSTRUCTION_IMAGE = 'https://placehold.co/1200x600/1e293b/ffffff?text=현장+사진을+업로드해주세요'; 

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: '서울 최초 K팝 전문공연장 \'서울아레나\' 착공…"연 250만명 유치"',
    link: 'https://www.hankyung.com/article/2024070268466',
    date: '2024-07-02',
    imageUrl: 'https://picsum.photos/seed/news1/400/225',
  },
  {
    id: 'news-2',
    title: '서울 동북권 \'K팝 글로벌 메카로\' 서울아레나 본격화',
    link: 'https://www.newsprime.co.kr/news/article/?no=702521',
    date: '2025-09-01',
    imageUrl: 'https://picsum.photos/seed/news2/400/225',
  },
  {
    id: 'news-3',
    title: '오세훈, 서울아레나 현장 점검… "\'월클\' K-팝 공연 성지 조성"',
    link: 'https://www.yna.co.kr/view/AKR20250901071700004',
    date: '2025-09-01',
    imageUrl: 'https://picsum.photos/seed/news3/400/225',
  }
];

// Firebase 초기화 (중복 정의 제거)
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
const auth = getAuth(app);


// =================================================================
// 1. 로그인 화면 컴포넌트
// =================================================================
interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-2xl w-96 border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">서울아레나 관리자 로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition duration-150"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition duration-150"
          required
        />
        <button type="submit" className="w-full bg-slate-600 text-white font-bold py-3 rounded-lg hover:bg-slate-700 transition duration-200 shadow-md">
          로그인
        </button>
        <p className="mt-4 text-xs text-gray-500 text-center">Firebase Authentication을 사용합니다.</p>
      </form>
    </div>
  );
};


// =================================================================
// 2. 헤더 컴포넌트
// =================================================================
const Header: React.FC = () => (
  <header className="bg-slate-800 text-white shadow-lg">
    <div className="container mx-auto p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-wide">
        서울아레나 관리자 패널
      </h1>
      <span className="text-sm opacity-75">데이터 관리 시스템 (RTDB)</span>
    </div>
  </header>
);

// =================================================================
// 3. 현장 사진 업데이트 컴포넌트
// =================================================================
interface ConstructionUpdateProps {
  currentImage: string;
  onUpdate: (imageUrl: string) => Promise<void>;
}

const ConstructionUpdate: React.FC<ConstructionUpdateProps> = ({ currentImage, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState(currentImage);

  useEffect(() => {
    setImageUrl(currentImage);
  }, [currentImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(imageUrl);
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800 border-b pb-2">🏗️ 현장 사진 관리 (URL 입력)</h2>
      
      <div className="mb-4">
        <p className="text-lg font-medium mb-2">현재 현장 사진</p>
        {currentImage && (
          <img 
            src={currentImage} 
            alt="현재 공사 현황" 
            className="w-full max-h-96 object-cover rounded-lg shadow-md mb-2" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = "https://placehold.co/1200x600/ef4444/ffffff?text=이미지+로드+오류";
            }}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
            새 현장 사진 URL
          </label>
          <input
            id="image-url"
            type="text"
            placeholder="http://example.com/new-construction.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 transition duration-150"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-slate-600 text-white font-bold py-3 rounded-lg hover:bg-slate-700 transition duration-200 shadow-md"
        >
          현장 사진 URL 업데이트
        </button>
      </form>
    </div>
  );
};


// =================================================================
// 4. 뉴스 업데이트 컴포넌트
// =================================================================
interface NewsUpdateProps {
  articles: NewsArticle[];
  onSave: (articleData: Omit<NewsArticle, 'id'>) => Promise<void>;
  onDelete: (articleId: string) => Promise<void>;
}

const NewsUpdate: React.FC<NewsUpdateProps> = ({ articles, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, link, date, imageUrl });
    // 입력 필드 초기화
    setTitle('');
    setLink('');
    setImageUrl('');
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 border-b pb-2">📰 보도 자료 관리 (URL 입력)</h2>

      {/* 새 기사 추가 폼 */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-8 space-y-3">
        <h3 className="text-xl font-bold mb-3 text-slate-700">새 기사 추가</h3>
        <input
          type="text"
          placeholder="뉴스 기사 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="url"
          placeholder="뉴스 기사 링크 (URL)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="대표 이미지 URL (http/https로 시작)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          기사 추가
        </button>
      </form>

      {/* 기존 기사 목록 */}
      <h3 className="text-xl font-bold mb-4 text-slate-700">등록된 기사 목록 ({articles.length}개)</h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center transition duration-150 hover:shadow-md">
            <div className="flex items-center space-x-4 min-w-0">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/64x64/cccccc/000000?text=No+Img";
                }}
              />
              <div className="min-w-0">
                <p className="font-semibold truncate text-slate-800">{article.title}</p>
                <p className="text-sm text-gray-500">{article.date}</p>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                  {article.link}
                </a>
              </div>
            </div>
            <button
              onClick={() => onDelete(article.id)}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200 flex-shrink-0 ml-4"
            >
              삭제
            </button>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-center text-gray-500 italic">등록된 보도 자료가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

// =================================================================
// 5. 메인 앱 컴포넌트
// =================================================================
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [constructionImage, setConstructionImage] = useState<string>(INITIAL_CONSTRUCTION_IMAGE);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);
  
  // -----------------------------------------------------------
  // 5.1 인증 및 로그인 로직
  // -----------------------------------------------------------
  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('✅ 로그인 성공!');
    } catch (error: any) {
      console.error("Login failed:", error.message);
      showNotification(`❌ 로그인 실패: ${error.message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);


  // -----------------------------------------------------------
  // 5.2 데이터 업데이트/삭제 핸들러
  // -----------------------------------------------------------
  const handleUpdateConstructionImage = useCallback(async (imageUrl: string) => {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      showNotification('❌ 유효한 이미지 URL(http/https로 시작)을 입력해주세요.');
      return;
    }

    try {
      const imageRef = ref(database, 'settings/constructionImage');
      await set(imageRef, imageUrl); 
      showNotification('✅ 현장 사진 URL이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('❌ 공사 현황 업데이트 오류:', error);
      showNotification('❌ 업데이트 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    }
  }, [showNotification]);

  const handleSaveNewsArticle = useCallback(async (articleData: Omit<NewsArticle, 'id'>) => {
    try {
      if (!articleData.imageUrl || !articleData.imageUrl.startsWith('http')) {
         showNotification('❌ 뉴스 이미지 URL을 입력해주세요.');
         return;
      }
      
      const articlesRef = ref(database, 'articles');
      const newArticleRef = push(articlesRef);
      await set(newArticleRef, articleData);
      
      showNotification('✅ 뉴스 기사가 성공적으로 추가되었습니다.');

    } catch (error) {
      console.error('❌ Error adding article:', error);
      showNotification('❌ 뉴스 기사 추가 중 오류가 발생했습니다.');
    }
  }, [showNotification]);

  const handleDeleteNewsArticle = useCallback(async (articleId: string) => {
    try {
      const articleRef = ref(database, `articles/${articleId}`);
      await remove(articleRef);
      showNotification('✅ 뉴스 기사가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('❌ Error deleting article:', error);
      showNotification('❌ 뉴스 기사 삭제 중 오류가 발생했습니다.');
    }
  }, [showNotification]);


  // -----------------------------------------------------------
  // 5.3 데이터 불러오기 (Read) 로직: RTDB에서 데이터 구독
  // -----------------------------------------------------------
  useEffect(() => {
    if (user) { // 로그인한 경우에만 데이터 구독 시작
      // 1. 공사 현황 이미지 URL 구독 (settings/constructionImage 경로)
      const imageRef = ref(database, 'settings/constructionImage');
      const unsubscribeImage = onValue(imageRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const imageUrl = snapshot.val();
          if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
            setConstructionImage(imageUrl);
          } else {
            setConstructionImage(INITIAL_CONSTRUCTION_IMAGE);
          }
        } else {
          setConstructionImage(INITIAL_CONSTRUCTION_IMAGE);
        }
      });

      // 2. 뉴스 기사 목록 구독 (articles 경로)
      const articlesRef = ref(database, 'articles');
      const unsubscribeArticles = onValue(articlesRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const articlesMap = snapshot.val();
          // 배열로 변환, 유효성 검사 후 날짜 순 정렬
          const articlesArray = Object.keys(articlesMap).map(key => ({
            id: key,
            ...articlesMap[key]
          } as NewsArticle)).filter(a => a.title && a.link && a.date && a.imageUrl) 
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNewsArticles(articlesArray);
        } else {
          setNewsArticles(INITIAL_NEWS_ARTICLES);
        }
      });

      return () => {
        unsubscribeImage();
        unsubscribeArticles();
      };
    }
  }, [user]); // user 상태가 변경될 때마다 재실행

  // -----------------------------------------------------------
  // 5.4 렌더링 (로그인 상태에 따라 분기)
  // -----------------------------------------------------------
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl font-semibold text-slate-700">로딩 중...</div>;
  }
  
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-brand-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
          {/* ConstructionUpdate: 현장 사진 URL 관리 */}
          <ConstructionUpdate 
            currentImage={constructionImage} 
            onUpdate={handleUpdateConstructionImage} 
          />
          {/* NewsUpdate: 보도 자료 URL 관리 */}
          <NewsUpdate
            articles={newsArticles}
            onSave={handleSaveNewsArticle}
            onDelete={handleDeleteNewsArticle}
          />
        </div>
      </main>

      {/* 알림 메시지 */}
      {notification && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-xl transition duration-300 transform animate-fade-in-out z-50">
          {notification}
        </div>
      )}
       <style>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

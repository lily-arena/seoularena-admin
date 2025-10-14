
import type { NewsArticle } from './types';

export const INITIAL_CONSTRUCTION_IMAGE = 'https://storage.googleapis.com/static.aiforge.studio/_gen/G/u/GuZ5QdJ8.png'; // Using a stable URL for the provided image

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: '서울 최초 K팝 전문공연장 \'서울아레나\' 착공…"연 250만명 유치"',
    url: 'https://www.hankyung.com/article/2024070268466',
    date: '2024-07-02',
    imageUrl: 'https://picsum.photos/seed/news1/400/225',
  },
  {
    id: 'news-2',
    title: '서울 동북권 \'K팝 글로벌 메카로\' 서울아레나 본격화',
    url: 'https://www.newsprime.co.kr/news/article/?no=702521',
    date: '2025-09-01',
    imageUrl: 'https://picsum.photos/seed/news2/400/225',
  },
  {
    id: 'news-3',
    title: '오세훈, 서울아레나 현장 점검… "\'월클\' K-팝 공연 성지 조성"',
    url: 'https://www.yna.co.kr/view/AKR20250901071700004',
    date: '2025-09-01',
    imageUrl: 'https://picsum.photos/seed/news3/400/225',
  }
];

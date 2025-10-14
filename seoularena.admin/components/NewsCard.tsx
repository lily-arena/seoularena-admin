import React from 'react';
import type { NewsArticle } from '../types';
import { Button } from './Button';

interface NewsCardProps {
  article: NewsArticle;
  onEdit: () => void;
  onDelete: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onEdit, onDelete }) => {
  return (
    <div className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-brand-gray-200">
      <img src={article.imageUrl} alt={article.title} className="w-32 h-20 object-cover rounded-md flex-shrink-0 border border-brand-gray-200" />
      <div className="flex-grow">
        <h4 className="font-bold text-brand-gray-900">{article.title}</h4>
        <p className="text-sm text-brand-gray-600">{article.date} - <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-gray-700">출처 보기</a></p>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onEdit} variant="secondary">수정</Button>
        <button onClick={onDelete} className="px-3 py-2 text-sm font-semibold text-brand-gray-600 rounded-md hover:bg-brand-gray-100 transition">삭제</button>
      </div>
    </div>
  );
};
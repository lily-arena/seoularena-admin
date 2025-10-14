import React, { useState } from 'react';
import type { NewsArticle } from '../types';
import { Button } from './Button';
import { Modal } from './Modal';
import { NewsForm } from './NewsForm';
import { NewsCard } from './NewsCard';

interface NewsUpdateProps {
  articles: NewsArticle[];
  onSave: (article: NewsArticle) => void;
  onDelete: (articleId: string) => void;
}

export const NewsUpdate: React.FC<NewsUpdateProps> = ({ articles, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  const handleOpenModal = (article?: NewsArticle) => {
    setEditingArticle(article || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSave = (article: NewsArticle) => {
    onSave(article);
    handleCloseModal();
  };

  return (
    <section className="bg-white p-6 rounded-lg border border-brand-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-brand-gray-900">뉴스 관리</h2>
        <Button onClick={() => handleOpenModal()}>새 뉴스 추가</Button>
      </div>
      <div className="space-y-4">
        {articles.length > 0 ? (
          articles.map(article => (
            <NewsCard 
              key={article.id}
              article={article}
              onEdit={() => handleOpenModal(article)}
              onDelete={() => onDelete(article.id)}
            />
          ))
        ) : (
          <p className="text-brand-gray-500 text-center py-8">등록된 뉴스가 없습니다.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={editingArticle ? '뉴스 수정' : '새 뉴스 추가'}>
          <NewsForm 
            article={editingArticle} 
            onSave={handleSave} 
            onCancel={handleCloseModal} 
          />
        </Modal>
      )}
    </section>
  );
};
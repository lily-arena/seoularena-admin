import React, { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';
import { Button } from './Button';

interface NewsFormProps {
  article: NewsArticle | null;
  onSave: (article: NewsArticle) => void;
  onCancel: () => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<NewsArticle, 'id'>>({
    title: '',
    url: '',
    date: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        url: article.url,
        date: article.date,
        imageUrl: article.imageUrl
      });
    } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ title: '', url: '', imageUrl: '', date: today }));
    }
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        alert('이미지를 추가해주세요.');
        return;
    }
    const articleToSave: NewsArticle = {
      id: article ? article.id : `news-${Date.now()}`,
      ...formData
    };
    onSave(articleToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-brand-gray-700">제목</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-gray-400 focus:ring-brand-gray-400 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-brand-gray-700">URL</label>
        <input type="url" name="url" id="url" value={formData.url} onChange={handleChange} required className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-gray-400 focus:ring-brand-gray-400 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-brand-gray-700">날짜</label>
        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-brand-gray-400 focus:ring-brand-gray-400 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-brand-gray-700">이미지</label>
        <div className="mt-2 space-y-2">
            {formData.imageUrl && (
              <img 
                src={formData.imageUrl} 
                alt="미리보기" 
                className="w-48 h-auto rounded-md object-cover border border-brand-gray-200" 
              />
            )}
            <input 
              type="file" 
              name="imageUrl" 
              id="imageUrl" 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-sm text-brand-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-brand-gray-300 file:text-sm file:font-semibold file:bg-brand-gray-50 file:text-brand-gray-700 hover:file:bg-brand-gray-100"
            />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t border-brand-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>취소</Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
};
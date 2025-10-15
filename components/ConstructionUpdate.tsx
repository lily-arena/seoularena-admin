// ConstructionUpdate.tsx 파일 전체 내용

import React, { useState } from 'react';

// onUpdate 핸들러는 이제 파일 객체 대신 URL 문자열만 받습니다.
interface ConstructionUpdateProps {
  currentImage: string;
  onUpdate: (imageUrl: string) => Promise<void>; 
}

export const ConstructionUpdate: React.FC<ConstructionUpdateProps> = ({ currentImage, onUpdate }) => {
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim().startsWith('http')) {
      alert('유효한 이미지 URL(http/https로 시작)을 입력해주세요.');
      return;
    }

    setIsUpdating(true);
    try {
      // App.tsx의 onUpdate 함수에 URL 문자열 전달
      await onUpdate(newImageUrl.trim()); 
      setNewImageUrl(''); // 성공 시 입력 필드 초기화
    } catch (error) {
      console.error("Update error:", error);
      alert('업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="bg-brand-gray-50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">공사 현황 이미지 업데이트 (URL 입력)</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 현재 이미지 미리보기 */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <h3 className="text-lg font-semibold mb-2">현재 이미지 미리보기</h3>
          <img 
            src={currentImage} 
            alt="현재 공사 현황 이미지" 
            className="w-full h-auto object-cover rounded-lg border border-brand-gray-200" 
            style={{ aspectRatio: '16 / 9' }}
            // 이미지 로딩 실패 시 대체 이미지 표시
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Image+Load+Error'; }}
          />
          <p className="text-sm text-brand-gray-600 mt-2 truncate" title={currentImage}>
            **현재 URL:** {currentImage}
          </p>
        </div>
        
        {/* URL 입력 폼 */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-brand-gray-700 mb-2">
                새 공사 현황 이미지 URL
              </label>
              <input
                id="imageUrl"
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Imgur, Google Photos 등 외부 이미지 링크를 붙여넣으세요."
                className="w-full p-2 border border-brand-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isUpdating}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isUpdating ? 'bg-brand-gray-500' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isUpdating ? '업데이트 중...' : 'URL로 업데이트'}
            </button>
          </form>
          <p className="mt-4 text-xs text-brand-gray-500">
            *이 방식은 Firebase Storage를 사용하지 않고 외부 이미지 호스팅 서비스의 **직접 URL**을 Realtime Database에 저장합니다.
          </p>
        </div>
      </div>
    </section>
  );
};
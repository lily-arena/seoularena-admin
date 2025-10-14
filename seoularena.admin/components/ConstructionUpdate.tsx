import React, { useState } from 'react';
import { generateDescriptionForImage } from '../services/geminiService';
import { Button } from './Button';

interface ConstructionUpdateProps {
  currentImage: string;
  onUpdate: (newImageUrl: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const ConstructionUpdate: React.FC<ConstructionUpdateProps> = ({ currentImage, onUpdate }) => {
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAltText(''); // Clear previous alt text
    }
  };

  const handleGenerateAltText = async () => {
    if (!newImageFile) return;
    setIsLoading(true);
    try {
      const base64Image = await fileToBase64(newImageFile);
      const description = await generateDescriptionForImage(base64Image, newImageFile.type);
      setAltText(description);
    } catch (error) {
      console.error(error);
      setAltText("대체 텍스트 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = () => {
    if (previewUrl) {
      onUpdate(previewUrl);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg border border-brand-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-brand-gray-900">공사 현황 업데이트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <h3 className="text-lg font-semibold text-brand-gray-800 mb-2">현재 이미지</h3>
          <img src={previewUrl || currentImage} alt="Seoul Arena Construction" className="rounded-lg w-full object-cover aspect-video border border-brand-gray-200" />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="image-upload" className="block text-lg font-semibold text-brand-gray-800 mb-2">새 이미지 업로드</label>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-brand-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-brand-gray-300 file:text-sm file:font-semibold file:bg-brand-gray-50 file:text-brand-gray-700 hover:file:bg-brand-gray-100"
            />
          </div>
          {newImageFile && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-brand-gray-800 mb-2">생성된 대체 텍스트</h3>
              <div className="w-full p-3 bg-brand-gray-50 border border-brand-gray-200 rounded-md min-h-[100px] text-brand-gray-800 text-sm">
                {isLoading ? '생성 중...' : altText || 'AI로 대체 텍스트를 생성하려면 아래 버튼을 클릭하세요.'}
              </div>
              <Button onClick={handleGenerateAltText} disabled={isLoading} variant="secondary" className="mt-2">
                {isLoading ? '생성 중...' : 'AI로 대체 텍스트 생성'}
              </Button>
            </div>
          )}
          <div className="border-t pt-4">
             <Button onClick={handleSaveChanges} disabled={!newImageFile}>변경사항 저장</Button>
          </div>
        </div>
      </div>
    </section>
  );
};
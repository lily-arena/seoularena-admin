import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white text-brand-gray-900 border-b border-brand-gray-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="font-extrabold">서울아레나</span> 페이지 관리하기
        </h1>
      </div>
    </header>
  );
};
'use client';

import React from 'react';
import { requestFcst } from '@/libs/fcst';
import { saveForecastData } from '@/libs/localforage';

export default function Header() {
  const fetchFcst = async () => {
    const fcsts = await requestFcst();
    if (!fcsts) return;

    fcsts.forEach((fcst) => {
      saveForecastData(fcst);
    });
  };
  
  return (
    <header className="fixed top-0 left-0 flex justify-between items-center border-b border-gray-400 px-4 py-2 w-full h-16">
      <h1 className="text-xl font-bold">Weather Forecast</h1>
      <div className="flex space-x-2">
        <button className="border border-gray-700 px-4 py-2 hover:bg-gray-200 rounded-xs" onClick={fetchFcst}>날씨 정보 불러오기</button>
        <button className="border border-gray-700 px-4 py-2 hover:bg-gray-200 rounded-xs">그리기</button>
      </div>
    </header>
  );
}
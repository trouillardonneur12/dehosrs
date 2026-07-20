import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = 'Veuillez patienter...' }) => (
  <div className="fixed inset-0 z-[99999] bg-white/95 flex items-center justify-center flex-col">
    <div className="h-[70px] w-[70px] border-[5px] border-solid border-ca-green border-r-[#ccc] border-b-[#ccc] rounded-full animate-spin" />
    <p className="mt-5 text-sm text-gray-700">{text}</p>
  </div>
);

export default Loader;

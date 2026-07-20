import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-center px-4 py-4">
        <img src="/logo-ca.svg" alt="Crédit Agricole" className="h-10 md:h-12" />
      </div>
    </header>
  );
};

export default Header;

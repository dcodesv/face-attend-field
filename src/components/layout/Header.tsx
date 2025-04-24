
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const goBack = () => {
    if (location.pathname === '/attendance' || location.pathname === '/enroll') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };
  
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b shadow-sm">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={goBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
    </header>
  );
};

export default Header;

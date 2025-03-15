import { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isMobileOpen={isMobileMenuOpen} closeMobileMenu={closeMobileMenu} />
      
      <div className="flex-1 md:ml-64">
        <Header openMobileMenu={openMobileMenu} />
        {children}
      </div>
    </div>
  );
};

export default Layout;

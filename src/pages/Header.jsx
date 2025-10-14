import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logoremove.png';

export default function Header({ isAdmin, products = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-light tracking-widest text-[#ebc280]">
          <img src={logo} alt="Logo" className="h-[120px] w-auto cursor-pointer" />
        </Link>
        
        {/* Navigation Desktop */}
        <nav className="hidden md:flex space-x-12 items-center">
          <Link 
            to="/" 
            className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
          >
            ACCUEIL
          </Link>
          <Link 
            to="/boutique" 
            className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/boutique' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
          >
            BOUTIQUE
          </Link>
          <Link 
            to="/blog" 
            className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/blog' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
          >
            BLOG
          </Link>
          <Link 
            to="/custom" 
           className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/custom' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
          >
           CUSTOM
          </Link>
          <Link
            to="/contact"
            className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/contact' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
          >
            CONTACT
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/admin' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
            >
              ADMIN
            </Link>
          )}
        </nav>

        {/* Menu Mobile */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-sm border-t border-zinc-800">
          <nav className="container mx-auto px-6 py-8 flex flex-col space-y-6">
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/' ? 'text-[#ebc280]' : 'text-white'}`}
            >
              ACCUEIL
            </Link>
            <Link 
              to="/boutique" 
              onClick={() => setMenuOpen(false)}
              className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/boutique' ? 'text-[#ebc280]' : 'text-white'}`}
            >
              BOUTIQUE
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setMenuOpen(false)}
              className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/blog' ? 'text-[#ebc280]' : 'text-white'}`}
            >
              BLOG
            </Link>
            <Link 
  to="/custom" 
  onClick={() => setMenuOpen(false)}
  className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/custom' ? 'text-[#ebc280]' : 'text-white'}`}
>
  CUSTOM
</Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/contact' ? 'text-[#ebc280]' : 'text-white'}`}
            >
              CONTACT
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/admin' ? 'text-[#ebc280]' : 'text-white'}`}
              >
                ADMIN
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
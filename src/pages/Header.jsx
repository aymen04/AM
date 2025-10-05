import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Header({ isAdmin, products }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extraire les catégories uniques des produits
  const categories = [
    {
      name: 'Colliers',
      slug: 'Collier',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
      count: products.filter(p => p.category === 'Collier').length
    },
    {
      name: 'Bracelets',
      slug: 'Bracelet',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop',
      count: products.filter(p => p.category === 'Bracelet').length
    },
    {
      name: 'Bagues',
      slug: 'Bague',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
      count: products.filter(p => p.category === 'Bague').length
    },
    {
      name: 'Boucles d\'oreilles',
      slug: 'Boucles d\'oreilles',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
      count: products.filter(p => p.category === 'Boucles d\'oreilles').length
    },
    {
      name: 'Pendentifs',
      slug: 'Pendentifs',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
      count: products.filter(p => p.category === 'Pendentifs').length
    }
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
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

          {/* Boutique avec Mega Menu */}
          <div 
            className="relative"
            onMouseEnter={() => setShowCategoryMenu(true)}
            onMouseLeave={() => setShowCategoryMenu(false)}
          >
            <Link 
              to="/boutique" 
              className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/boutique' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
            >
              BOUTIQUE
            </Link>

            {/* Mega Menu Catégories */}
            {showCategoryMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-screen max-w-4xl">
                <div className="bg-black/98 backdrop-blur-xl border border-[#ebc280]/20 rounded-2xl shadow-2xl shadow-[#ebc280]/10 overflow-hidden">
                  {/* En-tête du menu */}
                  <div className="bg-gradient-to-r from-[#ebc280]/10 to-transparent px-8 py-4 border-b border-[#ebc280]/20">
                    <h3 className="text-xl font-light text-[#ebc280] tracking-widest">
                      PARCOURIR PAR CATÉGORIE
                    </h3>
                  </div>

                  {/* Grille des catégories */}
                  <div className="grid grid-cols-4 gap-6 p-8">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/boutique?category=${category.slug}`}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#ebc280]/60 transition-all duration-300">
                          {/* Image */}
                          <div className="aspect-square overflow-hidden relative">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            
                            {/* Compteur */}
                            {category.count > 0 && (
                              <div className="absolute top-2 right-2 bg-[#ebc280] text-black text-xs font-bold px-2 py-1 rounded-full">
                                {category.count}
                              </div>
                            )}
                          </div>

                          {/* Nom */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-sm font-light tracking-wide group-hover:text-[#ebc280] transition-colors text-center">
                              {category.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Footer du menu */}
                  <div className="bg-zinc-900/50 px-8 py-4 border-t border-zinc-800">
                    <Link 
                      to="/boutique"
                      className="text-[#ebc280] hover:text-white transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
                    >
                      VOIR TOUTE LA COLLECTION →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link 
            to="/blog" 
            className={`text-sm tracking-wider uppercase transition-colors ${location.pathname === '/blog' ? 'text-[#ebc280]' : 'text-white hover:text-[#ebc280]'}`}
          >
            BLOG
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

            {/* Boutique avec sous-menu mobile */}
            <div>
              <Link 
                to="/boutique" 
                onClick={() => setMenuOpen(false)}
                className={`text-lg tracking-wider uppercase text-left block mb-4 ${location.pathname === '/boutique' ? 'text-[#ebc280]' : 'text-white'}`}
              >
                BOUTIQUE
              </Link>
              <div className="pl-6 space-y-3 border-l-2 border-[#ebc280]/20">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/boutique?category=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block text-gray-400 hover:text-[#ebc280] transition-colors text-sm"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/blog" 
              onClick={() => setMenuOpen(false)}
              className={`text-lg tracking-wider uppercase text-left ${location.pathname === '/blog' ? 'text-[#ebc280]' : 'text-white'}`}
            >
              BLOG
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
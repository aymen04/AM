import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from './assets/logo.png';
import video from './assets/video.mp4';
import './index.css';


import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Boutique from './pages/Boutique';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Header from './pages/Header';
import ProductDetail from './pages/ProductDetail';

import CategoryCarousel3D from './pages/CategoryCarousel3D';


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="bg-black text-white min-h-screen font-sans">
        {/* HEADER */}
       <Header isAdmin={isAdmin} products={products} />
         <Routes>
          <Route path="/" element={
            <>
              {/* HERO AVEC VIDÉO */}
              <div className="relative h-screen overflow-hidden">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 -translate-y-12">
                  <source src={video} type="video/mp4" />
                </video>
                
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
                
                <div className="relative h-full flex items-center justify-center text-center px-6">
                  <div className="max-w-4xl space-y-8 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-light tracking-widest text-white mb-6">
                      ÉLÉGANCE NATURELLE
                    </h1>
                    <p className="text-xl md:text-2xl text-[#ebc280] font-light tracking-wide">
                      Collection de bijoux en pierres précieuses
                    </p>
                    <Link to="/boutique" className="mt-12 px-12 py-4 bg-transparent border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 tracking-widest text-sm inline-block">
                      DÉCOUVRIR LA COLLECTION
                    </Link>
                  </div>
                </div>
              </div>
            <CategoryCarousel3D />
              {/* PRODUITS */}
              <section className="py-24 bg-zinc-900">
                <div className="container mx-auto px-6">
                  <h2 className="text-4xl font-light tracking-widest text-center text-[#ebc280] mb-16">
                    SÉLECTION EXCLUSIVE
                  </h2>
                  {loading ? (
                    <div className="text-center text-[#ebc280]">Chargement...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {products.slice(0, 6).map(product => (
                        <div key={product.id} className="group cursor-pointer">
                          <div className="relative overflow-hidden mb-4 aspect-square">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <h3 className="text-xl font-light tracking-wide text-white mb-2">{product.name}</h3>
                          <p className="text-[#ebc280] text-lg">{product.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-center mt-12">
                    <Link to="/boutique" className="px-10 py-3 border border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 tracking-widest text-sm">
                      VOIR TOUTE LA BOUTIQUE
                    </Link>
                  </div>
                </div>
              </section>
            </>
          } />
          <Route path="/boutique" element={<Boutique products={products} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel products={products} setProducts={setProducts} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} />} />

        </Routes>

        {/* FOOTER */}
        <footer className="bg-zinc-950 border-t border-zinc-800 py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="text-2xl font-light tracking-widest text-[#ebc280] mb-4">
                  AM
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Créations artisanales de haute joaillerie en pierres précieuses naturelles.
                  Chaque pièce est unique et réalisée avec passion.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-white font-medium mb-4 tracking-wide">NAVIGATION</h3>
                <ul className="space-y-2">
                  <li><Link to="/boutique" className="text-gray-400 hover:text-[#ebc280] transition-colors text-sm">Boutique</Link></li>
                  <li><Link to="/blog" className="text-gray-400 hover:text-[#ebc280] transition-colors text-sm">Blog</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-[#ebc280] transition-colors text-sm">Contact</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-white font-medium mb-4 tracking-wide">CONTACT</h3>
                <div className="space-y-2 text-gray-400 text-sm">
                  <p>📍 [Votre Adresse]</p>
                  <p>📞 [Votre Téléphone]</p>
                  <p>✉️ contact@pierresprecieuses.com</p>
                </div>
              </div>

              {/* Réseaux Sociaux */}
              <div>
                <h3 className="text-white font-medium mb-4 tracking-wide">SUIVEZ-NOUS</h3>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/alwaysmakeitshine/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ebc280] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://wa.me/33614292330?text=Bonjour, je suis intéressé par vos bijoux." target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#ebc280] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-zinc-800 pt-8 text-center">
              <p className="text-gray-400 text-sm tracking-wide">
                © 2025 AM Tous droits réservés. Créations artisanales de haute joaillerie.
              </p>
              {!isAdmin && (
                <button
                  onClick={() => {
                    const password = prompt('Mot de passe administrateur:');
                    if (password === 'AM@2025') {
                      setIsAdmin(true);
                    } else {
                      alert('Mot de passe incorrect.');
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-[#ebc280] text-black font-semibold rounded hover:bg-yellow-400 transition"
                >
                  Accès Admin
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

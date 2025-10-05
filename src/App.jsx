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
        <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
          <div className="container mx-auto px-6 text-center">
            <div className="text-2xl font-light tracking-widest text-[#ebc280] mb-4">
              PIERRES PRÉCIEUSES
            </div>
            <p className="text-gray-400 text-sm tracking-wide">
              © 2024 Tous droits réservés. Créations artisanales de haute joaillerie.
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
        </footer>
      </div>
    </Router>
  );
}

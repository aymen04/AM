import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCarousel3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const categories = [
    {
      id: 1,
      name: 'Colliers',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
      count: '12 créations',
      description: 'Élégance autour du cou'
    },
    {
      id: 2,
      name: 'Bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
      count: '18 créations',
      description: 'Sublimez vos poignets'
    },
    {
      id: 3,
      name: 'Bagues',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
      count: '24 créations',
      description: 'Bijoux de caractère'
    },
    {
      id: 4,
      name: 'Boucles d\'oreilles',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      count: '15 créations',
      description: 'Lumière et raffinement'
    }
  ];

  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating, categories.length]);

  const getCardStyle = (index) => {
    const position = (index - currentIndex + categories.length) % categories.length;
    const totalCards = categories.length;
    
    // Calcul de la position sur le cercle
    const angle = (position / totalCards) * Math.PI * 2;
    const radius = 280;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const rotateY = (angle * 180) / Math.PI;
    
    // Opacité et échelle basées sur la position
    const isCurrent = position === 0;
    const opacity = isCurrent ? 1 : position === 1 || position === totalCards - 1 ? 0.5 : 0.2;
    const scale = isCurrent ? 1.2 : position === 1 || position === totalCards - 1 ? 0.85 : 0.6;
    
    return {
      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: isCurrent ? 10 : 5 - Math.abs(position - 2)
    };
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setIsAutoRotating(false);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    setIsAutoRotating(false);
  };

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* Effet de lumière d'ambiance */}
      <div className="absolute inset-0 bg-gradient-radial from-[#ebc280]/10 via-transparent to-transparent opacity-30"></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light tracking-widest text-[#ebc280] mb-6">
            MAGASINER PAR CATÉGORIE
          </h2>
          <p className="text-gray-400 text-lg tracking-wide">
            Explorez notre collection par type de bijou
          </p>
        </div>

        {/* Container 3D */}
        <div className="relative h-[600px] flex items-center justify-center">
          <div 
            className="relative w-full h-full"
            style={{ perspective: '1200px' }}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            {/* Carrousel 3D */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
              {categories.map((category, index) => {
                const position = (index - currentIndex + categories.length) % categories.length;
                const isCurrent = position === 0;
                
                return (
                  <div
                    key={category.id}
                    className="absolute transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      ...getCardStyle(index),
                      transformStyle: 'preserve-3d',
                      pointerEvents: isCurrent ? 'auto' : 'none'
                    }}
                    onClick={() => isCurrent && alert(`Naviguer vers ${category.name}`)}
                  >
                    <div className="relative w-[380px] h-[480px] group">
                      {/* Carte principale */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-[#ebc280]/20 bg-zinc-900">
                        {/* Image de fond */}
                        <div className="absolute inset-0">
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        </div>

                        {/* Contenu */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                          <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                            <p className="text-[#ebc280] text-sm tracking-widest mb-2 uppercase">
                              {category.count}
                            </p>
                            <h3 className="text-4xl font-light tracking-wide text-white mb-3">
                              {category.name}
                            </h3>
                            <p className="text-gray-300 text-sm mb-6 tracking-wide">
                              {category.description}
                            </p>
                            
                            {isCurrent && (
                              <button className="px-8 py-3 border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 tracking-widest text-xs opacity-0 group-hover:opacity-100">
                                DÉCOUVRIR
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Effet de brillance au survol */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ebc280]/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        </div>
                      </div>

                      {/* Ombre portée dynamique */}
                      {isCurrent && (
                        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 w-[90%] h-8 bg-[#ebc280]/20 blur-2xl rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boutons de navigation */}
          <button
            onClick={prev}
            className="absolute left-4 md:left-12 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 rounded-full border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-black/30"
          >
            <ChevronLeft size={28} />
          </button>
          
          <button
            onClick={next}
            className="absolute right-4 md:right-12 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 rounded-full border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-black/30"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Indicateurs de position */}
        <div className="flex justify-center gap-3 mt-12">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoRotating(false);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-12 h-3 bg-[#ebc280]'
                  : 'w-3 h-3 bg-[#ebc280]/30 hover:bg-[#ebc280]/60'
              }`}
            />
          ))}
        </div>

        {/* Info rotation auto */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm tracking-wide">
            {isAutoRotating ? '⟳ Rotation automatique' : 'Pause - Survolez pour explorer'}
          </p>
        </div>
      </div>
    </section>
  );
}
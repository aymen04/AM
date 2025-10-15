import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Boutique({ products }) {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Normaliser les catégories pour matcher ta BDD
  const normalizeCategory = (cat) => {
    if (!cat) return '';
    const c = cat.toLowerCase().trim();
    
    // Mapper les variations vers les catégories standards
    if (c.includes('collier')) return 'Collier';
    if (c.includes('bracelet')) return 'Bracelet';
    if (c.includes('bague')) return 'Bague';
    if (c.includes('boucle')) return 'Boucles d\'oreilles';
    if (c.includes('pendentif')) return 'Pendentif';
    
    // Si pas de match, retourner la catégorie originale normalisée
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Supprimer les doublons
  const uniqueProductsMap = new Map();
  products.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });
  const uniqueProducts = Array.from(uniqueProductsMap.values());

  // Catégories standards pour les filtres
  const categories = ['Tous', 'Collier', 'Bracelet', 'Bague', 'Boucles d\'oreilles', 'Pendentif'];

  // Filtrer les produits
  const filteredProducts = uniqueProducts.filter(product => {
    const productCategory = normalizeCategory(product.category);
    const matchCategory = selectedCategory === 'Tous' || productCategory === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light tracking-widest text-[#ebc280] mb-6">
            NOTRE COLLECTION
          </h1>
          <p className="text-gray-400 text-lg tracking-wide max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de bijoux en pierres précieuses, créés avec passion et savoir-faire
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-6 py-4 bg-zinc-900 border border-zinc-700 text-white rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <Filter className="text-gray-400 flex-shrink-0" size={20} />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-3 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[#ebc280] text-black font-medium'
                      : 'bg-zinc-900 text-gray-300 border border-zinc-700 hover:border-[#ebc280]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-6 text-gray-400">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            {totalPages > 1 && ` (Page ${currentPage} sur ${totalPages})`}
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-400 mb-2">Aucun produit trouvé</p>
            <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {paginatedProducts.map(product => (
                <Link 
                  to={`/product/${product.id}`} 
                  key={product.id}
                  className="group"
                >
                  <div className="bg-zinc-900 overflow-hidden rounded-lg hover:shadow-2xl hover:shadow-[#ebc280]/10 transition-all duration-300 border border-zinc-800 hover:border-[#ebc280]/40">
                    <div className="relative aspect-square overflow-hidden bg-zinc-800">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : '/src/assets/logo.jpeg'}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {product.category && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-[#ebc280] text-xs tracking-wider rounded-full border border-[#ebc280]/30">
                          {normalizeCategory(product.category)}
                        </div>
                      )}

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button className="px-6 py-3 bg-[#ebc280] text-black hover:bg-[#d4a860] transition-colors rounded-lg flex items-center gap-2 text-sm font-medium tracking-wide">
                          <ShoppingBag size={16} />
                          Voir le produit
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-light tracking-wide text-white mb-2 group-hover:text-[#ebc280] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[#ebc280] text-xl font-medium">{product.price}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-gray-300 rounded-lg hover:border-[#ebc280] hover:text-[#ebc280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Précédent
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-[#ebc280] text-black'
                            : 'bg-zinc-900 border border-zinc-700 text-gray-300 hover:border-[#ebc280] hover:text-[#ebc280]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-gray-300 rounded-lg hover:border-[#ebc280] hover:text-[#ebc280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
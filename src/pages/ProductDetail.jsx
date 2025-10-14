import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Share2, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';

export default function ProductDetail({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-4">Produit non trouvé</h2>
          <button 
            onClick={() => navigate('/boutique')}
            className="px-8 py-3 border border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  // Images (utiliser les images du produit ou l'image principale)
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-12">
          <button onClick={() => navigate('/')} className="hover:text-[#ebc280] transition-colors">
            Accueil
          </button>
          <span>/</span>
          <button onClick={() => navigate('/boutique')} className="hover:text-[#ebc280] transition-colors">
            Boutique
          </button>
          <span>/</span>
          <span className="text-[#ebc280]">{product.category || 'Produit'}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Galerie d'images */}
          <div className="space-y-6">
            {/* Image principale */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 group">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Navigation images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ebc280] hover:text-black transition-all flex items-center justify-center"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ebc280] hover:text-black transition-all flex items-center justify-center"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Badge stock */}
              {product.stock && parseInt(product.stock) < 5 && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white text-sm rounded-full">
                  Plus que {product.stock} en stock !
                </div>
              )}
            </div>

            {/* Miniatures */}
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-[#ebc280] scale-105' 
                      : 'border-transparent hover:border-[#ebc280]/50'
                  }`}
                >
                  <img src={img} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-8">
            {/* Catégorie */}
            {product.category && (
              <div className="inline-block px-4 py-2 bg-[#ebc280]/10 text-[#ebc280] text-sm tracking-widest rounded-full">
                {product.category}
              </div>
            )}

            {/* Titre */}
            <h1 className="text-5xl font-light tracking-wide text-white leading-tight">
              {product.name}
            </h1>

            {/* Note */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-[#ebc280] text-[#ebc280]" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">(24 avis)</span>
            </div>

            {/* Prix */}
            <div className="py-6 border-y border-zinc-800">
              <div className="text-5xl font-light text-[#ebc280]">
                {product.price}
              </div>
              <p className="text-gray-400 mt-2">TVA incluse • Livraison gratuite</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-light text-white mb-4 tracking-wide">Description</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description || 'Bijou d\'exception en pierres précieuses, créé avec soin par nos artisans. Chaque pièce est unique et reflète l\'harmonie entre la beauté naturelle des pierres et un savoir-faire artisanal d\'excellence.'}
              </p>
            </div>

            {/* Caractéristiques */}
            <div className="space-y-3">
              <h3 className="text-xl font-light text-white mb-4 tracking-wide">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={18} className="text-[#ebc280]" />
                  <span>Pierre VVS1</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={18} className="text-[#ebc280]" />
                  <span>Métaux précieux</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={18} className="text-[#ebc280]" />
                  <span>Livraison offerte</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={18} className="text-[#ebc280]" />
                  <span>Garantie 2 ans</span>
                </div>
              </div>
            </div>

            {/* Quantité */}
            <div className="flex items-center gap-4">
              <span className="text-white">Quantité :</span>
              <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 rounded transition-colors text-white"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 rounded transition-colors text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button className="w-full py-5 bg-[#ebc280] text-black hover:bg-[#d4a860] transition-all duration-300 tracking-widest text-sm font-medium flex items-center justify-center gap-3 rounded-lg">
                <ShoppingBag size={20} />
                AJOUTER AU PANIER
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`py-4 border-2 transition-all duration-300 tracking-widest text-sm font-medium flex items-center justify-center gap-2 rounded-lg ${
                    isFavorite
                      ? 'border-red-500 text-red-500 bg-red-500/10'
                      : 'border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black'
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  {isFavorite ? 'FAVORI' : 'FAVORIS'}
                </button>

                <button className="py-4 border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 tracking-widest text-sm font-medium flex items-center justify-center gap-2 rounded-lg">
                  <Share2 size={20} />
                  PARTAGER
                </button>
              </div>
            </div>

            {/* Garanties */}
            <div className="bg-zinc-900 rounded-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ebc280]/20 flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="text-[#ebc280]" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Livraison gratuite</h4>
                  <p className="text-gray-400 text-sm">Sous 2-3 jours ouvrés</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ebc280]/20 flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="text-[#ebc280]" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Retour gratuit</h4>
                  <p className="text-gray-400 text-sm">30 jours pour changer d'avis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ebc280]/20 flex items-center justify-center flex-shrink-0">
                  <Check size={18} className="text-[#ebc280]" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Paiement sécurisé</h4>
                  <p className="text-gray-400 text-sm">Cryptage SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
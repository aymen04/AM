import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Trash2, Plus, X, ImagePlus, Lock, Package, Eye } from 'lucide-react';

export default function AdminPanel({ products, setProducts, setIsAdmin }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [customOrders, setCustomOrders] = useState([]);

  useEffect(() => {
    setIsAdmin(true);
    fetchCustomOrders();
  }, []);

  const fetchCustomOrders = async () => {
    try {
      const response = await fetch('https://am-wniz.onrender.com/custom-orders');
      const data = await response.json();
      setCustomOrders(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };



  // Gérer le changement d'images (upload local)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Importer depuis Excel
  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const normalizeCategory = (cat) => {
          if (!cat) return '';
          const c = cat.toLowerCase().trim();
          if (c.includes('collier')) return 'collier';
          if (c.includes('bracelet')) return 'bracelet';
          if (c.includes('bague')) return 'bague';
          if (c.includes('boucle d\'oreille') || c.includes('boucles d\'oreilles')) return 'boucle d\'oreille';
          if (c.includes('pendentif') || c.includes('pendentifs')) return 'pendentif';
          return '';
        };

        const importedProducts = jsonData.map((row) => ({
          name: row.Nom || row.nom || row.name || row.Name || '',
          price: row.Prix || row.prix || row.price || row.Price || '',
          category: normalizeCategory(row.Categorie || row.categorie || row.Category || row.category || ''),
          description: row.Description || row.description || row.Desc || row.desc || '',
          images: row.Image || row.image || row.ImageURL || row.imageURL ? [row.Image || row.image || row.ImageURL || row.imageURL] : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop']
        })).filter(p => p.name && p.price);

        // Add products via API
        addProductsViaAPI(importedProducts);
      } catch (error) {
        alert('❌ Erreur lors de l\'import du fichier Excel');
        console.error(error);
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = ''; // Reset input
  };

  const addProductsViaAPI = async (productsToAdd) => {
    setLoading(true);
    try {
      const promises = productsToAdd.map(product =>
        fetch('http://localhost:4000/backend/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
      );
      await Promise.all(promises);
      // Refetch products
      const response = await fetch('http://localhost:4000/backend/products');
      const updatedProducts = await response.json();
      setProducts(updatedProducts);
      alert(`✅ ${productsToAdd.length} produits importés avec succès !`);
    } catch (error) {
      alert('❌ Erreur lors de l\'import');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un produit manuellement
  const normalizeCategory = (cat) => {
    if (!cat) return '';
    const c = cat.toLowerCase().trim();
    if (c.includes('collier')) return 'collier';
    if (c.includes('bracelet')) return 'bracelet';
    if (c.includes('bague')|| c.includes('bagues')) return 'bague';
    if (c.includes('boucle d\'oreille') || c.includes('boucles d\'oreilles')) return 'boucle d\'oreille';
    if (c.includes('pendentif') || c.includes('pendentifs')) return 'pendentif';
    return '';
  };

  const handleAddProduct = async () => {
    if (!name || !price) {
      alert('⚠️ Veuillez remplir au moins le nom et le prix');
      return;
    }

    const newProduct = {
      name,
      price,
      category: normalizeCategory(category),
      description,
      stock: stock || null,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop']
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/backend/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        // Refetch products
        const fetchResponse = await fetch('http://localhost:4000/backend/products');
        const updatedProducts = await fetchResponse.json();
        setProducts(updatedProducts);

        // Reset le formulaire
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setStock('');
        setImages([]);
        setShowAddForm(false);
        
        alert('✅ Produit ajouté avec succès !');
      } else {
        alert('❌ Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      alert('❌ Erreur réseau');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id) => {
    console.log('handleDeleteProduct called with id:', id);
    setLoading(true);
    try {
      console.log('Sending DELETE request to:', `http://localhost:4000/backend/products/${id}`);
      const response = await fetch(`http://localhost:4000/backend/products/${id}`, {
        method: 'DELETE'
      });
      console.log('DELETE response status:', response.status);

      if (response.ok) {
        // Refetch products
        const fetchResponse = await fetch('http://localhost:4000/backend/products');
        const updatedProducts = await fetchResponse.json();
        setProducts(updatedProducts);
        alert('🗑️ Produit supprimé !');
      } else {
        alert('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      alert('❌ Erreur réseau');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une commande personnalisée
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

const handleDeleteCustomOrder = async (id) => {
  console.log('🔍 ID de la commande à supprimer:', id);
  setDeleteConfirmId(id); // Ouvre la modal custom
};

const confirmDelete = async () => {
  const id = deleteConfirmId;
  setDeleteConfirmId(null); // Ferme la modal
  
  console.log('✅ Confirmation reçue, début de la suppression...');
  setLoading(true);
  
  try {
    console.log('🚀 Envoi DELETE vers:', `http://localhost:4000/custom-orders/${id}`);

    const response = await fetch(`https://am-wniz.onrender.com/custom-orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Réponse statut:', response.status);
    
    const data = await response.json();
    console.log('📥 Réponse data:', data);

    if (response.ok) {
      setCustomOrders(prevOrders => {
        const newOrders = prevOrders.filter(order => order.id !== id);
        console.log('✅ Commandes restantes:', newOrders.length);
        return newOrders;
      });
      alert('🗑️ Commande supprimée !');
    } else {
      console.error('❌ Erreur serveur:', data);
      alert(`❌ Erreur: ${data.error || 'Erreur inconnue'}`);
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
    alert('❌ Erreur réseau: ' + error.message);
  } finally {
    setLoading(false);
    console.log('🏁 Fin du processus de suppression');
  }
};
  return (
    <div className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-light tracking-widest text-center text-[#ebc280] mb-4">
          PANNEAU D'ADMINISTRATION
        </h1>
        <p className="text-center text-gray-400 mb-16 tracking-wide">
          Gérez votre catalogue et les commandes personnalisées
        </p>

        {/* Navigation des onglets */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-1/2 py-4 px-6 text-center transition-all duration-300 font-medium ${
                activeTab === 'products'
                  ? 'bg-[#ebc280] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Produits
            </button>
            <button
              onClick={() => setActiveTab('custom-orders')}
              className={`w-1/2 py-4 px-6 text-center transition-all duration-300 font-medium ${
                activeTab === 'custom-orders'
                  ? 'bg-[#ebc280] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Commandes Personnalisées
            </button>
          </div>
        </div>

        {/* Actions principales - Afficher seulement si onglet Produits */}
        {activeTab === 'products' && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Import Excel */}
              <div className="bg-zinc-900 p-8 rounded-lg border border-[#ebc280]/20 hover:border-[#ebc280]/40 transition-colors">
                <h2 className="text-2xl font-light text-[#ebc280] mb-4 flex items-center gap-3">
                  <Upload size={24} />
                  Importer depuis Excel
                </h2>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Importez votre catalogue complet depuis un fichier Excel (.xlsx)<br/>
                  <span className="text-xs text-gray-500">Colonnes: Nom, Prix, Categorie, Description, Image, Stock</span>
                </p>
                <label className="block">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleExcelImport}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="cursor-pointer w-full py-4 px-6 bg-[#ebc280] text-black hover:bg-[#d4a860] transition-all duration-300 tracking-widest text-sm font-medium flex items-center justify-center gap-2 rounded-lg"
                  >
                    <Upload size={20} />
                    CHOISIR UN FICHIER EXCEL
                  </label>
                </label>
              </div>

              {/* Ajouter manuellement */}
              <div className="bg-zinc-900 p-8 rounded-lg border border-[#ebc280]/20 hover:border-[#ebc280]/40 transition-colors">
                <h2 className="text-2xl font-light text-[#ebc280] mb-4 flex items-center gap-3">
                  <Plus size={24} />
                  Ajouter un produit
                </h2>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Ajoutez un produit individuellement via le formulaire détaillé
                </p>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full py-4 px-6 border-2 border-[#ebc280] text-[#ebc280] hover:bg-[#ebc280] hover:text-black transition-all duration-300 tracking-widest text-sm font-medium rounded-lg"
                >
                  {showAddForm ? 'FERMER LE FORMULAIRE' : 'OUVRIR LE FORMULAIRE'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="max-w-4xl mx-auto mb-12 bg-zinc-900 p-8 rounded-lg border-2 border-[#ebc280]/40 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-light text-[#ebc280] tracking-wide">Nouveau Produit</h3>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Ligne 1 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 tracking-wide">Nom du produit *</label>
                  <input
                    type="text"
                    placeholder="Ex: Collier Améthyste"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 tracking-wide">Prix *</label>
                  <input
                    type="text"
                    placeholder="Ex: 289€"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                  />
                </div>
              </div>

              {/* Ligne 2 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2 tracking-wide">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="collier">Collier</option>
                    <option value="bracelet">Bracelet</option>
                    <option value="bague">Bague</option>
                     <option value="boucle d'oreille">Boucle d'oreille</option>
                    <option value="pendentif">Pendentif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 tracking-wide">Stock disponible</label>
                  <input
                    type="number"
                    placeholder="Ex: 10"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-gray-400 text-sm mb-2 tracking-wide">Images du produit</label>
                <div className="flex gap-4 items-center">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer w-full py-4 px-6 bg-black border border-zinc-700 text-white rounded-lg hover:border-[#ebc280] transition-colors flex items-center justify-center gap-2"
                    >
                      <ImagePlus size={20} />
                      {images.length > 0 ? `${images.length} image(s) sélectionnée(s)` : 'Choisir des images'}
                    </label>
                  </label>
                  {images.length > 0 && (
                    <div className="flex gap-2">
                      {images.slice(0, 3).map((img, index) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-[#ebc280]">
                          <img src={img} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {images.length > 3 && <div className="w-20 h-20 rounded-lg border-2 border-[#ebc280] flex items-center justify-center text-[#ebc280]">+{images.length - 3}</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 text-sm mb-2 tracking-wide">Description</label>
                <textarea
                  placeholder="Décrivez le produit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors resize-none"
                ></textarea>
              </div>

              {/* Bouton */}
              <button
                onClick={handleAddProduct}
                disabled={loading}
                className="w-full py-5 bg-[#ebc280] text-black hover:bg-[#d4a860] transition-colors tracking-widest text-sm font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus size={20} />
                {loading ? 'AJOUT EN COURS...' : 'AJOUTER LE PRODUIT'}
              </button>
            </div>
          </div>
        )}

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'products' ? (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-light text-white tracking-wide">
                Catalogue <span className="text-[#ebc280]">({products.length})</span>
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-xl text-gray-400 mb-2">Aucun produit dans le catalogue</p>
                <p className="text-gray-500">Importez un fichier Excel ou ajoutez des produits manuellement</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-[#ebc280]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#ebc280]/10"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <ImagePlus size={40} />
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-2xl font-light text-white mb-1 tracking-wide">{product.name}</h3>
                            <p className="text-[#ebc280] text-xl font-medium">{product.price}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loading}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300 group disabled:opacity-50"
                            title="Supprimer ce produit"
                          >
                            <Trash2 size={22} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>

                        <div className="flex gap-3 text-sm mb-3">
                          {product.category && (
                            <span className="px-3 py-1 bg-[#ebc280]/10 text-[#ebc280] rounded-full border border-[#ebc280]/20">
                              {product.category}
                            </span>
                          )}
                          {product.stock && (
                            <span className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full border border-zinc-700">
                              Stock: {product.stock}
                            </span>
                          )}
                        </div>

                        {product.description && (
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-light text-white tracking-wide">
                Commandes Personnalisées <span className="text-[#ebc280]">({customOrders.length})</span>
              </h2>
            </div>

            {customOrders.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="text-6xl mb-4">💎</div>
                <p className="text-xl text-gray-400 mb-2">Aucune commande personnalisée</p>
                <p className="text-gray-500">Les nouvelles demandes apparaîtront ici</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {customOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-[#ebc280]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#ebc280]/10"
                  >
                    <div className="flex gap-6">
                      {/* Images */}
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                        {(() => {
                          try {
                            const images = order.images ? JSON.parse(order.images) : [];
                            if (images && images.length > 0) {
                              return (
                                <img
                                  src={`http://localhost:4000/backend/uploads/${images[0]}`}
                                  alt="Inspiration"
                                  className="w-full h-full object-cover"
                                />
                              );
                            }
                          } catch (error) {
                            console.error('Erreur lors du parsing des images:', error);
                          }
                          return (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <Package size={40} />
                            </div>
                          );
                        })()}
                      </div>

                      {/* Infos */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-2xl font-light text-white mb-1 tracking-wide">Commande #{order.id}</h3>
                            <p className="text-[#ebc280] text-lg font-medium">{order.name}</p>
                            <p className="text-gray-400 text-sm">{order.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(`mailto:${order.email}`, '_blank')}
                              className="p-3 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-300"
                              title="Contacter le client"
                            >
                              <Eye size={22} />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomOrder(order.id)}
                              disabled={loading}
                              className="p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300 group disabled:opacity-50"
                              title="Supprimer cette commande"
                            >
                              <Trash2 size={22} className="group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Type de projet</p>
                            <span className="px-3 py-1 bg-[#ebc280]/10 text-[#ebc280] rounded-full border border-[#ebc280]/20 text-sm">
                              {order.project_type}
                            </span>
                          </div>
                          {order.budget && (
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Budget</p>
                              <span className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full border border-zinc-700 text-sm">
                                {order.budget}
                              </span>
                            </div>
                          )}
                        </div>

                        {order.description && (
                          <div className="mb-3">
                            <p className="text-gray-400 text-sm mb-1">Description</p>
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                              {order.description}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                          {(() => {
                            try {
                              const images = order.images ? JSON.parse(order.images) : [];
                              if (images && images.length > 0) {
                                return <span>{images.length} image(s)</span>;
                              }
                            } catch (error) {
                              console.error('Erreur lors du parsing des images:', error);
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modal de confirmation de suppression */}
{deleteConfirmId && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-zinc-900 p-8 rounded-lg shadow-2xl border border-[#ebc280]/20 max-w-md w-full mx-4">
      <h3 className="text-2xl font-light text-[#ebc280] mb-4">Confirmer la suppression</h3>
      <p className="text-gray-300 mb-6">
        Êtes-vous sûr de vouloir supprimer cette commande personnalisée ? Cette action est irréversible.
      </p>
      <div className="flex gap-4">
        <button
          onClick={confirmDelete}
          className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Supprimer
        </button>
        <button
          onClick={() => setDeleteConfirmId(null)}
          className="flex-1 py-3 bg-zinc-700 text-white font-semibold rounded-lg hover:bg-zinc-600 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Trash2, Plus, X, ImagePlus } from 'lucide-react';

export default function AdminPanel({ products, setProducts }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gérer le changement d'image (upload local)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
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
          if (c.includes('boucle d\'oreille') || c.includes('boucles d\'oreilles')) return 'boucle d\'oreille';
          if (c.includes('pendentif') || c.includes('pendentifs')) return 'pendentif';
          return '';
        };

        const importedProducts = jsonData.map((row) => ({
          name: row.Nom || row.nom || row.name || row.Name || '',
          price: row.Prix || row.prix || row.price || row.Price || '',
          category: normalizeCategory(row.Categorie || row.categorie || row.Category || row.category || ''),
          description: row.Description || row.description || row.Desc || row.desc || '',
          image: row.Image || row.image || row.ImageURL || row.imageURL || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
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
        fetch('http://localhost:4000/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
      );
      await Promise.all(promises);
      // Refetch products
      const response = await fetch('http://localhost:4000/products');
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
      image: image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    };

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        // Refetch products
        const fetchResponse = await fetch('http://localhost:4000/products');
        const updatedProducts = await fetchResponse.json();
        setProducts(updatedProducts);

        // Reset le formulaire
        setName('');
        setPrice('');
        setCategory('');
        setDescription('');
        setStock('');
        setImage('');
        setImageFile(null);
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
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Refetch products
          const fetchResponse = await fetch('http://localhost:4000/products');
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
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-light tracking-widest text-center text-[#ebc280] mb-4">
          PANNEAU D'ADMINISTRATION
        </h1>
        <p className="text-center text-gray-400 mb-16 tracking-wide">
          Gérez votre catalogue de produits
        </p>

        {/* Actions principales */}
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

              {/* Image */}
              <div>
                <label className="block text-gray-400 text-sm mb-2 tracking-wide">Image du produit</label>
                <div className="flex gap-4 items-center">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer w-full py-4 px-6 bg-black border border-zinc-700 text-white rounded-lg hover:border-[#ebc280] transition-colors flex items-center justify-center gap-2"
                    >
                      <ImagePlus size={20} />
                      {imageFile ? imageFile.name : 'Choisir une image'}
                    </label>
                  </label>
                  {image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-[#ebc280]">
                      <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
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

        {/* Liste des produits */}
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
                      {product.image ? (
                        <img 
                          src={product.image} 
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
      </div>
    </div>
  );
}

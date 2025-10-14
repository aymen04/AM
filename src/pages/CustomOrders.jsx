import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Palette, Package, CheckCircle, Upload, X } from 'lucide-react';
import Diamond3D from '../components/Diamond3D';
import creation from '../assets/creation.jpeg';
import fabric from '../assets/fabric.jpeg';
import consultation from '../assets/consultation.jpeg';
import delivery from '../assets/delivery.jpeg';

export default function CustomOrders() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    description: '',
    inspiration: '',
    deadline: ''
  });
  const [images, setImages] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('projectType', formData.projectType);
      formDataToSend.append('budget', formData.budget);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('inspiration', formData.inspiration);
      formDataToSend.append('deadline', formData.deadline);

      // Add uploaded images
      images.forEach((img, index) => {
        formDataToSend.append('images', img.file);
      });

      const response = await fetch('https://am-wniz.onrender.com/custom-orders', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          description: '',
          inspiration: '',
          deadline: ''
        });
        setImages([]);
        setTimeout(() => setSubmitStatus(''), 3000);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const stepElements = document.querySelectorAll('.process-step');
      let newActive = 0;
      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          newActive = index;
        }
      });
      setActiveStep(newActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const processSteps = [
    {
      icon: MessageCircle,
      title: 'Consultation',
      description: 'Partagez votre vision et vos inspirations. Nous discutons de vos besoins, préférences et budget.',
      image: consultation
    },
    {
      icon: Palette,
      title: 'Design & Croquis',
      description: 'Notre artisan crée des croquis personnalisés de votre bijou. Révisions illimitées jusqu\'à satisfaction.',
      image: fabric
    },
    {
      icon: Sparkles,
      title: 'Création Artisanale',
      description: 'Fabrication méticuleuse de votre pièce unique avec des pierres sélectionnées pour vous.',
      image: creation
    },
    {
      icon: Package,
      title: 'Livraison Luxueuse',
      description: 'Votre bijou vous est livré dans un écrin raffiné avec certificat d\'authenticité.',
      image: delivery
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <Sparkles className="text-[#ebc280] mx-auto" size={48} />
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-widest text-[#ebc280] mb-6">
            CRÉATIONS SUR MESURE
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transformez votre vision en réalité. Nous créons des bijoux uniques qui racontent votre histoire, 
            conçus exclusivement pour vous avec des pierres précieuses d'exception.
          </p>
        </div>

        {/* 3D Diamond Animation - Fixed below header */}
        <div className="fixed top-32 right-8 z-50 w-64 h-64 pointer-events-none">
          <Diamond3D activeStep={activeStep} />
        </div>

        {/* Process Steps */}
        <div className="mb-24">
          <h2 className="text-4xl font-light tracking-widest text-center text-white mb-16">
            NOTRE PROCESSUS DE CRÉATION
          </h2>
          
          <div className="max-w-7xl mx-auto space-y-16">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`process-step flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center ${index === activeStep ? 'ring-2 ring-[#ebc280]/50 shadow-lg shadow-[#ebc280]/10' : ''} transition-all duration-500`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 relative group">
                  <div className="relative overflow-hidden rounded-2xl border border-[#ebc280]/20 aspect-video">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Step Number */}
                    <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-[#ebc280] text-black flex items-center justify-center text-2xl font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#ebc280]/10 border border-[#ebc280]/30 flex items-center justify-center">
                      <step.icon className="text-[#ebc280]" size={28} />
                    </div>
                    <h3 className="text-3xl font-light tracking-wide text-[#ebc280]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-2xl border border-[#ebc280]/20 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light tracking-widest text-[#ebc280] mb-4">
              DÉMARREZ VOTRE PROJET
            </h2>
            <p className="text-gray-400">
              Remplissez ce formulaire et nous vous contacterons sous 24h pour discuter de votre création unique.
            </p>
          </div>

          <div className="space-y-8">
            {/* Informations personnelles */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2 tracking-wide">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Votre nom"
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 tracking-wide">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="votre@email.com"
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2 tracking-wide">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 tracking-wide">Type de projet *</label>
                <select
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                >
                  <option value="">Sélectionner...</option>
                  <option value="collier">Collier</option>
                  <option value="bracelet">Bracelet</option>
                  <option value="bague">Bague</option>
                  <option value="boucles">Boucles d'oreilles</option>
                  <option value="pendentif">Pendentif</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm mb-2 tracking-wide">Budget estimé</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                >
                  <option value="">Sélectionner...</option>
                  <option value="500-1000">500€ - 1000€</option>
                  <option value="1000-2500">1000€ - 2500€</option>
                  <option value="2500-5000">2500€ - 5000€</option>
                  <option value="5000+">5000€ et plus</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2 tracking-wide">Délai souhaité</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 tracking-wide">Description de votre projet *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez votre vision : type de bijou, pierres souhaitées, occasion, style..."
                rows="5"
                className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 tracking-wide">Sources d'inspiration</label>
              <textarea
                value={formData.inspiration}
                onChange={(e) => setFormData({...formData, inspiration: e.target.value})}
                placeholder="Partagez des références, styles, ou bijoux qui vous inspirent..."
                rows="3"
                className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-lg focus:outline-none focus:border-[#ebc280] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Upload d'images */}
            <div>
              <label className="block text-gray-300 text-sm mb-3 tracking-wide">Images d'inspiration (optionnel)</label>
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-[#ebc280]/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                  <p className="text-gray-400 mb-2">Cliquez pour ajouter des images</p>
                  <p className="text-gray-600 text-sm">JPG, PNG jusqu'à 10MB</p>
                </label>
              </div>

              {/* Preview des images */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img.preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-zinc-700"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitStatus === 'loading'}
              className="w-full py-5 bg-[#ebc280] text-black hover:bg-[#d4a860] transition-all duration-300 tracking-widest text-sm font-bold rounded-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitStatus === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ENVOI EN COURS...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle size={20} />
                  DEMANDE ENVOYÉE !
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  SOUMETTRE MA DEMANDE
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-green-400">
                  ✨ Merci ! Nous reviendrons vers vous sous 24h pour discuter de votre projet.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400">
                  Erreur lors de l'envoi. Veuillez réessayer.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ ou Garanties */}
        <div className="max-w-4xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-[#ebc280]/10 border border-[#ebc280]/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-[#ebc280]" size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">Satisfaction Garantie</h3>
            <p className="text-gray-400 text-sm">Révisions illimitées jusqu'à ce que le design vous convienne parfaitement</p>
          </div>
          <div className="text-center p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-[#ebc280]/10 border border-[#ebc280]/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-[#ebc280]" size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">Pierres Authentiques</h3>
            <p className="text-gray-400 text-sm">Certificat d'authenticité fourni avec chaque création</p>
          </div>
          <div className="text-center p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-[#ebc280]/10 border border-[#ebc280]/30 flex items-center justify-center mx-auto mb-4">
              <Package className="text-[#ebc280]" size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">Livraison Premium</h3>
            <p className="text-gray-400 text-sm">Écrin luxueux inclus, livraison assurée et suivie</p>
          </div>
        </div>
      </div>
    </div>
  );
}

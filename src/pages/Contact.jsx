import React, { useState } from 'react';
import Ring3D from '../components/Ring3D';

export default function Contact() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    description: '',
    image: null
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('https://am-wniz.onrender.com/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      const result = await response.json();
      console.log('Contact form submitted:', result);

      setSubmitStatus('success');
      setFormData({
        prenom: '',
        nom: '',
        telephone: '',
        description: '',
        image: null
      });
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <h2 className="text-4xl font-light tracking-widest text-center text-[#ebc280] mb-16">
        CONTACT
      </h2>
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* 3D Ring Animation on the Left */}
        <div className="lg:w-1/2">
          <Ring3D />
        </div>
        {/* Contact Form on the Right */}
        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-[#ebc280] mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ebc280]"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-[#ebc280] mb-2">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ebc280]"
              />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-[#ebc280] mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ebc280]"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#ebc280] mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ebc280]"
              ></textarea>
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-[#ebc280] mb-2">
                Télécharger une image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#ebc280]"
              />
            </div>
            <button
              type="submit"
              disabled={submitStatus === 'loading'}
              className="w-full px-6 py-3 bg-[#ebc280] text-black font-semibold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitStatus === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Envoi en cours...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  ✓ Envoyé !
                </>
              ) : submitStatus === 'error' ? (
                <>
                  ✗ Erreur
                </>
              ) : (
                'Envoyer'
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-green-400">
                  ✨ Merci ! Nous reviendrons vers vous sous 24h.
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
          </form>
        </div>
      </div>
    </div>
  );
}

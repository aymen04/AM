import React, { useState } from 'react';
import video from '../assets/formanimation.mp4';

export default function Contact() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    alert('Formulaire soumis !');
  };

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <h2 className="text-4xl font-light tracking-widest text-center text-[#ebc280] mb-16">
        CONTACT
      </h2>
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Video Animation on the Left */}
        <div className="lg:w-1/2">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          >
            <source src={video} type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
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
              className="w-full px-6 py-3 bg-[#ebc280] text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

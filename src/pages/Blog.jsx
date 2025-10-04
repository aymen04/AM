import React from 'react';

const samplePosts = [
  {
    id: 1,
    title: "Les bienfaits des pierres précieuses",
    date: "2024-06-01",
    excerpt: "Découvrez comment les pierres précieuses peuvent améliorer votre bien-être et votre énergie au quotidien. Les cristaux ont été utilisés depuis des siècles pour leurs propriétés curatives.",
    image: null, // No image for this one
    layout: 'full'
  },
  {
    id: 2,
    title: "Tendances bijoux 2024",
    date: "2024-05-15",
    excerpt: "Un aperçu des dernières tendances en matière de bijoux pour cette année, avec un focus sur les pierres naturelles. Les couleurs vives et les designs minimalistes dominent.",
    image: 'https://via.placeholder.com/400x300?text=Image+Placeholder', // Placeholder image
    layout: 'left-image'
  },
  {
    id: 3,
    title: "Comment entretenir vos bijoux en pierres naturelles",
    date: "2024-04-20",
    excerpt: "Conseils pratiques pour garder vos bijoux en pierres naturelles éclatants et durables. Nettoyez régulièrement et évitez les chocs.",
    image: 'https://via.placeholder.com/400x300?text=Image+Placeholder', // Placeholder image
    layout: 'right-image'
  },
];

export default function Blog() {
  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <h2 className="text-4xl font-light tracking-widest text-center text-[#ebc280] mb-16">
        BLOG
      </h2>
      <div className="max-w-6xl mx-auto space-y-16">
        {samplePosts.map(post => (
          <article key={post.id} className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:shadow-yellow-400 transition-shadow duration-300">
            {post.layout === 'full' && (
              <>
                <h3 className="text-2xl font-semibold text-[#ebc280] mb-2">{post.title}</h3>
                <time className="block text-sm text-gray-400 mb-4">{new Date(post.date).toLocaleDateString('fr-FR')}</time>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <button className="px-4 py-2 bg-[#ebc280] text-black rounded hover:bg-yellow-400 transition">
                  Lire la suite
                </button>
              </>
            )}
            {post.layout === 'left-image' && (
              <div className="flex flex-col md:flex-row gap-6">
                <img src={post.image} alt={post.title} className="md:w-1/2 rounded-lg" />
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold text-[#ebc280] mb-2">{post.title}</h3>
                  <time className="block text-sm text-gray-400 mb-4">{new Date(post.date).toLocaleDateString('fr-FR')}</time>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <button className="px-4 py-2 bg-[#ebc280] text-black rounded hover:bg-yellow-400 transition">
                    Lire la suite
                  </button>
                </div>
              </div>
            )}
            {post.layout === 'right-image' && (
              <div className="flex flex-col md:flex-row-reverse gap-6">
                <img src={post.image} alt={post.title} className="md:w-1/2 rounded-lg" />
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold text-[#ebc280] mb-2">{post.title}</h3>
                  <time className="block text-sm text-gray-400 mb-4">{new Date(post.date).toLocaleDateString('fr-FR')}</time>
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  <button className="px-4 py-2 bg-[#ebc280] text-black rounded hover:bg-yellow-400 transition">
                    Lire la suite
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

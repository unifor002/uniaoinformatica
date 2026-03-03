
import React from 'react';
import { useAdmin } from '../context/AdminContext';

const GoogleReviews: React.FC = () => {
  const { config } = useAdmin();
  const reviews = config.googleReviews || [];

  return (
    <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-6">
            <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-5 h-5" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avaliações Reais do Google</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-primary outfit tracking-tighter uppercase">
            O que nossos clientes <span className="text-secondary italic">estão dizendo</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden lg:block"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden lg:block"></div>

          <div className="flex overflow-x-auto pb-12 space-x-6 scrollbar-hide snap-x no-scrollbar">
            {reviews.map((review, idx) => (
              <div 
                key={idx} 
                className="group min-w-[300px] md:min-w-[400px] snap-center bg-white p-8 rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col transition-transform hover:scale-[1.02] duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-gray-50" />
                    <div>
                      <h4 className="font-bold text-primary text-sm leading-none">{review.name}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex text-[#fbbc04] text-[10px] mr-2">
                          {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="flex-grow">
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-[8px] text-white"></i>
                    </div>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Local Guide</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300 group-hover:text-gray-500 transition-colors duration-300">
                    <i className="fas fa-thumbs-up text-xs"></i>
                    <i className="fas fa-share-alt text-xs"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-black text-primary">4.9</div>
            <div>
              <div className="flex text-[#fbbc04] text-xs mb-1">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star mr-1"></i>)}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Baseado em 258 opiniões</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-gray-100 hidden md:block"></div>
          <a 
            href={config.googleMapsUrl || "https://www.google.com/search?q=Uni%C3%A3o+Informatica+Goiânia"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            <i className="fab fa-google"></i>
            <span>Escrever uma avaliação</span>
          </a>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default GoogleReviews;

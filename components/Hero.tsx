
import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';

const Hero: React.FC = () => {
  const { config } = useAdmin();
  const [currentSlide, setCurrentSlide] = useState(0);

  const cleanWhatsapp = config.whatsapp.replace(/\D/g, '');

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slides = [
    {
      id: 1,
      image: config.heroImage1,
      badge: config.heroBadge1,
      title: config.heroTitle1,
      description: config.heroDesc1,
      ctaPrimary: config.heroCTA1,
      link: `https://wa.me/${cleanWhatsapp}?text=Olá! Gostaria de saber mais sobre os serviços de assistência técnica.`,
      isWhatsApp: true
    },
    {
      id: 2,
      image: config.heroImage2,
      badge: config.heroBadge2,
      title: config.heroTitle2,
      description: config.heroDesc2,
      ctaPrimary: config.heroCTA2,
      link: `https://wa.me/${cleanWhatsapp}?text=Olá! Preciso de suporte técnico imediato.`,
      isWhatsApp: true
    },
    {
      id: 3,
      image: config.heroImage3,
      badge: config.heroBadge3,
      title: config.heroTitle3,
      description: config.heroDesc3,
      ctaPrimary: config.heroCTA3,
      link: `https://wa.me/${cleanWhatsapp}?text=Olá! Quero conhecer melhor a União Infor e seus serviços.`,
      isWhatsApp: true
    },
    {
      id: 4,
      image: config.heroImage4,
      badge: config.heroBadge4,
      title: config.heroTitle4,
      description: config.heroDesc4,
      ctaPrimary: config.heroCTA4,
      link: `https://wa.me/${cleanWhatsapp}?text=Olá! Preciso de manutenção no meu videogame.`,
      isWhatsApp: true
    }
  ].filter(slide => slide.image);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (slides.length === 0) return null;

  return (
    <section 
      id="home" 
      className="relative w-full mx-auto overflow-hidden bg-primary md:rounded-[32px] md:mt-6 shadow-2xl transition-all duration-500 group/hero"
      style={{ 
        maxWidth: '1920px', 
        height: window.innerWidth < 768 ? '480px' : '640px'
      }}
    >
      {/* Constant Top Gradient for Logo Visibility */}
      <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-[15] pointer-events-none"></div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
              : 'opacity-0 scale-105 z-0 pointer-events-none'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15000ms]"
            style={{ 
              backgroundImage: `url('${slide.image}')`,
              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/70 to-transparent"></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="container mx-auto px-10 h-full flex items-center pt-32 md:pt-40 relative z-20">
            <div className="max-w-2xl">
              {slide.badge && (
                <div className="overflow-hidden mb-4">
                  <span className="inline-flex items-center bg-secondary text-white px-5 py-2 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg animate-in slide-in-from-bottom duration-700">
                    <span className="w-1 h-1 bg-white rounded-full mr-2 animate-pulse"></span>
                    {slide.badge}
                  </span>
                </div>
              )}
              
              {slide.title && (
                <h2 
                  className="font-black mb-3 leading-[1.1] outfit uppercase tracking-tighter animate-in slide-in-from-bottom duration-700 delay-300"
                  style={{ 
                    color: config.colorHeroText,
                    fontSize: window.innerWidth < 768 ? '24px' : `${parseInt(config.heroTitleFontSize) * 0.9}px` 
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                />
              )}
              
              {slide.description && (
                <p 
                  className="mb-8 font-medium leading-relaxed max-w-lg animate-in fade-in duration-1000 delay-500 opacity-80"
                  style={{ 
                    color: config.colorHeroText,
                    fontSize: window.innerWidth < 768 ? '14px' : `${parseInt(config.heroDescFontSize)}px`
                  }}
                >
                  {slide.description}
                </p>
              )}

              {slide.ctaPrimary && (
                <div className="flex flex-wrap gap-4 mt-6 animate-in zoom-in duration-500 delay-700">
                  <a 
                    href={slide.link} 
                    target={slide.isWhatsApp ? "_blank" : "_self"}
                    rel={slide.isWhatsApp ? "noopener noreferrer" : ""}
                    onClick={(e) => !slide.isWhatsApp && scrollToSection(e, slide.link.substring(1))}
                    className="group bg-white text-primary hover:bg-[var(--color-secondary)] hover:text-white active:bg-[var(--color-secondary)] active:text-white font-black py-4.5 px-14 rounded-xl uppercase text-[11px] tracking-[0.1em] shadow-2xl transition-all flex items-center transform active:scale-95 cursor-pointer"
                  >
                    {slide.ctaPrimary}
                    <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center px-4 z-30 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500">
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-secondary text-white backdrop-blur-lg flex items-center justify-center transition-all duration-300 pointer-events-auto group border border-white/10 transform active:scale-90 shadow-xl"
        >
          <i className="fas fa-chevron-left text-sm transition-transform group-hover:-translate-x-1"></i>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 z-30 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500">
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/20 hover:bg-secondary text-white backdrop-blur-lg flex items-center justify-center transition-all duration-300 pointer-events-auto group border border-white/10 transform active:scale-90 shadow-xl"
        >
          <i className="fas fa-chevron-right text-sm transition-transform group-hover:translate-x-1"></i>
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-30">
        <div className="flex space-x-1.5">
            {slides.map((_, i) => (
            <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-700 rounded-full h-0.5 cursor-pointer ${i === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
            />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

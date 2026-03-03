import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

const Navbar: React.FC = () => {
  const { config } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const cleanWhatsapp = config.whatsapp.replace(/\D/g, '');

  return (
    <nav className={`fixed inset-x-0 z-[200] transition-all duration-500 ${isScrolled ? 'top-0 bg-white/95 backdrop-blur-2xl shadow-xl py-1' : 'top-0 lg:top-[41px] bg-transparent py-2'}`} style={{ position: 'fixed', zIndex: 200 }}>
      <div className="w-full px-6 md:px-10 flex justify-between items-center">
        {/* Logo Area */}
        <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="logo flex items-center group relative active:scale-95 transition-transform cursor-pointer" style={{ position: 'relative', zIndex: 999, display: 'flex' }}>
          {config.logoType === 'image' && config.logoImage ? (
            <img src={config.logoImage} alt="União Infor" className="h-[65px] w-auto object-contain transition-transform duration-500 group-hover:scale-110 block" style={{ height: '65px', maxHeight: '65px', display: 'block', position: 'relative', zIndex: 999 }} />
          ) : (
            <div className="flex items-center">
              <div className={`p-1.5 rounded-[8px] mr-2 transition-all duration-500 group-hover:rotate-[15deg] ${isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'}`}>
                <i className="fas fa-shield-halved text-lg"></i>
              </div>
              <div className="flex flex-col text-left" style={{ position: 'relative', zIndex: 21 }}>
                <h1 className={`text-xl md:text-2xl font-black leading-none outfit tracking-tighter transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]'}`}>
                  UNIÃO<span className="text-secondary">INFOR</span>
                </h1>
                <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-extrabold mt-1 transition-colors duration-500 ${isScrolled ? 'text-gray-400' : 'text-white/95 drop-shadow-md'}`}>Premium Support</span>
              </div>
            </div>
          )}
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className={`flex space-x-6 font-bold uppercase text-[8px] tracking-[0.3em] transition-colors duration-500 ${isScrolled ? 'text-primary' : 'text-white drop-shadow-md'}`}>
            <li><a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-secondary transition-all cursor-pointer">Home</a></li>
            <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-secondary transition-all cursor-pointer">Empresa</a></li>
            <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-secondary transition-all cursor-pointer">Soluções</a></li>
            <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-secondary transition-all cursor-pointer">Contato</a></li>
          </ul>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`lg:hidden w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-50 transform active:scale-90 cursor-pointer ${isMenuOpen ? 'bg-secondary text-white' : isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 flex flex-col items-end space-y-1.5 pointer-events-none">
            <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
          </div>
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-primary z-40 transition-all duration-700 flex flex-col items-center justify-center p-12 ${isMenuOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col space-y-10 text-center font-black text-white uppercase text-2xl tracking-tighter outfit">
          <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-[var(--color-secondary)] transform active:scale-95 transition-all cursor-pointer">Home</a>
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[var(--color-secondary)] transform active:scale-95 transition-all cursor-pointer">A Empresa</a>
          <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-[var(--color-secondary)] transform active:scale-95 transition-all cursor-pointer">Nossas Soluções</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[var(--color-secondary)] transform active:scale-95 transition-all cursor-pointer">Fale Conosco</a>
          <div className="pt-10">
             <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="bg-secondary text-white px-12 py-6 rounded-[30px] font-black text-xs tracking-widest block shadow-2xl transform active:scale-95 active:brightness-110 transition-all cursor-pointer">WHATSAPP AGORA</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
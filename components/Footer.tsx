
import React from 'react';
import { useAdmin } from '../context/AdminContext';

interface FooterProps {
  onOpenLogin: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const { config } = useAdmin();
  const cleanWhatsapp = config.whatsapp.replace(/\D/g, '');

  return (
    <footer className="pt-10 pb-6" style={{ backgroundColor: config.colorFooter, color: '#ffffff' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              {config.logoType === 'image' && config.logoImage ? (
                <img src={config.logoImage} alt="União Infor" className="h-8 w-auto object-contain brightness-0 invert" />
              ) : (
                <>
                  <div className="bg-secondary p-1.5 rounded mr-2">
                    <i className="fas fa-microchip text-white text-lg"></i>
                  </div>
                  <h2 className="text-lg font-bold uppercase oswald tracking-tighter">
                    UNIÃO <span className="text-secondary">INFOR</span>
                  </h2>
                </>
              )}
            </div>
            <p className="text-gray-400 text-[10px] leading-relaxed mb-4 italic">
              "Há 20 anos no mesmo endereço, somos a maior referência em Assistência Técnica de Informática em Goiânia. Especialistas em notebook, PC e redes."
            </p>
            <div className="flex space-x-3">
              <a href={config.facebookLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-secondary transition-all text-white"><i className="fab fa-facebook-f text-sm"></i></a>
              <a href={config.instagramLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-secondary transition-all text-white"><i className="fab fa-instagram text-sm"></i></a>
              <a href={config.linkedinLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-secondary transition-all text-white"><i className="fab fa-linkedin-in text-sm"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold uppercase oswald mb-4 border-b-2 border-secondary inline-block">Navegação</h4>
            <ul className="space-y-2 text-gray-400 text-[9px] uppercase font-bold tracking-widest">
              <li><a href="#home" className="hover:text-secondary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-secondary transition-colors">Sobre</a></li>
              <li><a href="#services" className="hover:text-secondary transition-colors">Serviços</a></li>
              <li><a href="#contact" className="hover:text-secondary transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Services SEO */}
          <div>
            <h4 className="text-base font-bold uppercase oswald mb-4 border-b-2 border-secondary inline-block">Goiânia / Serviços</h4>
            <ul className="space-y-2 text-gray-500 text-[9px] uppercase font-bold">
              <li><i className="fas fa-check text-secondary mr-2"></i> Manutenção de Notebook Bueno</li>
              <li><i className="fas fa-check text-secondary mr-2"></i> Técnico PC Setor Oeste</li>
              <li><i className="fas fa-check text-secondary mr-2"></i> Conserto Impressora Goiânia</li>
              <li><i className="fas fa-check text-secondary mr-2"></i> Redes WiFi Jardim América</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold uppercase oswald mb-4 border-b-2 border-secondary inline-block">Suporte</h4>
            <p className="text-gray-400 text-xs mb-3">{config.address}<br/>{config.phone}</p>
            <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg">
              <i className="fab fa-whatsapp mr-2"></i> WhatsApp
            </a>
            {config.pixKey && (
              <p className="text-[8px] text-gray-500 mt-2 uppercase font-bold tracking-tighter">PIX: {config.pixKey}</p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-[9px] uppercase tracking-widest flex flex-col items-center">
          <p>
            © {new Date().getFullYear()} União Infor | O Melhor do TI em Goiânia.
          </p>
          <button 
            type="button"
            onClick={onOpenLogin} 
            className="mt-4 px-3 py-1 text-[7px] opacity-10 hover:opacity-100 transition-opacity cursor-pointer border border-white/10 rounded uppercase font-black tracking-[0.2em] focus:outline-none"
          >
            Portal de Administração
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

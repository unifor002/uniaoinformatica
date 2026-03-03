import React from 'react';
import { useAdmin } from '../context/AdminContext';

const WhatsAppButton: React.FC = () => {
  const { config } = useAdmin();
  const cleanWhatsapp = config.whatsapp.replace(/\D/g, '');

  return (
    <div className="fixed bottom-[104px] right-6 z-[100] group">
      {/* Ripple Animation - Fixed with pointer-events-none to not block clicks */}
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity pointer-events-none"></div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
        <p className="text-primary font-black text-[10px] uppercase tracking-widest">Atendimento Imediato</p>
      </div>

      {/* Main Button */}
      <a 
        href={`https://wa.me/${cleanWhatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-[#25D366] hover:bg-[#128C7E] text-white w-16 h-16 rounded-full shadow-[0_20px_40px_rgba(37,211,102,0.3)] flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-90 border-4 border-white cursor-pointer"
      >
        <i className="fab fa-whatsapp text-3xl"></i>
      </a>
    </div>
  );
};

export default WhatsAppButton;
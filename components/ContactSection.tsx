import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { SERVICES } from '../constants';

const ContactSection: React.FC = () => {
  const { config } = useAdmin();
  const cleanWhatsapp = config.whatsapp.replace(/\D/g, '');

  const handleServiceClick = (serviceTitle: string) => {
    const message = `Olá! Gostaria de mais informações sobre o serviço de ${serviceTitle}.`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="contact" className="py-8 bg-white relative scroll-mt-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row rounded-[24px] overflow-hidden shadow-xl border border-slate-100">
          {/* Lado Esquerdo - Vermelho */}
          <div className="w-full lg:w-1/2 bg-secondary p-6 md:p-10 text-white relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>
            
            <div className="relative z-10">
              <span className="text-white/60 font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Atendimento Exclusivo</span>
              <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase outfit leading-none tracking-tighter">
                Fale com um de nossos <span className="text-white italic underline decoration-white/30">Especialistas</span>.
              </h2>
              
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all cursor-default shadow-sm">
                  <div className="bg-white w-6 h-6 rounded-md flex items-center justify-center mr-2 shadow-lg shrink-0">
                    <i className="fas fa-location-arrow text-[10px] text-secondary"></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[7px] font-black uppercase tracking-widest text-white/50 mb-0">Unidade Central</h4>
                    <p className="text-[10px] font-bold text-white truncate leading-tight">{config.address}</p>
                  </div>
                </div>
   
                <div className="flex items-center p-2 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all cursor-default shadow-sm">
                  <div className="bg-white w-6 h-6 rounded-md flex items-center justify-center mr-2 shrink-0">
                    <i className="fas fa-phone-volume text-[10px] text-secondary"></i>
                  </div>
                  <div>
                    <h4 className="text-[7px] font-black uppercase tracking-widest text-white/50 mb-0">Linha de Suporte</h4>
                    <p className="text-base md:text-lg font-black outfit leading-tight text-white">{config.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Azul */}
          <div className="w-full lg:w-1/2 bg-primary p-6 md:p-10 text-white relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg md:text-xl font-black text-white outfit uppercase tracking-tighter">Escolha seu Serviço</h3>
                <p className="text-white/40 text-[9px] mt-0.5 font-bold uppercase tracking-widest">Clique abaixo para iniciar no WhatsApp</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 flex-grow">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.title)}
                    className="group bg-white/5 p-2 rounded-lg border border-white/10 hover:border-[var(--color-secondary)] transition-all text-left flex flex-col items-start hover:bg-[var(--color-secondary)] hover:shadow-xl transform active:scale-[0.98]"
                  >
                    <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center text-white group-hover:bg-white/20 transition-all duration-300 mb-1">
                      <i className={`fas ${service.icon} text-[8px] group-hover:text-white transition-colors duration-300`}></i>
                    </div>
                    <h4 className="font-bold text-white text-[10px] uppercase tracking-tight group-hover:text-secondary mb-0 leading-tight transition-colors">
                      {service.title}
                    </h4>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest flex items-center">
                      Solicitar Agora <i className="fas fa-arrow-right ml-1 text-[5px] group-hover:translate-x-1 transition-transform"></i>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-2 bg-white/5 rounded-lg border border-white/10 text-center">
                <p className="text-[8px] font-black text-white uppercase tracking-widest leading-relaxed">
                  Não encontrou o que precisava? <br/>
                  <button 
                    onClick={() => window.open(`https://wa.me/${cleanWhatsapp}?text=Olá! Preciso de uma solução personalizada em TI.`, '_blank')} 
                    className="text-secondary hover:text-white hover:underline cursor-pointer font-black active:opacity-60 transition-all text-[9px] mt-0.5 inline-block"
                  >
                    Suporte personalizado
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
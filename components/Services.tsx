
import React from 'react';
import { useAdmin } from '../context/AdminContext';

const Services: React.FC = () => {
  const { config } = useAdmin();

  const handleServiceClick = (serviceTitle: string) => {
    const cleanWhatsapp = config.whatsapp.replace(/\D/g, '');
    const message = `Olá! Desejo um orçamento para o serviço de ${serviceTitle}.`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="services" className="py-16 bg-slate-50 relative overflow-hidden bg-dots scroll-mt-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Soluções Customizadas</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary uppercase outfit leading-none tracking-tighter mb-6">
            Compromisso com a <span className="text-secondary italic">Performance</span>
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {config.servicesList.map((service) => (
            <div key={service.id} className="group relative bg-white rounded-[32px] overflow-hidden transition-all duration-700 shadow-md border border-slate-100 hover:-translate-y-2">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-secondary text-xl group-hover:bg-secondary transition-all duration-300 shadow-sm">
                        <i className={`fas ${service.icon} group-hover:text-white transition-colors duration-300`}></i>
                    </div>
                    <h3 className="text-2xl font-black text-primary uppercase outfit leading-tight">{service.title}</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{service.description}</p>
                <div className="pt-8 border-t border-slate-50">
                    <button onClick={() => handleServiceClick(service.title)} className="bg-primary text-white w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-[var(--color-secondary)] transition-all">
                      Solicitar Orçamento
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

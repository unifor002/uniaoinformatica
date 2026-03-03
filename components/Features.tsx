import React from 'react';

const Features: React.FC = () => {
  const features = [
    { icon: 'fa-building', title: 'Suporte Empresarial', desc: 'Sua empresa sempre funcionando com suporte técnico especializado.' },
    { icon: 'fa-headset', title: 'Atendimento Remoto', desc: 'Resposta rápida e eficiente via acesso remoto seguro.' },
    { icon: 'fa-bolt', title: 'Agilidade', desc: 'Protocolos otimizados para tempo recorde de entrega e solução.' },
    { icon: 'fa-shield-halved', title: 'Segurança Total', desc: 'Tratamento de dados com total sigilo e proteção garantida.' },
  ];

  return (
    <section className="relative -mt-12 z-30 container mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,46,91,0.06)] p-6 group hover:!bg-[var(--color-primary)] transition-all duration-300 border border-white hover:border-transparent transform hover:-translate-y-2">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-lg text-secondary mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:rotate-6 shadow-sm">
              <i className={`fas ${f.icon} group-hover:!text-white transition-colors duration-300`}></i>
            </div>
            <h4 className="text-lg font-extrabold mb-2 text-primary group-hover:!text-white transition-colors duration-300 uppercase tracking-tight outfit">{f.title}</h4>
            <p className="text-slate-500 group-hover:!text-white/70 transition-colors duration-300 text-xs leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
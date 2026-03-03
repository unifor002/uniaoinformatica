
import React from 'react';
import { useAdmin } from '../context/AdminContext';

const About: React.FC = () => {
  const { config } = useAdmin();
  
  return (
    <section id="about" className="py-16 bg-white relative overflow-hidden scroll-mt-32">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-[32px] overflow-hidden shadow-xl border-[6px] border-slate-50/50">
              <img 
                src={config.aboutImage} 
                alt="Sobre Nós" 
                className="w-full h-auto" 
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl p-8 rounded-[32px] shadow-xl z-20 border border-white float-animation">
              <h4 className="text-5xl font-black text-secondary outfit leading-none mb-1">{config.aboutExpYears}</h4>
              <p className="text-primary font-black uppercase tracking-[0.2em] text-[9px]">{config.aboutExpLabel}</p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-6 block">Diferencial União Infor</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-8 uppercase outfit leading-none tracking-tighter" dangerouslySetInnerHTML={{ __html: config.aboutTitle }}></h2>
            <p className="text-slate-500 text-base mb-4 leading-relaxed font-medium">
              {config.aboutDesc1}
            </p>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed">
              {config.aboutDesc2}
            </p>
            
            <a href="#contact" className="inline-flex items-center bg-primary text-white py-6 px-14 rounded-3xl uppercase font-black text-xs tracking-[0.2em] hover:bg-secondary transition-all shadow-xl transform active:scale-95">
              Falar com um Técnico
              <i className="fas fa-arrow-right ml-4"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

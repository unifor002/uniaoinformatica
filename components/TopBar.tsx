
import React from 'react';
import { useAdmin } from '../context/AdminContext';

const TopBar: React.FC = () => {
  const { config } = useAdmin();
  return (
    <div className="py-2.5 hidden lg:block border-b border-white/5" style={{ backgroundColor: config.colorTopBar, color: '#ffffff' }}>
      <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.15em]">
        <div className="flex space-x-8">
          <span className="flex items-center group cursor-pointer">
            <i className="fas fa-phone-alt text-secondary mr-2 group-hover:rotate-12 transition-transform"></i>
            {config.phone}
          </span>
          {config.email && (
            <span className="flex items-center group cursor-pointer">
              <i className="fas fa-envelope text-secondary mr-2 group-hover:scale-110 transition-transform"></i>
              {config.email}
            </span>
          )}
          <span className="flex items-center opacity-70">
            <i className="fas fa-clock text-secondary mr-2"></i>
            SEG - SEX: 08:00 ÀS 18:00 | SAB: 08:00 ÀS 13:00
          </span>
        </div>
        <div className="flex space-x-5 items-center">
          <span className="text-white/40 mr-2">Siga-nos:</span>
          <a href={config.facebookLink} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-all"><i className="fab fa-facebook-f"></i></a>
          <a href={config.instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-all"><i className="fab fa-instagram"></i></a>
          <a href={config.linkedinLink} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-all"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

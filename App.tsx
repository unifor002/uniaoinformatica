import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Services from './components/Services';
import GoogleReviews from './components/GoogleReviews';
import ContactSection from './components/ContactSection';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function LoginPortal({ onLogin, onCancel }: { onLogin: () => void, onCancel: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAccess = () => {
    if (email === "uniaoinformatica2000@gmail.com" && password === "UI17625010") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#0a1128] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white w-full max-w-[480px] rounded-[40px] p-10 md:p-14 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#2563eb] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-8 shadow-lg shadow-blue-200">
          U
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2 oswald">Portal União Infor</h2>
        <p className="text-gray-500 text-sm md:text-base mb-10 font-medium tracking-tight">Configure seu marketing aqui</p>
        
        <div className="w-full text-left mb-6">
          <label className="block text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em] mb-3">E-MAIL DO ADMINISTRADOR</label>
          <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={`w-full bg-[#f3f4f6] border-2 ${error ? 'border-red-500 animate-shake' : 'border-transparent'} rounded-2xl py-4 px-6 text-gray-700 focus:bg-white focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-400 font-medium`}
          />
        </div>

        <div className="w-full text-left mb-8">
          <label className="block text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.2em] mb-3">CHAVE DE ACESSO</label>
          <div className="relative">
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAccess()}
                placeholder="Insira a senha"
                className={`w-full bg-[#f3f4f6] border-2 ${error ? 'border-red-500 animate-shake' : 'border-transparent'} rounded-2xl py-4 px-6 text-gray-700 focus:bg-white focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-400 font-medium`}
            />
          </div>
        </div>
        <button 
          onClick={handleAccess}
          className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center"
        >
          ACESSAR CONFIGURAÇÕES
          <i className="fas fa-arrow-right ml-2 text-xs"></i>
        </button>
        <button 
          onClick={onCancel}
          className="mt-8 text-gray-400 text-xs font-bold hover:text-[#2563eb] transition-colors flex items-center uppercase tracking-widest"
        >
          <i className="fas fa-chevron-left mr-2 text-[10px]"></i>
          Voltar para o site público
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}

function AppContent() {
  const { config } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        :root {
          --color-primary: ${config.colorPrimary};
          --color-secondary: ${config.colorSecondary};
        }
        .text-primary { color: var(--color-primary); }
        .bg-primary { background-color: var(--color-primary); }
        .text-secondary { color: var(--color-secondary); }
        .bg-secondary { background-color: var(--color-secondary); }
        .border-secondary { border-color: var(--color-secondary); }
      `}</style>
      
      {showLogin && (
        <LoginPortal 
          onLogin={() => {
            setShowLogin(false);
            setShowAdmin(true);
          }} 
          onCancel={() => setShowLogin(false)}
        />
      )}

      {showAdmin && (
        <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      )}

      <TopBar />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <About />
        <Services />
        <GoogleReviews />
        <ContactSection />
        {config.showRegionalAreas && (
          <section className="py-10 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 text-center">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4 block">Atendimento Regional</span>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                <span className="hover:text-secondary cursor-default transition-colors">Setor Bueno</span>
                <span className="hover:text-secondary cursor-default transition-colors">Setor Oeste</span>
                <span className="hover:text-secondary cursor-default transition-colors">Setor Marista</span>
                <span className="hover:text-secondary cursor-default transition-colors">Jardim América</span>
                <span className="hover:text-secondary cursor-default transition-colors">Setor Campinas</span>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <WhatsAppButton />
      <Footer onOpenLogin={() => setShowLogin(true)} />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}

export default App;
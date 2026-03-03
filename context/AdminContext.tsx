
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../services/supabase';

interface VisitEntry {
  timestamp: string;
  device: string;
  page: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

interface SiteConfig {
  colorPrimary: string;
  colorSecondary: string;
  colorTopBar: string;
  colorFooter: string;
  colorHeroText: string;
  logoImage: string;
  heroWidth: string;
  heroHeight: string;
  heroTitleFontSize: string;
  heroDescFontSize: string;
  heroTitle1: string; heroDesc1: string; heroImage1: string; heroBadge1: string; heroCTA1: string;
  heroTitle2: string; heroDesc2: string; heroImage2: string; heroBadge2: string; heroCTA2: string;
  heroTitle3: string; heroDesc3: string; heroImage3: string; heroBadge3: string; heroCTA3: string;
  heroTitle4: string; heroDesc4: string; heroImage4: string; heroBadge4: string; heroCTA4: string;
  aboutTitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
  aboutImage: string;
  aboutExpYears: string;
  aboutExpLabel: string;
  servicesList: ServiceItem[];
  phone: string; whatsapp: string; email: string; address: string;
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  trackingHead: string; trackingBody: string;
  imageBank: string[];
  seoKeywords: string;
  seoDescription: string;
  logoType: 'image' | 'text';
  favicon: string;
  googleMapsUrl: string;
  showRegionalAreas: boolean;
  googleReviews: {
    name: string;
    date: string;
    text: string;
    stars: number;
    avatar: string;
  }[];
  // Novos campos de Análise
  totalVisits: number;
  visitLog: VisitEntry[];
}

const defaultConfig: SiteConfig = {
  colorPrimary: '#002e5b',
  colorSecondary: '#ed1c24',
  colorTopBar: '#002e5b',
  colorFooter: '#1a1a1a',
  colorHeroText: '#ffffff',
  logoImage: '', 
  heroWidth: '1140',
  heroHeight: '580',
  heroTitleFontSize: '52',
  heroDescFontSize: '16',
  heroTitle1: 'Suporte <span class="text-secondary">Empresarial</span> Rápido',
  heroDesc1: 'Resposta rápida. Segurança total. Sua empresa sempre funcionando.',
  heroImage1: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=1920&q=80',
  heroBadge1: 'Atendimento Remoto',
  heroCTA1: 'Solicitar Suporte',
  heroTitle2: 'Atendimento <span class="text-secondary">Remoto</span> Especializado',
  heroDesc2: 'Resposta rápida. Segurança total. Sua empresa sempre funcionando.',
  heroImage2: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
  heroBadge2: 'Suporte Empresarial',
  heroCTA2: 'Acesso Remoto',
  heroTitle3: 'Conserto de <span class="text-secondary">Notebooks</span> e PCs',
  heroDesc3: 'Laboratório avançado para reparos em placas-mãe e upgrades de performance com garantia total.',
  heroImage3: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1920&q=80',
  heroBadge3: 'Hardware & Peças',
  heroCTA3: 'Ver Laboratório',
  heroTitle4: '<span class="text-secondary">Games</span> e Consoles para Empresas',
  heroDesc4: 'Soluções de entretenimento e manutenção de consoles para áreas de descompressão e eventos corporativos.',
  heroImage4: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
  heroBadge4: 'Games & Consoles',
  heroCTA4: 'Orçamento Games',
  aboutTitle: 'Soluções Completas em <span class="text-secondary italic">Hardware</span> e Software.',
  aboutDesc1: 'A União Infor é referência técnica no coração de Goiânia. Há duas décadas no mesmo endereço, consolidamos nossa expertise na manutenção de computadores, notebooks, acesso remoto e consoles de jogos.',
  aboutDesc2: 'Diferente de assistências convencionais, atuamos em problemas complexos como recuperação de dados e reparos avançados em placas-mãe.',
  aboutImage: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=1200&q=80',
  aboutExpYears: '20',
  aboutExpLabel: 'Anos no Setor Central',
  servicesList: [
    { id: '1', title: 'Manutenção de Computadores', description: 'Assistência completa: reparo em placa, limpeza interna e upgrades.', icon: 'fa-laptop-medical', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=40' },
    { id: '2', title: 'Manutenção de Notebook', description: 'Especialistas em reparos de notebooks de todas as marcas.', icon: 'fa-laptop', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=40' },
    { id: '3', title: 'Manutenção de Monitor', description: 'Reparo em monitores LED e LCD com garantia de qualidade.', icon: 'fa-desktop', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=40' },
    { id: '4', title: 'Suporte Empresarial', description: 'Contratos de manutenção e suporte técnico especializado para empresas. Garantimos que sua infraestrutura de TI nunca pare.', icon: 'fa-building', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=40' },
    { id: '5', title: 'Acesso Remoto (Celulares e Tablets)', description: 'Suporte técnico especializado para dispositivos móveis, tablets e computadores via acesso remoto.', icon: 'fa-headset', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=40' }
  ],
  phone: '(62) 98222-9820 / 623093-1142',
  whatsapp: '5562982229820',
  email: 'contato@uniaoinfor.com.br',
  address: 'R. 68, 522 - St. Central, Goiânia - GO, 74055-100',
  facebookLink: '#',
  instagramLink: '#',
  linkedinLink: '#',
  trackingHead: '',
  trackingBody: '',
  imageBank: [],
  seoKeywords: 'assistência técnica goiânia, conserto de notebook goiânia, manutenção de computadores goiânia, acesso remoto goiânia, união infor, técnico de informática goiânia, conserto de videogame goiânia, recuperação de dados goiânia, suporte online goiânia, conserto de pc gamer goiânia',
  seoDescription: 'União Infor: A melhor assistência técnica de Goiânia há 20 anos. Especialistas em conserto de notebooks, PCs, acesso remoto e games. Atendimento premium no Setor Central.',
  logoType: 'text',
  favicon: '',
  googleMapsUrl: 'https://www.google.com/maps/place/Uni%C3%A3o+Informatica/@-16.674968,-49.256331,17z',
  showRegionalAreas: true,
  googleReviews: [
    {
      name: "Ricardo Mendes",
      date: "Há 2 meses",
      text: "Atendimento excepcional! Levei meu notebook que não ligava e resolveram em tempo recorde. Preço justo e equipe muito técnica. Recomendo a todos em Goiânia!",
      stars: 5,
      avatar: "https://i.pravatar.cc/150?u=ricardo"
    },
    {
      name: "Ana Beatriz",
      date: "Há 1 mês",
      text: "Melhor assistência técnica de Goiânia. Foram super transparentes no orçamento e o serviço ficou impecável. Meu computador agora está voando!",
      stars: 5,
      avatar: "https://i.pravatar.cc/150?u=ana"
    },
    {
      name: "Marcos Paulo",
      date: "Há 3 semanas",
      text: "Equipe sênior de verdade. Resolveram um problema de rede na minha empresa que outros não conseguiram. Estão de parabéns pelo profissionalismo e agilidade.",
      stars: 5,
      avatar: "https://i.pravatar.cc/150?u=marcos"
    },
    {
      name: "Juliana Ferreira",
      date: "Há 1 semana",
      text: "A União Infor é a única que confio para mexer nos meus equipamentos. Atendimento VIP e honestidade total. O melhor suporte de TI de Goiânia sem dúvidas.",
      stars: 5,
      avatar: "https://i.pravatar.cc/150?u=juliana"
    }
  ],
  totalVisits: 0,
  visitLog: []
};

const AdminContext = createContext<{
  config: SiteConfig;
  updateConfig: (newConfig: Partial<SiteConfig>) => void;
  saveConfig: () => boolean;
  resetConfig: () => void;
} | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('uniaoinfor_config_v6');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  useEffect(() => {
    // Fetch from Supabase if enabled
    const fetchCloudConfig = async () => {
      if (!isSupabaseEnabled || !supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('site_configs')
          .select('config')
          .eq('id', 1)
          .single();
          
        if (data && data.config && Object.keys(data.config).length > 0) {
          console.log("Configuração carregada do Supabase");
          setConfig(prev => ({ ...prev, ...data.config }));
        } else if (error && error.code !== 'PGRST116') {
          console.error("Erro ao carregar do Supabase:", error);
        }
      } catch (err) {
        console.error("Erro inesperado ao conectar ao Supabase:", err);
      }
    };

    fetchCloudConfig();
  }, []);

  useEffect(() => {
    // Rastreamento de Visita (Apenas uma vez por sessão de carregamento)
    const trackVisit = () => {
      const newVisit: VisitEntry = {
        timestamp: new Date().toLocaleString('pt-BR'),
        device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        page: window.location.hash || '#home'
      };
      
      setConfig(prev => {
        const updatedLog = [newVisit, ...prev.visitLog].slice(0, 50); // Mantém os últimos 50
        const updatedConfig = { 
          ...prev, 
          totalVisits: (prev.totalVisits || 0) + 1,
          visitLog: updatedLog
        };
        localStorage.setItem('uniaoinfor_config_v6', JSON.stringify(updatedConfig));
        return updatedConfig;
      });
    };

    // Timeout curto para garantir que o rastreio não interfira no carregamento inicial
    const timer = setTimeout(trackVisit, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Injeção de Scripts de Tracking
    const headTarget = document.getElementById('tracking-scripts-head');
    const bodyTarget = document.getElementById('tracking-scripts-body');

    const injectScripts = (container: HTMLElement | null, html: string) => {
      if (!container) return;
      container.innerHTML = '';
      if (!html) return;
      const range = document.createRange();
      const fragment = range.createContextualFragment(html);
      container.appendChild(fragment);
    };

    injectScripts(headTarget, config.trackingHead);
    injectScripts(bodyTarget, config.trackingBody);

    document.documentElement.style.setProperty('--color-primary', config.colorPrimary);
    document.documentElement.style.setProperty('--color-secondary', config.colorSecondary);

    // SEO
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.seoKeywords);

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', config.seoDescription);
    }

    // Favicon
    if (config.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = config.favicon;
    }
  }, [config.trackingHead, config.trackingBody, config.seoKeywords, config.seoDescription, config.colorPrimary, config.colorSecondary, config.favicon]);

  const updateConfig = (newConfig: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const saveConfig = () => {
    try {
      localStorage.setItem('uniaoinfor_config_v6', JSON.stringify(config));
      
      // Save to Supabase if enabled
      if (isSupabaseEnabled && supabase) {
        supabase
          .from('site_configs')
          .upsert({ id: 1, config: config, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error("Erro ao salvar no Supabase:", error);
            else console.log("Configuração salva no Supabase com sucesso!");
          });
      }
      
      return true;
    } catch (e) {
      console.error("Erro ao salvar:", e);
      alert("ERRO: Imagens pesadas demais para o navegador.");
      return false;
    }
  };

  const resetConfig = () => {
    if(confirm("Deseja resetar o site?")) {
      setConfig(defaultConfig);
      localStorage.removeItem('uniaoinfor_config_v6');
      window.location.reload();
    }
  };

  return (
    <AdminContext.Provider value={{ config, updateConfig, saveConfig, resetConfig }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

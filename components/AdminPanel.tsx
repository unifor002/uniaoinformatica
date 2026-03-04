
import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { supabase, isSupabaseEnabled, uploadImage, listImages } from '../services/supabase';
import { fetchRealReviews } from '../services/geminiService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, saveConfig, resetConfig } = useAdmin();
  const [activeTab, setActiveTab] = useState<'visual' | 'banners' | 'analytics' | 'sobre' | 'servicos' | 'seo' | 'imagebank' | 'contato' | 'tracking'>('analytics');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const compressImage = (file: File, maxWidth = 1000, quality = 0.5, returnBlob = false): Promise<string | Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          if (returnBlob) {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
            }, 'image/jpeg', quality);
          } else {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          }
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSaveStatus('saving');
      try {
        let imageUrl: string;
        
        if (isSupabaseEnabled) {
          const blob = await compressImage(file, 1600, 0.7, true) as Blob;
          const uploadedUrl = await uploadImage(blob);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          } else {
            imageUrl = await compressImage(file, 1200, 0.5) as string;
          }
        } else {
          imageUrl = await compressImage(file, 1200, 0.5) as string;
        }

        updateConfig({ [field]: imageUrl });
        setSaveStatus('idle');
      } catch (err) { 
        console.error(err);
        alert("Erro ao processar imagem."); 
        setSaveStatus('idle');
      }
    }
  };

  const handleServiceUpdate = (index: number, field: string, value: string) => {
    const newList = [...config.servicesList];
    (newList[index] as any)[field] = value;
    updateConfig({ servicesList: newList });
    setSaveStatus('idle');
  };

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      title: 'Novo Serviço',
      description: 'Descrição do serviço...',
      icon: 'fa-tools',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=40'
    };
    updateConfig({ servicesList: [...config.servicesList, newService] });
    setSaveStatus('idle');
  };

  const handleRemoveService = (index: number) => {
    if (confirm("Deseja remover este serviço?")) {
      const newList = config.servicesList.filter((_, i) => i !== index);
      updateConfig({ servicesList: newList });
      setSaveStatus('idle');
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    const success = saveConfig();
    setTimeout(() => {
      setSaveStatus(success ? 'success' : 'idle');
      if (success) setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  if (!isOpen) return null;

  const menuItems = [
    { id: 'analytics', label: 'Estatísticas', icon: 'fa-chart-pie' },
    { id: 'visual', label: 'Estilo & Cores', icon: 'fa-palette' },
    { id: 'banners', label: 'Banners Iniciais', icon: 'fa-images' },
    { id: 'sobre', label: 'Sobre Nós', icon: 'fa-info-circle' },
    { id: 'servicos', label: 'Nossos Serviços', icon: 'fa-tools' },
    { id: 'seo', label: 'Marketing (SEO)', icon: 'fa-search' },
    { id: 'imagebank', label: 'Minhas Fotos', icon: 'fa-camera' },
    { id: 'reviews', label: 'Avaliações Google', icon: 'fa-star' },
    { id: 'contato', label: 'Dados de Contato', icon: 'fa-phone' },
    { id: 'tracking', label: 'Pixels & Tags', icon: 'fa-chart-line' },
  ];

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-[#f8fafc] w-full max-w-[1200px] h-[85vh] rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.2)] flex overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500 border border-white">
        
        {/* Sidebar Lateral */}
        <div className="w-72 bg-primary flex flex-col shrink-0">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
                <i className="fas fa-rocket"></i>
              </div>
              <h2 className="text-white font-black uppercase text-xs tracking-[0.2em] outfit">União Control</h2>
            </div>
            <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Painel Administrativo v2.6</p>
          </div>

          <nav className="flex-grow py-6 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center px-8 py-4 text-left transition-all relative group ${activeTab === item.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                {activeTab === item.id && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-secondary rounded-r-full shadow-[0_0_15px_rgba(237,28,36,0.5)]"></div>
                )}
                <i className={`fas ${item.icon} w-6 text-sm ${activeTab === item.id ? 'text-secondary' : 'text-inherit'}`}></i>
                <span className="text-[10px] font-black uppercase tracking-widest ml-3">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-8">
            <button onClick={resetConfig} className="flex items-center text-white/20 hover:text-red-400 transition-colors text-[9px] font-black uppercase tracking-widest">
              <i className="fas fa-undo-alt mr-2"></i> Resetar Site
            </button>
          </div>
        </div>

        {/* Área Principal */}
        <div className="flex-grow flex flex-col min-w-0">
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
            <div className="flex items-center space-x-4">
              <h3 className="text-primary font-black uppercase text-sm tracking-tighter outfit flex items-center">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h3>
              <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border ${isSupabaseEnabled ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isSupabaseEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className="text-[8px] font-black uppercase tracking-widest">
                  {isSupabaseEnabled ? 'Nuvem Conectada' : 'Apenas Local'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-all transform active:scale-90">
              <i className="fas fa-times"></i>
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-10 bg-[#f8fafc] scrollbar-hide">
            
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner"><i className="fas fa-users"></i></div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visitas Totais</h4>
                    <p className="text-4xl font-black text-primary outfit tracking-tighter">{config.totalVisits || 0}</p>
                    <span className="text-[8px] text-green-500 font-bold mt-2 uppercase">Acessos Reais</span>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner"><i className="fas fa-clock"></i></div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Atividade</h4>
                    <p className="text-lg font-black text-primary outfit leading-tight">
                      {config.visitLog?.[0]?.timestamp.split(',')[0] || '--/--/----'}
                    </p>
                    <span className="text-[8px] text-slate-400 font-bold mt-2 uppercase">{config.visitLog?.[0]?.timestamp.split(',')[1] || 'Aguardando...'}</span>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-inner"><i className="fas fa-database"></i></div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status do Banco</h4>
                    <button 
                      onClick={async () => {
                        if (!isSupabaseEnabled || !supabase) {
                          alert("Supabase não configurado nas variáveis de ambiente.");
                          return;
                        }
                        const { data, error } = await supabase.from('site_configs').select('id').eq('id', 1);
                        if (error) {
                          alert(`Erro de Conexão: ${error.message}\n\nIsso geralmente significa que a tabela não existe ou o RLS está bloqueando.`);
                        } else {
                          alert("Conexão OK! A tabela 'site_configs' está acessível e o RLS permite leitura.");
                        }
                      }}
                      className="text-[10px] font-black text-primary uppercase underline hover:text-secondary transition-colors"
                    >
                      Testar Agora
                    </button>
                    <span className="text-[8px] text-slate-400 font-bold mt-2 uppercase">Verificar RLS/Tabelas</span>
                  </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-10 py-8 border-b flex items-center justify-between">
                    <h4 className="text-primary font-black uppercase text-xs tracking-widest">Log de Acessos Recentes</h4>
                    <button onClick={() => updateConfig({ visitLog: [] })} className="text-[9px] font-black text-red-500 uppercase hover:underline">Limpar Histórico</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b">
                        <tr>
                          <th className="px-10 py-4 text-[9px] font-black uppercase text-slate-400">Data e Hora</th>
                          <th className="px-10 py-4 text-[9px] font-black uppercase text-slate-400">Dispositivo</th>
                          <th className="px-10 py-4 text-[9px] font-black uppercase text-slate-400">Página Destino</th>
                          <th className="px-10 py-4 text-[9px] font-black uppercase text-slate-400 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {(config.visitLog || []).map((visit, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-10 py-4 text-[10px] font-bold text-primary">{visit.timestamp}</td>
                            <td className="px-10 py-4 text-[10px] font-medium text-slate-500">
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${visit.device === 'Mobile' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {visit.device}
                              </span>
                            </td>
                            <td className="px-10 py-4 text-[10px] font-mono text-slate-400">{visit.page}</td>
                            <td className="px-10 py-4 text-right">
                              <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
                            </td>
                          </tr>
                        ))}
                        {(!config.visitLog || config.visitLog.length === 0) && (
                          <tr>
                            <td colSpan={4} className="px-10 py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">Nenhuma visita registrada ainda.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sobre' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Título Seção Sobre</label>
                      <input type="text" value={config.aboutTitle} onChange={(e) => updateConfig({ aboutTitle: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outfit" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Parágrafo 1</label>
                      <textarea value={config.aboutDesc1} onChange={(e) => updateConfig({ aboutDesc1: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-[11px] h-32 leading-relaxed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Parágrafo 2</label>
                      <textarea value={config.aboutDesc2} onChange={(e) => updateConfig({ aboutDesc2: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-[11px] h-20 leading-relaxed" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Imagem Lateral (Sobre)</label>
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border relative group mb-2">
                        <img src={config.aboutImage} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                          <input type="file" onChange={(e) => handleFileUpload(e, 'aboutImage')} className="text-[9px] text-white cursor-pointer" />
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={config.aboutImage} 
                        onChange={(e) => updateConfig({ aboutImage: e.target.value })} 
                        placeholder="Ou cole a URL da imagem aqui"
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-[9px] font-medium text-slate-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Anos Exp.</label>
                        <input type="text" value={config.aboutExpYears} onChange={(e) => updateConfig({ aboutExpYears: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Texto Badge Exp.</label>
                        <input type="text" value={config.aboutExpLabel} onChange={(e) => updateConfig({ aboutExpLabel: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
                   <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-inner"><i className="fas fa-search"></i></div>
                      <div>
                        <h4 className="text-primary font-black uppercase text-xs tracking-widest">Google SEO Manager</h4>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Ranqueamento e Visibilidade</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex justify-between">
                          <span>Palavras-Chave Estratégicas</span>
                          <span className="text-blue-500 italic text-[8px]">Separe por vírgulas</span>
                        </label>
                        <textarea value={config.seoKeywords} onChange={(e) => updateConfig({ seoKeywords: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-[11px] leading-relaxed font-bold text-slate-600 h-40 focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Resumo para o Google (Meta Description)</label>
                        <textarea value={config.seoDescription} onChange={(e) => updateConfig({ seoDescription: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-6 text-[11px] leading-relaxed font-medium text-slate-500 h-24 focus:ring-2 focus:ring-blue-100" />
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-yellow-400 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-yellow-400/20"><i className="fas fa-star"></i></div>
                      <div>
                        <h4 className="text-primary font-black uppercase text-xs tracking-widest">Avaliações do Google</h4>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Sincronize com clientes reais</p>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        setSaveStatus('saving');
                        const result = await fetchRealReviews("União Infor", "Goiânia, GO", config.googleMapsUrl);
                        if (result.reviews && result.reviews.length > 0) {
                          updateConfig({ googleReviews: result.reviews });
                          alert(`${result.reviews.length} avaliações reais encontradas e sincronizadas!`);
                        } else {
                          alert("Não foi possível encontrar novas avaliações no momento. Verifique o link do Google Maps e tente novamente.");
                        }
                        setSaveStatus('idle');
                      }}
                      className="bg-primary text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center"
                    >
                      <i className="fas fa-sync-alt mr-2"></i> Sincronizar Agora
                    </button>
                  </div>

                  <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Link do Google Meu Negócio (Maps)</label>
                    <div className="flex space-x-3">
                      <input 
                        type="text" 
                        value={config.googleMapsUrl} 
                        onChange={(e) => updateConfig({ googleMapsUrl: e.target.value })}
                        placeholder="Cole aqui o link do Google Maps da sua empresa"
                        className="flex-grow bg-white border-none rounded-xl p-4 text-xs font-bold shadow-sm"
                      />
                    </div>
                    <p className="text-[8px] text-slate-400 mt-2 uppercase font-bold tracking-tighter italic">
                      * Use este link para que a IA encontre exatamente a sua empresa.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {(config.googleReviews || []).map((review, idx) => (
                      <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start space-x-4">
                        <img src={review.avatar} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="text-[11px] font-black text-primary uppercase tracking-tight">{review.name}</h5>
                            <div className="flex text-yellow-400 text-[8px]">
                              {[...Array(review.stars)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed italic">"{review.text}"</p>
                          <span className="text-[8px] text-slate-400 font-bold mt-2 block uppercase">{review.date}</span>
                        </div>
                        <button 
                          onClick={() => {
                            const newReviews = config.googleReviews.filter((_, i) => i !== idx);
                            updateConfig({ googleReviews: newReviews });
                          }}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contato' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-5xl">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-6">
                  <h4 className="text-primary font-black uppercase text-[10px] tracking-widest border-b pb-4">Canais de Atendimento</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400">WhatsApp (apenas números com DDD)</label>
                      <input type="text" value={config.whatsapp} onChange={(e) => updateConfig({ whatsapp: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" placeholder="Ex: 5562999999999" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400">Telefone Exibição</label>
                      <input type="text" value={config.phone} onChange={(e) => updateConfig({ phone: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" placeholder="(62) 0000-0000" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400">E-mail Comercial</label>
                      <input type="text" value={config.email} onChange={(e) => updateConfig({ email: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-6">
                  <h4 className="text-primary font-black uppercase text-[10px] tracking-widest border-b pb-4">Localização & Redes</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400">Endereço Completo</label>
                      <input type="text" value={config.address} onChange={(e) => updateConfig({ address: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" />
                    </div>
                    <div className="pt-4 border-t border-slate-50 space-y-4">
                      <h5 className="text-[9px] font-black uppercase text-primary tracking-widest">Redes Sociais</h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs shadow-lg"><i className="fab fa-facebook-f"></i></div>
                          <input type="text" value={config.facebookLink} onChange={(e) => updateConfig({ facebookLink: e.target.value })} className="flex-grow bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold" placeholder="Link Facebook" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-xs shadow-lg"><i className="fab fa-instagram"></i></div>
                          <input type="text" value={config.instagramLink} onChange={(e) => updateConfig({ instagramLink: e.target.value })} className="flex-grow bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold" placeholder="Link Instagram" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center text-xs shadow-lg"><i className="fab fa-linkedin-in"></i></div>
                          <input type="text" value={config.linkedinLink} onChange={(e) => updateConfig({ linkedinLink: e.target.value })} className="flex-grow bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold" placeholder="Link LinkedIn" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-600/20"><i className="fab fa-google"></i></div>
                    <div>
                      <h4 className="text-primary font-black uppercase text-xs tracking-widest">Google Tags & Ads</h4>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Scripts da Cabeça (Head)</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Scripts do Head</label>
                      <textarea 
                        value={config.trackingHead} 
                        onChange={(e) => updateConfig({ trackingHead: e.target.value })} 
                        className="w-full bg-slate-900 border-none rounded-2xl p-6 text-[10px] font-mono text-green-400 leading-relaxed h-48 focus:ring-2 focus:ring-secondary/20 transition-all scrollbar-hide"
                        placeholder="Cole aqui scripts que pedem <head>..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-purple-600/20"><i className="fab fa-facebook"></i></div>
                    <div>
                      <h4 className="text-primary font-black uppercase text-xs tracking-widest">Meta Pixel & Body Scripts</h4>
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Scripts para o Início do Corpo (Body)</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Scripts do Body</label>
                      <textarea 
                        value={config.trackingBody} 
                        onChange={(e) => updateConfig({ trackingBody: e.target.value })} 
                        className="w-full bg-slate-900 border-none rounded-2xl p-6 text-[10px] font-mono text-blue-400 leading-relaxed h-48 focus:ring-2 focus:ring-secondary/20 transition-all scrollbar-hide"
                        placeholder="Cole aqui scripts que pedem logo após o <body>..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <h4 className="font-bold oswald uppercase text-primary mb-6 text-xs tracking-widest border-b pb-4">Identidade Visual</h4>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { field: 'colorPrimary', label: 'Cor Primária' },
                      { field: 'colorSecondary', label: 'Cor de Destaque' },
                      { field: 'colorTopBar', label: 'Barra de Topo' },
                      { field: 'colorFooter', label: 'Rodapé' },
                      { field: 'colorHeroText', label: 'Texto dos Banners' }
                    ].map(item => (
                      <div key={item.field} className="space-y-3">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.label}</label>
                        <input type="color" value={(config as any)[item.field]} onChange={(e) => updateConfig({ [item.field]: e.target.value })} className="w-full h-12 rounded-xl cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                   <h4 className="font-bold oswald uppercase text-primary mb-6 text-xs tracking-widest border-b pb-4 w-full">Logomarca do Site</h4>
                   
                   <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-full">
                     <button 
                       onClick={() => updateConfig({ logoType: 'text' })}
                       className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${config.logoType === 'text' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       Apenas Texto
                     </button>
                     <button 
                       onClick={() => updateConfig({ logoType: 'image' })}
                       className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${config.logoType === 'image' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       Usar Imagem
                     </button>
                   </div>

                   {config.logoType === 'image' ? (
                     <>
                       {config.logoImage ? <img src={config.logoImage} className="h-20 mb-4 object-contain" /> : <div className="h-20 bg-slate-50 w-full rounded-2xl mb-4 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300"><i className="fas fa-image text-3xl"></i></div>}
                       <input type="file" onChange={(e) => handleFileUpload(e, 'logoImage')} className="text-[9px] cursor-pointer" />
                     </>
                   ) : (
                     <div className="text-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 w-full">
                       <i className="fas fa-font text-3xl text-slate-300 mb-3"></i>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">O nome da loja será exibido automaticamente</p>
                     </div>
                   )}

                   <div className="mt-6 pt-6 border-t border-slate-100 w-full">
                      <h4 className="font-bold oswald uppercase text-primary mb-4 text-xs tracking-widest">Exibição de Seções</h4>
                      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs shadow-sm">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-tight">Atendimento Regional</p>
                            <p className="text-[8px] text-slate-400 uppercase font-bold">Mostrar lista de bairros no rodapé</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => updateConfig({ showRegionalAreas: !config.showRegionalAreas })}
                          className={`w-12 h-6 rounded-full transition-all relative ${config.showRegionalAreas ? 'bg-secondary' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.showRegionalAreas ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                    </div>

                   <div className="mt-10 pt-10 border-t border-slate-100 w-full">
                     <h4 className="font-bold oswald uppercase text-primary mb-6 text-xs tracking-widest">Favicon do Site (Ícone da Aba)</h4>
                     <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                       <p className="text-[8px] text-amber-700 font-bold uppercase leading-tight mb-2">
                         <i className="fas fa-exclamation-triangle mr-1"></i> 
                         Atenção: Para as imagens aparecerem, você DEVE:
                       </p>
                       <ul className="text-[7px] text-amber-600 font-bold uppercase list-disc pl-4 space-y-1">
                         <li>Criar um bucket chamado "images" no Supabase</li>
                         <li>Marcá-lo como "Public"</li>
                         <li>Em "Policies", permitir "SELECT" e "INSERT" para usuários anônimos (ou desativar RLS para este bucket)</li>
                       </ul>
                     </div>
                     <div className="flex items-center space-x-6">
                       <div className="w-16 h-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                         {config.favicon ? <img src={config.favicon} className="w-8 h-8 object-contain" /> : <i className="fas fa-globe text-slate-300 text-xl"></i>}
                       </div>
                       <div className="flex-grow space-y-3">
                         <input type="file" onChange={(e) => handleFileUpload(e, 'favicon')} className="text-[9px] cursor-pointer block" />
                         <input 
                           type="text" 
                           value={config.favicon} 
                           onChange={(e) => updateConfig({ favicon: e.target.value })} 
                           placeholder="Ou cole a URL do favicon aqui"
                           className="w-full bg-slate-50 border-none rounded-xl p-3 text-[9px] font-medium text-slate-500"
                         />
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'banners' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-6">
                  <h4 className="font-bold oswald uppercase text-primary mb-4 text-xs tracking-widest border-b pb-4">Dimensões dos Banners</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Largura Máxima (px)</label>
                      <input type="text" value={config.heroWidth} onChange={(e) => updateConfig({ heroWidth: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border-none font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Altura (px)</label>
                      <input type="text" value={config.heroHeight} onChange={(e) => updateConfig({ heroHeight: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border-none font-bold text-xs" />
                    </div>
                  </div>
                </div>

                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="bg-white p-8 rounded-[32px] border border-slate-100 space-y-6 hover:shadow-lg transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Título Banner {num}</label>
                        <input type="text" value={(config as any)[`heroTitle${num}`]} onChange={(e) => updateConfig({ [`heroTitle${num}`]: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border-none font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Descrição</label>
                        <textarea value={(config as any)[`heroDesc${num}`]} onChange={(e) => updateConfig({ [`heroDesc${num}`]: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border-none text-[10px] h-24" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-24 w-full overflow-hidden rounded-xl mb-2 relative group">
                            <img src={(config as any)[`heroImage${num}`]} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <input type="file" onChange={(e) => handleFileUpload(e, `heroImage${num}`)} className="text-[8px] text-white" />
                            </div>
                        </div>
                        <input 
                          type="text" 
                          value={(config as any)[`heroImage${num}`]} 
                          onChange={(e) => updateConfig({ [`heroImage${num}`]: e.target.value })} 
                          placeholder="URL da Imagem"
                          className="w-full bg-slate-50 p-2 rounded-lg border-none text-[9px] font-medium text-slate-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Texto do Selo (Badge)</label>
                        <input type="text" value={(config as any)[`heroBadge${num}`]} onChange={(e) => updateConfig({ [`heroBadge${num}`]: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border-none font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Texto do Botão (CTA)</label>
                        <input type="text" value={(config as any)[`heroCTA${num}`]} onChange={(e) => updateConfig({ [`heroCTA${num}`]: e.target.value })} className="w-full bg-slate-50 p-4 rounded-xl border-none font-bold text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'servicos' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center">
                  <h4 className="text-primary font-black uppercase text-xs tracking-widest">Gerenciar Serviços</h4>
                  <button 
                    onClick={handleAddService}
                    className="bg-secondary text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                  >
                    <i className="fas fa-plus mr-2"></i> Adicionar Serviço
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {config.servicesList.map((s, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4 relative group">
                      <button 
                        onClick={() => handleRemoveService(idx)}
                        className="absolute top-6 right-6 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
                        title="Remover Serviço"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>

                      <span className="text-[8px] font-black text-secondary uppercase tracking-widest">Cartão de Serviço #{idx+1}</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Título</label>
                        <input type="text" value={s.title} onChange={(e) => handleServiceUpdate(idx, 'title', e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 text-xs font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Ícone (FA)</label>
                        <input type="text" value={s.icon} onChange={(e) => handleServiceUpdate(idx, 'icon', e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 text-[10px] font-mono" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Descrição</label>
                      <textarea value={s.description} onChange={(e) => handleServiceUpdate(idx, 'description', e.target.value)} className="w-full bg-slate-50 rounded-xl p-3 text-[10px] h-20" />
                    </div>
                    <div className="flex flex-col space-y-2">
                       <div className="flex items-center space-x-4">
                         <img src={s.image} className="w-12 h-12 rounded-lg object-cover" />
                         <input type="file" onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if(file) {
                             setSaveStatus('saving');
                             let imageUrl: string;
                             if (isSupabaseEnabled) {
                               const blob = await compressImage(file, 800, 0.6, true) as Blob;
                               imageUrl = (await uploadImage(blob)) || (await compressImage(file, 600, 0.4) as string);
                             } else {
                               imageUrl = await compressImage(file, 600, 0.4) as string;
                             }
                             handleServiceUpdate(idx, 'image', imageUrl);
                             setSaveStatus('idle');
                           }
                         }} className="text-[8px]" />
                       </div>
                       <input 
                         type="text" 
                         value={s.image} 
                         onChange={(e) => handleServiceUpdate(idx, 'image', e.target.value)} 
                         placeholder="URL da Imagem"
                         className="w-full bg-slate-50 rounded-xl p-2 text-[9px] font-medium text-slate-500"
                       />
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'imagebank' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                        <h4 className="text-primary font-black uppercase text-xs tracking-widest">Sua Galeria Privada</h4>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Imagens para uso geral</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={async () => {
                            if (!isSupabaseEnabled) {
                              alert("Ative o Supabase primeiro.");
                              return;
                            }
                            setSaveStatus('saving');
                            const cloudImages = await listImages();
                            if (cloudImages.length > 0) {
                              const currentBank = config.imageBank || [];
                              const uniqueImages = Array.from(new Set([...currentBank, ...cloudImages]));
                              updateConfig({ imageBank: uniqueImages });
                              alert(`${cloudImages.length} imagens sincronizadas da nuvem!`);
                            } else {
                              alert("Nenhuma imagem encontrada na pasta 'site-images' do seu bucket.");
                            }
                            setSaveStatus('idle');
                          }}
                          className="bg-blue-50 text-blue-600 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all mr-2"
                        >
                          <i className="fas fa-sync-alt mr-2"></i> Sincronizar Nuvem
                        </button>
                        <div className="relative">
                          <input 
                            type="text" 
                            id="url-bank-add"
                            placeholder="Adicionar por URL..."
                            className="bg-slate-50 border-none rounded-full px-6 py-3 text-[10px] font-bold w-64 focus:ring-2 focus:ring-secondary/20 transition-all"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement;
                                if (input.value) {
                                  updateConfig({ imageBank: [...(config.imageBank || []), input.value] });
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <button 
                            onClick={() => {
                              const input = document.getElementById('url-bank-add') as HTMLInputElement;
                              if (input.value) {
                                updateConfig({ imageBank: [...(config.imageBank || []), input.value] });
                                input.value = '';
                              }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-[10px]"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <input type="file" multiple id="bank-upload" onChange={async (e) => {
                            const files = e.target.files;
                            if (files) {
                              setSaveStatus('saving');
                              const newImages = [...(config.imageBank || [])];
                              for (let i = 0; i < files.length; i++) {
                                let imageUrl: string;
                                if (isSupabaseEnabled) {
                                  const blob = await compressImage(files[i], 1200, 0.6, true) as Blob;
                                  imageUrl = (await uploadImage(blob)) || (await compressImage(files[i], 800, 0.4) as string);
                                } else {
                                  imageUrl = await compressImage(files[i], 800, 0.4) as string;
                                }
                                newImages.push(imageUrl);
                              }
                              updateConfig({ imageBank: newImages });
                              setSaveStatus('idle');
                            }
                          }} className="hidden" />
                        <label htmlFor="bank-upload" className="bg-secondary text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl cursor-pointer hover:scale-105 transition-all">Subir Fotos</label>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                      {(config.imageBank || []).map((img, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
                          <img src={img} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                            <p className="text-[6px] text-white truncate font-mono">{img}</p>
                          </div>
                          <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                             <button onClick={() => { navigator.clipboard.writeText(img); alert('Código copiado!'); }} className="bg-white text-primary px-3 py-1.5 rounded-lg text-[8px] font-black uppercase mb-2">Código</button>
                             <button onClick={() => {
                               const newBank = config.imageBank.filter((_, i) => i !== idx);
                               updateConfig({ imageBank: newBank });
                             }} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[8px] font-black">Excluir</button>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            
          </div>

          <footer className="h-24 bg-white border-t border-slate-100 flex items-center justify-between px-10 shrink-0">
            <div className="flex items-center space-x-2">
               <div className={`w-2 h-2 rounded-full ${saveStatus === 'success' ? 'bg-green-500 animate-pulse' : 'bg-slate-200'}`}></div>
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                 {saveStatus === 'success' ? 'Site Atualizado!' : saveStatus === 'saving' ? 'Trabalhando...' : 'Alterações Pendentes'}
               </span>
            </div>
            <div className="flex space-x-4">
               <button onClick={onClose} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Descartar</button>
               <button onClick={handleSave} disabled={saveStatus === 'saving'} className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transform active:scale-95 transition-all">
                 {saveStatus === 'saving' ? 'Salvando...' : 'Publicar no Site'}
               </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

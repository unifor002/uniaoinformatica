
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiAssistantResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ExtendedChatMessage extends ChatMessage {
  sources?: { title: string; uri: string }[];
}

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    { role: 'model', text: 'Olá! Sou o assistente da União Infor. Como posso ajudar com sua tecnologia hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const result = await getGeminiAssistantResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', text: result.text, sources: result.sources }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#ed1c24] hover:bg-[#002e5b] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:rotate-12 border-4 border-white"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-2xl`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#002e5b] p-4 text-white flex items-center">
            <div className="w-10 h-10 bg-[#ed1c24] rounded-full flex items-center justify-center mr-3 text-white">
              <i className="fas fa-bolt text-lg"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase oswald">União Smart AI</h4>
              <p className="text-[10px] text-[#ed1c24] font-bold uppercase tracking-widest">Conectado ao Google</p>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50/50"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#002e5b] text-white rounded-tr-none' 
                  : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Fontes do Google:</p>
                      <div className="flex flex-col gap-1">
                        {msg.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-500 hover:underline flex items-center"
                          >
                            <i className="fas fa-external-link-alt mr-1 text-[8px]"></i>
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Dúvida técnica ou sobre a loja?"
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#ed1c24]"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-[#002e5b] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#ed1c24] transition-colors"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;


import { Service, Testimonial } from './types';

export const COLORS = {
  primary: '#002e5b', // Azul Profundo
  secondary: '#ed1c24', // Vermelho
  accent: '#1e1e1e', // Cinza Escuro
};

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Manutenção de Computadores',
    description: 'Assistência completa: reparo em placa, limpeza interna, troca de pasta térmica e upgrades de SSD/RAM com laboratório de última geração.',
    icon: 'fa-laptop-medical',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=40'
  },
  {
    id: '2',
    title: 'Manutenção de Notebook',
    description: 'Especialistas em reparos de notebooks de todas as marcas, troca de telas, teclados e reparos avançados em placa-mãe.',
    icon: 'fa-laptop',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=40'
  },
  {
    id: '3',
    title: 'Manutenção de Monitor',
    description: 'Reparo em monitores LED e LCD, troca de capacitores, reparo em fontes e placas lógicas com garantia de qualidade.',
    icon: 'fa-desktop',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=40'
  },
  {
    id: '4',
    title: 'Suporte Empresarial',
    description: 'Contratos de manutenção e suporte técnico especializado para empresas. Garantimos que sua infraestrutura de TI nunca pare.',
    icon: 'fa-building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=40'
  },
  {
    id: '5',
    title: 'Acesso Remoto (Celulares e Tablets)',
    description: 'Suporte técnico especializado para dispositivos móveis, tablets e computadores via acesso remoto para resolver problemas de software e configurações.',
    icon: 'fa-headset',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=40'
  },
  {
    id: '6',
    title: 'Manutenção de Impressoras',
    description: 'Limpeza, desentupimento e troca de peças em multifuncionais. Soluções rápidas para falhas de impressão e puxada de papel.',
    icon: 'fa-print',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=40'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    role: 'Empresário',
    content: 'A União Infor resolveu problemas de rede que travavam minha empresa há meses. Super recomendo!',
    avatar: 'https://i.pravatar.cc/150?u=carlos'
  },
  {
    id: '2',
    name: 'Mariana Silva',
    role: 'Designer',
    content: 'Meu notebook é meu instrumento de trabalho. O reparo foi rápido e com preço justo.',
    avatar: 'https://i.pravatar.cc/150?u=mariana'
  }
];

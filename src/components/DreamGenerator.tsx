import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sparkles, RefreshCw } from 'lucide-react';

interface Dream {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const dreams: Dream[] = [
  {
    id: 1,
    title: 'Piquenique Estelar',
    description: 'Sonhar que estamos em um piquenique à noite, deitados na grama macia, comendo seus doces favoritos sob um céu de auroras boreais.',
    icon: '🍫✨'
  },
  {
    id: 2,
    title: 'Voo no Algodão Doce',
    description: 'Sonhar que flutuamos sobre nuvens macias e cor-de-rosa de algodão doce, vendo o mundo lá de cima bem de pertinho, de mãos dadas.',
    icon: '☁️💗'
  },
  {
    id: 3,
    title: 'Praia Mágica',
    description: 'Sonhar caminhando numa praia tranquila com areia que brilha no escuro e ondas quentinhas que fazem barulho de música de ninar.',
    icon: '🏖️🌊'
  },
  {
    id: 4,
    title: 'Abraço que Para o Tempo',
    description: 'Sonhar com um abraço tão, mas tão apertado que todo o universo ao redor congela e só o que importa é o som do nosso coração batendo.',
    icon: '🫂❤️'
  },
  {
    id: 5,
    title: 'Castelo das Estrelas Cadentes',
    description: 'Sonhar que moramos em um castelo de vidro onde o teto é aberto e toda hora passa uma estrela cadente para você fazer um pedido.',
    icon: '🏰🌠'
  },
  {
    id: 6,
    title: 'Cinema Nas Nuvens',
    description: 'Sonhar que assistimos ao seu filme favorito em uma tela gigante feita de constelações, cobertos com o edredom mais macio do mundo.',
    icon: '🎬🍿'
  },
  {
    id: 7,
    title: 'A Dança das Luas',
    description: 'Sonhar dançando uma música bem lenta sob a luz de três luas coloridas, onde você repousa a cabeça no meu peito e esquece do mundo.',
    icon: '💃🕺'
  }
];

export default function DreamGenerator() {
  const [currentDream, setCurrentDream] = useState<Dream | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateDream = () => {
    setIsLoading(true);
    
    // Simulate loading for suspense
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * dreams.length);
      // Ensure we don't show the same dream twice in a row if possible
      if (currentDream && dreams[randomIndex].id === currentDream.id) {
        const nextIndex = (randomIndex + 1) % dreams.length;
        setCurrentDream(dreams[nextIndex]);
      } else {
        setCurrentDream(dreams[randomIndex]);
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl max-w-md w-full flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 w-full justify-start">
        <Cloud className="w-5 h-5 text-sky-400" />
        <h3 className="text-xl font-bold text-white font-sans">
          Fábrica de Sonhos ☁️
        </h3>
      </div>
      
      <p className="text-slate-300 text-xs mb-6 w-full text-left">
        Toque para sortear um sonho lindo para você ter esta noite, bb!
      </p>

      <div className="relative w-full h-48 flex items-center justify-center border-2 border-dashed border-sky-500/20 rounded-2xl bg-sky-950/10 mb-6 p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
              <p className="text-xs text-sky-300 font-light">Tecendo seu sonho...</p>
            </motion.div>
          ) : currentDream ? (
            <motion.div
              key={currentDream.id}
              initial={{ scale: 0.8, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -15, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="flex flex-col items-center text-center p-2"
            >
              <span className="text-4xl mb-2 filter drop-shadow-md">
                {currentDream.icon}
              </span>
              <h4 className="text-base font-bold text-sky-300 font-sans">
                {currentDream.title}
              </h4>
              <p className="text-xs text-slate-200 mt-2 font-serif italic leading-relaxed">
                "{currentDream.description}"
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center p-4 cursor-pointer group"
              onClick={generateDream}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="bg-sky-500/10 p-4 rounded-full border border-sky-400/20 group-hover:bg-sky-500/20 transition-all"
              >
                <Cloud className="w-10 h-10 text-sky-300" />
              </motion.div>
              <p className="text-sm text-sky-300 font-medium mt-3 group-hover:text-sky-200 transition-colors">
                Toque para capturar um sonho
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                A fada dos sonhos está pronta!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={generateDream}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-sky-950/30 active:scale-98 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        {currentDream ? 'Gerar Outro Sonho' : 'Gerar Meu Sonho'}
      </button>
    </div>
  );
}

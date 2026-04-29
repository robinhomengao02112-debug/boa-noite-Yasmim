import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sparkles, Heart, Smile, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

// Import custom components
import StarrySky from './components/StarrySky';
import LoveLetter from './components/LoveLetter';
import BedtimeChecklist from './components/BedtimeChecklist';
import DreamGenerator from './components/DreamGenerator';
import MusicPlayer from './components/MusicPlayer';

interface FloatingItem {
  id: number;
  type: 'sheep' | 'kiss';
  y: number;
  speed: number;
  size: number;
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [hugActive, setHugActive] = useState(false);
  const [sheepCount, setSheepCount] = useState(0);

  const handleUnlock = () => {
    // Trigger some confetti on unlock
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#c084fc']
    });
    setIsUnlocked(true);
  };

  const addSheep = () => {
    setSheepCount(prev => prev + 1);
    const newSheep: FloatingItem = {
      id: Date.now() + Math.random(),
      type: 'sheep',
      y: Math.random() * 60 + 15, // Keep in upper/middle part
      speed: Math.random() * 3 + 4, // 4-7 seconds
      size: Math.random() * 10 + 25 // 25-35px
    };
    setFloatingItems(prev => [...prev, newSheep]);
    
    // Remove after animation completes
    setTimeout(() => {
      setFloatingItems(prev => prev.filter(item => item.id !== newSheep.id));
    }, 7000);
  };

  const addKisses = () => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const newKiss: FloatingItem = {
          id: Date.now() + Math.random(),
          type: 'kiss',
          y: Math.random() * 40 + 50, // Spawn from bottom half
          speed: Math.random() * 2 + 2, // 2-4 seconds
          size: Math.random() * 15 + 20 // 20-35px
        };
        setFloatingItems(prev => [...prev, newKiss]);

        setTimeout(() => {
          setFloatingItems(prev => prev.filter(item => item.id !== newKiss.id));
        }, 4000);
      }, i * 150);
    }
  };

  const triggerHug = () => {
    setHugActive(true);
    setTimeout(() => setHugActive(false), 4000);
  };

  return (
    <StarrySky>
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* =========================================
             LOCK SCREEN / ENTRANCE
             ========================================= */
          <motion.div
            key="lockscreen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="max-w-md w-full flex flex-col items-center">
              {/* Pulsating Glowing Moon */}
              <motion.div
                initial={{ scale: 0.9, y: -10 }}
                animate={{
                  scale: [1, 1.05, 1],
                  y: [0, -15, 0],
                  filter: [
                    'drop-shadow(0 0 20px rgba(255,255,255,0.4))',
                    'drop-shadow(0 0 40px rgba(254,240,138,0.6))',
                    'drop-shadow(0 0 20px rgba(255,255,255,0.4))'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                onClick={handleUnlock}
                className="w-40 h-40 bg-radial from-yellow-100 via-yellow-200 to-amber-100 rounded-full cursor-pointer relative mb-12 flex items-center justify-center border-4 border-white/40 group shadow-2xl"
              >
                {/* Moon Crater details */}
                <div className="absolute top-8 left-10 w-6 h-6 rounded-full bg-amber-200/40 blur-[1px]" />
                <div className="absolute top-20 left-16 w-10 h-10 rounded-full bg-amber-200/30 blur-[1px]" />
                <div className="absolute top-12 right-12 w-4 h-4 rounded-full bg-amber-200/40 blur-[1px]" />
                
                <Heart className="w-12 h-12 text-rose-500/80 fill-rose-500/40 group-hover:scale-125 transition-transform duration-300 animate-pulse" />
                <div className="absolute -inset-4 rounded-full border border-white/10 animate-ping opacity-20 pointer-events-none" />
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-200 tracking-tight font-sans"
              >
                Boa Noite, Yasmim ❤️
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-300 text-sm mt-3 leading-relaxed font-light font-serif px-4"
              >
                Preparei um céu particular, quentinho e interativo para você relaxar e ter o sono mais lindo do mundo.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUnlock}
                className="mt-10 px-8 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-medium rounded-full shadow-lg shadow-pink-500/20 flex items-center gap-2 cursor-pointer border border-white/20"
              >
                <Moon className="w-4 h-4" /> Entrar no meu Céu, mo
              </motion.button>
              
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ delay: 1.2, repeat: Infinity, duration: 3 }}
                className="text-[11px] text-yellow-200/60 mt-4 font-light italic"
              >
                (Toque na Lua ou no botão acima, bb)
              </motion.span>
            </div>
          </motion.div>
        ) : (
          /* =========================================
             DASHBOARD / MAIN CONTENT
             ========================================= */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 80 }}
            className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col items-center"
          >
            {/* Header */}
            <header className="text-center mb-10 w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 text-xs text-indigo-300 mb-3 gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
                Espaço de Acolhimento e Carinho
                <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white">
                Boa Noite, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">bb!</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1 font-light">
                Esqueça os problemas do mundo exterior. Aqui você só tem paz, mo.
              </p>
            </header>

            {/* Love Letter (Centerpiece) */}
            <section className="w-full max-w-lg mb-10">
              <LoveLetter />
            </section>

            {/* Interactive Grid */}
            <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-12">
              <div className="flex flex-col gap-6 w-full items-center">
                <MusicPlayer />
                <DreamGenerator />
              </div>

              <div className="flex flex-col gap-6 w-full items-center">
                <BedtimeChecklist />
                
                {/* Floating controls panel */}
                <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl w-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Smile className="w-5 h-5 text-rose-400" />
                    <h3 className="text-lg font-bold text-white font-sans">
                      Carinhos Interativos 🥰
                    </h3>
                  </div>
                  <p className="text-slate-300 text-xs mb-4">
                    Estou um pouco longe agora, mas você pode ativar qualquer um destes carinhos a qualquer momento, Yasmim:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addKisses}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 hover:border-pink-500/40 text-pink-300 text-sm font-medium transition-all cursor-pointer"
                    >
                      😘 Mandar Beijinhos
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={triggerHug}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 text-sm font-medium transition-all cursor-pointer"
                    >
                      🫂 Abraço Quentinho
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addSheep}
                      className="sm:col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-sm font-medium transition-all cursor-pointer"
                    >
                      🐑 Contar Carneirinho Apaixonado 
                      {sheepCount > 0 && (
                        <span className="bg-indigo-500 text-white text-xxs font-bold px-1.5 py-0.5 rounded-full ml-1">
                          {sheepCount}
                        </span>
                      )}
                    </motion.button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-3 text-center font-light">
                    (Dica: Toque nos botões e olhe para a tela!)
                  </p>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="text-center mt-auto w-full max-w-md border-t border-white/5 pt-6 pb-2">
              <div className="flex items-center justify-center gap-1.5 text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span className="font-serif italic text-slate-300 text-sm">
                  Feito exclusivamente para Yasmim
                </span>
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-sans font-light">
                Com todo o amor do mundo • {new Date().getFullYear()}
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
         FLOATING ANIMATIONS OVERLAYS
         ========================================= */}
      
      {/* Floating Sheep and Kisses */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingItems.map((item) => {
          if (item.type === 'sheep') {
            return (
              <motion.div
                key={item.id}
                initial={{ x: '110vw' }}
                animate={{ x: '-20vw' }}
                transition={{ duration: item.speed, ease: 'linear' }}
                className="absolute flex items-center justify-center filter drop-shadow-md"
                style={{ top: `${item.y}%`, fontSize: item.size }}
              >
                <div className="relative flex flex-col items-center">
                  <span>🐑</span>
                  {/* Floating heart above sheep */}
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-400 absolute -top-2 -right-1 animate-pulse" />
                </div>
              </motion.div>
            );
          } else {
            // Kiss Emoji
            return (
              <motion.div
                key={item.id}
                initial={{
                  y: '100vh',
                  x: `${Math.random() * 80 + 10}vw`,
                  opacity: 0,
                  scale: 0.2,
                  rotate: Math.random() * 60 - 30
                }}
                animate={{
                  y: `${item.y - 40}vh`,
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1, 0.8],
                  x: `calc(${Math.random() * 10 - 5}vw + ${Math.random() * 60 + 10}vw)`
                }}
                transition={{ duration: item.speed, ease: 'easeOut' }}
                className="absolute text-center filter drop-shadow-[0_2px_5px_rgba(255,100,100,0.4)]"
                style={{ fontSize: item.size }}
              >
                {['😘', '💋', '❤️', '🥰'][Math.floor(Math.random() * 4)]}
              </motion.div>
            );
          }
        })}
      </div>

      {/* Fullscreen Virtual Hug Overlay */}
      <AnimatePresence>
        {hugActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-indigo-950/80 backdrop-blur-lg flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', duration: 1 }}
              className="flex flex-col items-center p-8 text-center"
            >
              <div className="relative">
                <Users className="w-24 h-24 text-white animate-pulse" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 flex items-center justify-center text-rose-500 fill-rose-500 mt-2 ml-1"
                >
                  <Heart className="w-12 h-12 fill-current" />
                </motion.div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-6 font-sans">
                Sinta o meu abraço! 🤗
              </h2>
              <p className="text-rose-200 text-sm md:text-base mt-2 max-w-xs font-serif italic">
                Aperte o travesseiro bem forte, bb... Estou te abraçando com todo o meu amor e carinho agora!
              </p>
              <p className="text-xxs text-slate-400 mt-6 uppercase tracking-wider font-sans">
                Feche os olhos... 🧘‍♀️💤
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StarrySky>
  );
}

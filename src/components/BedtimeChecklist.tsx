import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, Sparkles, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChecklistItem {
  id: number;
  text: string;
  subtext: string;
}

const items: ChecklistItem[] = [
  { id: 1, text: 'Esquecer os estresses do dia', subtext: 'Deixe tudo o que deu errado lá fora, bb.' },
  { id: 2, text: 'Beber um copinho de água', subtext: 'Para hidratar e relaxar o corpinho antes de dormir.' },
  { id: 3, text: 'Colocar o pijama mais confortável', subtext: 'Aquele bem quentinho e gostoso, mo.' },
  { id: 4, text: 'Lembrar que você é muito amada', subtext: 'Tem alguém aqui sorrindo só de lembrar de você.' },
  { id: 5, text: 'Mentalizar coisas boas e sorrir', subtext: 'Para ter os sonhos mais doces do mundo.' }
];

export default function BedtimeChecklist() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleItem = (id: number) => {
    if (isCompleted) return;

    setCheckedItems((prev) => {
      let newChecked;
      if (prev.includes(id)) {
        newChecked = prev.filter((itemId) => itemId !== id);
      } else {
        newChecked = [...prev, id];
      }

      // Check if all are completed
      if (newChecked.length === items.length) {
        triggerSuccess();
      }

      return newChecked;
    });
  };

  const triggerSuccess = () => {
    setIsCompleted(true);

    // Confetti effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const resetChecklist = () => {
    setCheckedItems([]);
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl max-w-md w-full">
      <div className="flex items-center gap-2 mb-4">
        <Moon className="w-5 h-5 text-indigo-400" />
        <h3 className="text-xl font-bold text-white font-sans">
          Checklist do Sono 😴
        </h3>
      </div>
      
      <p className="text-slate-300 text-xs mb-6">
        Cumpra os passos para preparar sua noite de descanso, mo.
      </p>

      <div className="space-y-3">
        {items.map((item) => {
          const isChecked = checkedItems.includes(item.id);
          return (
            <motion.div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isChecked
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all mt-0.5 ${
                  isChecked
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : 'border-slate-500'
                }`}
              >
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium leading-none ${isChecked ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                  {item.text}
                </p>
                <p className={`text-xs mt-1 leading-tight ${isChecked ? 'text-slate-500' : 'text-slate-400'}`}>
                  {item.subtext}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-500/20 to-indigo-500/20 border border-pink-500/30 rounded-xl p-4 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-flex items-center justify-center bg-pink-500 text-white p-2 rounded-full mb-2"
              >
                <Heart className="w-5 h-5 fill-white" />
              </motion.div>
              
              <h4 className="text-lg font-bold text-pink-300 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" /> Parabéns, bb! <Sparkles className="w-4 h-4" />
              </h4>
              <p className="text-sm text-slate-200 mt-1">
                Você completou sua rotina da noite! Acaba de ganhar um milhão de beijos virtuais e o sono mais tranquilo e gostoso do mundo! 😘💖
              </p>
              
              <button
                onClick={resetChecklist}
                className="mt-3 text-xs text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
              >
                Refazer checklist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-[10px] text-slate-500 text-right font-light">
        {checkedItems.length} de {items.length} concluídos
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Mail, X } from 'lucide-react';

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer relative group flex flex-col items-center"
          >
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            
            {/* Envelope Shape */}
            <div className="relative w-72 h-48 bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl border-2 border-rose-300 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Envelope flap simulation */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-white/20 clip-path-envelope" />
              
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <Heart className="w-12 h-12 text-rose-500 fill-rose-500" />
                </motion.div>
                <p className="font-medium text-rose-700 tracking-wide text-sm">
                  Para: Yasmim ❤️
                </p>
                <p className="text-xs text-rose-400 font-light italic">
                  (Toque para abrir, bb)
                </p>
              </div>
              
              {/* Corner decorations */}
              <div className="absolute bottom-2 right-2">
                <Mail className="w-5 h-5 text-rose-400 opacity-50" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative w-full max-w-lg bg-stone-50/98 text-stone-800 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-rose-100 max-h-[75vh] flex flex-col"
          >
            {/* Top Bar / Close */}
            <div className="flex items-center justify-between mb-4 border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                <span className="font-serif font-semibold text-rose-800 text-lg">
                  Uma Cartinha para Yasmim
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Letter Body */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 font-serif text-base sm:text-lg leading-relaxed text-stone-700 scrollbar-thin scrollbar-thumb-rose-200">
              <p className="font-semibold text-stone-800">
                Oi bb, meu amor,
              </p>
              
              <p>
                Estou passando aqui bem rapidinho, no finalzinho deste dia, só para te lembrar do quanto você é especial, importante e única no meu mundo. 💖
              </p>
              
              <p>
                Sei que a rotina e os dias podem ser cansativos, mas quando a noite chega e o céu fica assim, cheio de estrelas, meu primeiro e último pensamento é sempre você. Cada estrelinha lá fora é como um motivo que eu tenho para te amar e querer estar pertinho de você, cuidando e te protegendo.
              </p>
              
              <p>
                Quero que você feche os olhos agora, relaxe os ombros e respire fundo. Deixe de lado qualquer preocupação, qualquer peso do dia de hoje. Você fez o seu melhor, e amanhã será um novo dia brilhante. Agora, o seu único trabalho é descansar esse coração lindo.
              </p>
              
              <p>
                Queria muito estar aí para te cobrir, te dar um beijo na testa e sussurrar no seu ouvido que tudo vai dar certo. Como a distância física às vezes não deixa, criei essa cartinha interativa para te dar um abraço virtual bem quentinho, bem apertado!
              </p>
              
              <p>
                Dorme com os anjinhos, mo. Que seus sonhos sejam doces, leves e repletos de sorrisos. Que a noite traga o descanso que você tanto merece.
              </p>
              
              <p>
                Lembre-se sempre: eu amo você, hoje, amanhã e em todas as noites que ainda virão. Você é a minha paz. 🌙✨
              </p>

              <div className="pt-6 border-t border-rose-100 text-right font-serif italic">
                <p className="text-stone-500 text-sm">Com todo o meu amor e carinho,</p>
                <p className="text-rose-700 font-bold text-xl mt-1">Seu Amor ❤️</p>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-4 text-center text-xs text-rose-400 border-t border-rose-50 pt-2 font-sans font-light">
              Deslize para ler a carta inteira • Toque no X para fechar
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

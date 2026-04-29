import { motion } from 'framer-motion';
import { ExternalLink, Heart, Music } from 'lucide-react';

const spotifyTrackUrl = 'https://open.spotify.com/track/7eYEQnY6Lzh3Y8jSOt3xEF';
const spotifyEmbedUrl = 'https://open.spotify.com/embed/track/7eYEQnY6Lzh3Y8jSOt3xEF?utm_source=generator&theme=0';

export default function MusicPlayer() {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl max-w-md w-full">
      <div className="flex items-center gap-2 mb-5">
        <Music className="w-5 h-5 text-pink-400" />
        <h3 className="text-xl font-bold text-white font-sans">
          Nossa música da noite 🎶
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-900 via-purple-700 to-rose-500 border-4 border-slate-800 shadow-lg flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 rounded-full border border-white/10 scale-90" />
            <div className="absolute inset-0 rounded-full border border-black/30 scale-75" />
            <div className="absolute inset-0 rounded-full border border-black/30 scale-50" />
            <div className="w-9 h-9 rounded-full bg-slate-950 z-10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-rose-200">
              BK
            </div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="absolute -right-2 -top-2"
          >
            <Heart className="w-7 h-7 fill-rose-500 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-rose-300/80 font-semibold">
            Tocando agora
          </p>
          <h4 className="text-xl font-bold text-white truncate font-sans">
            Planos
          </h4>
          <p className="text-xs text-pink-300 truncate mt-0.5 font-medium">
            BK, Luccas Carlos e Arit
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 mb-4">
        <iframe
          title="Planos - BK no Spotify"
          src={spotifyEmbedUrl}
          width="100%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="block border-0"
        />
      </div>

      <a
        href={spotifyTrackUrl}
        target="_blank"
        rel="noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10 hover:text-white"
      >
        Abrir no Spotify
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}

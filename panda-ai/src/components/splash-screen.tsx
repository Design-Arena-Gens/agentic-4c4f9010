import { motion } from "framer-motion";

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/10"
      >
        <motion.span
          animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl"
        >
          🐼
        </motion.span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-8 text-3xl font-semibold tracking-tight"
      >
        Panda AI by Max
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-3 max-w-sm text-center text-sm text-white/70"
      >
        Warming up the bamboo lounge. Your personal voice companion is loading.
      </motion.p>
    </div>
  );
};

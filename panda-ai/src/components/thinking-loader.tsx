import { motion } from "framer-motion";

type ThinkingLoaderProps = {
  visible: boolean;
};

export const ThinkingLoader = ({ visible }: ThinkingLoaderProps) => {
  if (!visible) return null;

  return (
    <div className="mx-auto mt-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-purple-400/60 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-600 dark:text-purple-200">
      <motion.span
        className="h-2 w-2 rounded-full bg-purple-500"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span>Thinking with bamboo-fueled brainpower…</span>
    </div>
  );
};

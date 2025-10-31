import { motion } from "framer-motion";

type ListeningVisorProps = {
  active: boolean;
};

export const ListeningVisor = ({ active }: ListeningVisorProps) => {
  return (
    <div className="relative mt-6 flex h-20 w-full max-w-xl overflow-hidden rounded-3xl border border-pink-400/30 bg-pink-500/10 p-6">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent"
        animate={
          active
            ? {
                x: ["-100%", "100%"],
              }
            : { opacity: 0 }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative flex w-full items-center justify-between gap-2">
        {Array.from({ length: 32 }).map((_, index) => (
          <motion.span
            key={`wave-bar-${index}`}
            className="h-full w-1 rounded-full bg-pink-300/90 dark:bg-pink-200/80"
            animate={
              active
                ? {
                    height: ["20%", "90%", "35%"],
                  }
                : { height: "20%" }
            }
            transition={{
              duration: 0.9,
              repeat: Infinity,
              repeatDelay: 0.2,
              ease: "easeInOut",
              delay: index * 0.03,
            }}
          />
        ))}
      </div>
    </div>
  );
};

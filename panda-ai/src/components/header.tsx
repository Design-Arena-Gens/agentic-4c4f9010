import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SettingsDrawer } from "@/components/settings-drawer";

type HeaderProps = {
  isListening: boolean;
};

export const Header = ({ isListening }: HeaderProps) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeTheme = (resolvedTheme ?? theme ?? "light") as "light" | "dark" | string;

  const toggleTheme = () => {
    setTheme(activeTheme === "light" ? "dark" : "light");
  };

  return (
    <>
      <header className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white/70 p-4 shadow-lg shadow-black/5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 p-[2px] shadow-inner">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-950">
              <span className="text-2xl">🐼</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-pink-500">
              Panda AI by Max
            </p>
            <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Your friendly voice companion
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full bg-zinc-900/5 p-2 text-zinc-700 transition hover:bg-zinc-900/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            aria-label="Toggle theme"
          >
            {activeTheme === "light" ? "🌚" : "🌞"}
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-full bg-zinc-900/5 p-2 text-zinc-700 transition hover:bg-zinc-900/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            aria-label="Open settings"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="flex items-center justify-center py-4">
        <motion.div
          animate={
            isListening
              ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.05, 1],
                }
              : { opacity: 0.4, scale: 1 }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1 text-xs font-medium text-pink-600 dark:text-pink-300"
        >
          <span className="text-sm">🎧</span>
          <span>{isListening ? "Listening..." : "Tap the mic to talk"}</span>
        </motion.div>
      </div>
      <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

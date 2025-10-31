import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/context/settings";

type SettingsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type VoiceOption = {
  name: string;
  voiceURI: string;
  lang: string;
};

const getVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis.getVoices();
};

export const SettingsDrawer = ({ open, onClose }: SettingsDrawerProps) => {
  const { settings, updateSettings } = useSettings();
  const [voices, setVoices] = useState<VoiceOption[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const populate = () => {
      const options = getVoices()
        .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
        .map((voice) => ({
          name: voice.name,
          voiceURI: voice.voiceURI,
          lang: voice.lang,
        }));
      setVoices(options);
    };
    populate();
    window.speechSynthesis.addEventListener("voiceschanged", populate);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", populate);
  }, []);

  const selectedVoice = useMemo(() => {
    if (!settings.voiceURI) return "";
    return settings.voiceURI;
  }, [settings.voiceURI]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          aria-modal
          role="dialog"
        >
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="h-full w-full max-w-sm overflow-y-auto border-l border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Assistant Preferences
              </h2>
              <button
                onClick={onClose}
                className="rounded-full px-3 py-1 text-sm text-zinc-500 transition hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Personalize Panda AI by Max to match your vibe. Your preferences are stored
              only on this device.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Assistant name
                </label>
                <input
                  type="text"
                  value={settings.assistantName}
                  onChange={(event) => updateSettings({ assistantName: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm shadow-inner focus:border-pink-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="Panda"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Voice selection
                </label>
                <select
                  value={selectedVoice}
                  onChange={(event) =>
                    updateSettings({ voiceURI: event.target.value || null })
                  }
                  className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <option value="">System default</option>
                  {voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Speaking speed
                </label>
                <input
                  type="range"
                  min={0.6}
                  max={1.4}
                  step={0.05}
                  value={settings.speakingRate}
                  onChange={(event) =>
                    updateSettings({ speakingRate: Number(event.target.value) })
                  }
                  className="mt-3 w-full"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Current: {settings.speakingRate.toFixed(2)}x
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <h3 className="mb-2 font-semibold text-zinc-800 dark:text-white">
                  Privacy Promise
                </h3>
                <p>
                  Panda AI by Max listens only when you press the microphone. Sensitive
                  actions always require your confirmation and happen through secure
                  device prompts. Review the{" "}
                  <a
                    href="/privacy"
                    className="font-medium text-pink-500 underline underline-offset-2"
                  >
                    privacy policy
                  </a>{" "}
                  anytime.
                </p>
              </div>

              <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-700 dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-200">
                <h3 className="mb-2 font-semibold">About Panda AI</h3>
                <p>
                  Built as a playful assistant experience from the browser. For Google
                  Play listing, include this privacy statement and request permissions
                  with clear context. Voice features rely on the Web Speech APIs provided
                  by modern browsers.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

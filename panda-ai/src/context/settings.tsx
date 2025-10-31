"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AssistantSettings = {
  assistantName: string;
  voiceURI: string | null;
  speakingRate: number;
};

type SettingsContextValue = {
  settings: AssistantSettings;
  updateSettings: (value: Partial<AssistantSettings>) => void;
};

const DEFAULT_SETTINGS: AssistantSettings = {
  assistantName: "Panda",
  voiceURI: null,
  speakingRate: 1,
};

const STORAGE_KEY = "panda-ai-settings";

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => undefined,
});

const loadSettings = (): AssistantSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(stored) as AssistantSettings;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AssistantSettings>(() => loadSettings());

  const updateSettings = (value: Partial<AssistantSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...value };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const contextValue = useMemo(
    () => ({
      settings,
      updateSettings,
    }),
    [settings],
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);

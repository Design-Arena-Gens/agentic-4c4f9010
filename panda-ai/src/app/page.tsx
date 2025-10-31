"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/header";
import { ChatList } from "@/components/chat-list";
import { MicButton } from "@/components/mic-button";
import { ListeningVisor } from "@/components/listening-visor";
import { ThinkingLoader } from "@/components/thinking-loader";
import { SplashScreen } from "@/components/splash-screen";
import { useSettings } from "@/context/settings";
import { handleIntent } from "@/lib/intentHandler";
import {
  StoredMessage,
  clearStoredMessages,
  loadMessages,
  saveMessages,
} from "@/lib/storage";

type ChatMessage = StoredMessage;

type SpeechRecognitionWithStop = SpeechRecognition & {
  stop: () => void;
};

type SpeechWindow = typeof window & {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
  webkitAudioContext?: typeof AudioContext;
};

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const createSpeechRecognition = (): SpeechRecognitionWithStop | null => {
  if (typeof window === "undefined") return null;
  const speechWindow = window as SpeechWindow;
  const SpeechRecognitionAPI =
    speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) return null;
  const recognition = new SpeechRecognitionAPI();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  return recognition as SpeechRecognitionWithStop;
};

const playChime = () => {
  if (typeof window === "undefined") return;
  try {
    const audioWindow = window as SpeechWindow;
    const ctor = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!ctor) return;
    const ctx = new ctor();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (error) {
    console.warn("Could not play chime", error);
  }
};

const createAssistantGreeting = (assistantName: string): StoredMessage => ({
  id: generateId(),
  role: "assistant",
  text: `Hey there! I’m ${assistantName}, your bamboo-powered buddy. Tap the mic and tell me what you need—open apps, search the web, or just chat.`,
  createdAt: Date.now(),
});

export default function Home() {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const recognitionRef = useRef<SpeechRecognitionWithStop | null>(null);
  const queuedUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const initial = loadMessages();
    if (initial.length === 0) {
      const greeting = createAssistantGreeting(settings.assistantName);
      setMessages([greeting]);
      saveMessages([greeting]);
    } else {
      setMessages(initial);
    }
  }, [settings.assistantName]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined") return;
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speakingRate;
      if (settings.voiceURI) {
        const voice = window
          .speechSynthesis
          .getVoices()
          .find((candidate) => candidate.voiceURI === settings.voiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      }
      queuedUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [settings.speakingRate, settings.voiceURI],
  );

  const appendMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((prev) => {
        const next = [...prev, message];
        saveMessages(next);
        return next;
      });
    },
    [setMessages],
  );

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const processAssistantReply = useCallback(
    (text: string) => {
      const message: ChatMessage = {
        id: generateId(),
        role: "assistant",
        text,
        createdAt: Date.now(),
      };
      appendMessage(message);
      speak(text);
    },
    [appendMessage, speak],
  );

  const runAssistant = useCallback(
    async (prompt: string, conversation: ChatMessage[]) => {
      try {
        setThinking(true);

        const body = JSON.stringify({
          message: prompt,
          history: conversation.slice(-7).map((entry) => ({
            role: entry.role,
            content: entry.text,
          })),
          assistantName: settings.assistantName,
        });

        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        if (!response.ok) {
          throw new Error(`Assistant error: ${response.statusText}`);
        }

        const data = await response.json();
        const reply = data.reply as string;
        processAssistantReply(reply);
      } catch (error) {
        console.error(error);
        processAssistantReply(
          "I ran into a connection snag. Please check your API key or try again shortly.",
        );
      } finally {
        setThinking(false);
      }
    },
    [processAssistantReply, settings.assistantName],
  );

  const handleUserText = useCallback(
    async (text: string) => {
      if (!text) return;
      const trimmed = text.trim();
      if (trimmed.length === 0) return;
      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        text: trimmed,
        createdAt: Date.now(),
      };
      appendMessage(userMessage);

      const commandResult = handleIntent(trimmed);
      if (commandResult.handled) {
        if (commandResult.assistantMessage) {
          processAssistantReply(commandResult.assistantMessage);
        }
        return;
      }

      const history = [...messages, userMessage];
      await runAssistant(trimmed, history);
    },
    [appendMessage, messages, processAssistantReply, runAssistant],
  );

  const startListening = useCallback(() => {
    if (listening) {
      stopListening();
      return;
    }

    const recognition = createSpeechRecognition();
    if (!recognition) {
      processAssistantReply(
        "I can't access speech recognition in this browser. Try Chrome or Edge for full features.",
      );
      return;
    }

    playChime();
    recognitionRef.current = recognition;
    setListening(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      handleUserText(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error(event.error);
      processAssistantReply(
        "I couldn't hear anything. Please make sure microphone access is granted.",
      );
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }, [handleUserText, listening, processAssistantReply]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    void handleUserText(inputValue);
    setInputValue("");
  };

  const handleClearChat = () => {
    clearStoredMessages();
    const greeting = createAssistantGreeting(settings.assistantName);
    setMessages([greeting]);
    saveMessages([greeting]);
  };

  useEffect(() => {
    return () => {
      if (queuedUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formattedMessages = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role,
        text: message.text,
        timestamp: new Date(message.createdAt),
      })),
    [messages],
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-100 via-white to-zinc-100 pb-32 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-white">
      {!splashDone && <SplashScreen />}
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6 lg:px-8">
        <Header isListening={listening} />
        <section className="relative flex flex-1 flex-col rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-2xl shadow-black/5 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Conversation
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                All chats stay on-device unless you connect your own AI key.
              </p>
            </div>
            <button
              onClick={handleClearChat}
              className="rounded-full border border-zinc-200 bg-white px-4 py-1 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Clear chat
            </button>
          </div>
          <div className="mt-6 flex h-[420px] flex-col gap-6 overflow-y-auto pr-1">
            <ChatList messages={formattedMessages} />
          </div>
          <ThinkingLoader visible={thinking} />
          <ListeningVisor active={listening} />

          <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-3">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Prefer typing? Say hi to Panda AI here…"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 transition focus:border-pink-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-pink-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/40 transition hover:scale-[1.02]"
            >
              Send
            </button>
          </form>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-6 z-40 flex items-center justify-center">
        <MicButton
          listening={listening}
          onClick={startListening}
          loading={thinking}
          disabled={thinking}
        />
      </div>
    </div>
  );
}

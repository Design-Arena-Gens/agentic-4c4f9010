import clsx from "clsx";
import { Loader2, Mic, MicOff } from "lucide-react";

type MicButtonProps = {
  listening: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
};

export const MicButton = ({ listening, disabled, loading, onClick }: MicButtonProps) => {
  return (
    <button
      className={clsx(
        "group relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-400 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl shadow-pink-500/40 transition",
        disabled ? "cursor-not-allowed opacity-50" : "hover:scale-[1.05]",
        listening && "animate-pulse",
      )}
      disabled={disabled}
      onClick={onClick}
      aria-label={listening ? "Stop listening" : "Start listening"}
    >
      <div className="absolute -inset-4 rounded-full bg-pink-500/10 blur-3xl transition group-hover:bg-pink-500/20" />
      <div className="relative flex items-center justify-center">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : listening ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </div>
    </button>
  );
};

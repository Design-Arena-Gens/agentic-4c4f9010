import clsx from "clsx";

export type ChatMessageProps = {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const ChatMessage = ({ role, text, timestamp }: ChatMessageProps) => {
  const isUser = role === "user";
  return (
    <div className={clsx("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-lg">
          🐼
        </div>
      )}
      <div className={clsx("max-w-[80%] space-y-2 text-sm", isUser ? "text-right" : "text-left")}>
        <div
          className={clsx(
            "whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed shadow-lg shadow-black/5",
            isUser
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
          )}
        >
          {text}
        </div>
        <span className="block text-xs text-zinc-400 dark:text-zinc-500">
          {formatTime(timestamp)}
        </span>
      </div>
      {isUser && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-lg text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
          😊
        </div>
      )}
    </div>
  );
};

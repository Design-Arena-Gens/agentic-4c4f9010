import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage, ChatMessageProps } from "@/components/chat-message";

type ChatListProps = {
  messages: ChatMessageProps[];
};

export const ChatList = ({ messages }: ChatListProps) => {
  return (
    <div className="flex h-full flex-col gap-6">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.timestamp.getTime() + message.role + message.text}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ChatMessage {...message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

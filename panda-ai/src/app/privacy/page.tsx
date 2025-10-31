"use client";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-16 text-zinc-800 dark:text-zinc-50">
      <h1 className="text-3xl font-semibold">Panda AI by Max — Privacy Promise</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Last updated {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-3 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-950/70">
        <h2 className="text-xl font-semibold">Voice access is intentional</h2>
        <p>
          Panda AI listens only when you actively tap the microphone button. Speech audio
          is converted to text by your browser via the Web Speech API and never stored on
          our servers.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-950/70">
        <h2 className="text-xl font-semibold">Sensitive actions stay in your hands</h2>
        <p>
          Smart commands such as opening links, starting calls, or composing messages are
          launched through system prompts (e.g., tel:, sms:, calendar URLs). You decide
          whether to proceed. Panda AI never performs hidden background actions.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-950/70">
        <h2 className="text-xl font-semibold">AI responses and data</h2>
        <p>
          Chat history is stored locally in your browser so conversations stay private.
          To enable full AI responses, add your own OpenAI API key through the project
          environment. Requests are sent directly from the serverless API route to OpenAI.
        </p>
      </section>

      <section className="space-y-3 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg shadow-black/5 dark:border-zinc-800 dark:bg-zinc-950/70">
        <h2 className="text-xl font-semibold">Your responsibilities</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Inform users about voice usage in your Google Play listing.</li>
          <li>Request microphone, notifications, or other permissions only at runtime.</li>
          <li>Review applicable regional privacy and consent laws before deployment.</li>
        </ul>
      </section>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Questions or feedback? Reach out before shipping to ensure compliance with your
        local policies.
      </p>
    </div>
  );
}

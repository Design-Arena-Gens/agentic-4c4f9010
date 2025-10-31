import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/context/settings";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SettingsProvider>{children}</SettingsProvider>
    </ThemeProvider>
  );
};

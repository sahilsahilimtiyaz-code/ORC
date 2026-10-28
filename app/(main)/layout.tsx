import Splash from "@/components/Splash";
import ShellChrome from "@/components/ShellChrome";

/** Dark site chrome: sidebar rail + topbar + shell; splash overlays first paint. */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellChrome>
      {children}
      <Splash />
    </ShellChrome>
  );
}

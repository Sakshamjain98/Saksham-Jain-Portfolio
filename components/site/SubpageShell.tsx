import { navItems } from "@/data";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { Spotlight } from "@/components/ui/Spotlight";

/**
 * Shell for non-homepage public routes — preserves the JSM-era visual
 * language (spotlights, grid bg, max-width container, floating nav, footer
 * grid SVG) so subpages don't feel like a different site.
 */
export function SubpageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />

        <div className="relative pt-32 pb-20">
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <Spotlight
              className="-top-20 -left-10 md:-left-32 md:-top-10 h-[80vh]"
              fill="white"
            />
            <Spotlight className="h-[60vh] w-[40vw] top-10 left-full" fill="purple" />
            <div
              className="absolute inset-0 dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
                [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]"
            />
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

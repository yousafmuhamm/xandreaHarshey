/**
 * template.tsx re-mounts on every navigation, so the PageTransition enter
 * animation (curtain wipe + content fade) plays on each route change.
 */
import PageTransition from "@/components/motion/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-cream">
      <div className="container-site text-center">
        <span className="eyebrow text-gold">Error 404</span>
        <h1 className="mt-6 font-serif text-display-lg text-ink">Page not found</h1>
        <p className="mx-auto mt-5 max-w-md font-sans text-base text-ink/65">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button href="/" variant="ink">Return Home</Button>
          <Link
            href="/contact"
            className="link-underline self-center font-sans text-[0.72rem] uppercase tracking-eyebrow text-ink/70"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}

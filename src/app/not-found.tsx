import { Button } from "@/components/ui";
import { WaveDivider } from "@/components/Brand";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-base-900 text-white">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="glow-blob absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 opacity-50" />
      <div className="container-x relative text-center">
        <WaveDivider className="mx-auto h-5 w-24" />
        <p className="mt-6 font-display text-7xl font-extrabold">
          <span className="text-gradient">404</span>
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-fog">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" variant="primary">Back home</Button>
          <Button href="/products" variant="outline">Browse products</Button>
        </div>
      </div>
    </section>
  );
}

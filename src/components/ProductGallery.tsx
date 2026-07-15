"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const imgs = images.length ? images : [];

  if (!imgs.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-base-800 text-fog-dim">
        No image available
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="gradient-ring overflow-hidden rounded-2xl bg-base-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgs[active]}
          alt={name}
          className="aspect-square w-full object-contain p-8"
        />
      </div>
      {imgs.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {imgs.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`h-20 w-20 overflow-hidden rounded-xl border bg-base-800 p-2 transition ${
                active === i ? "border-teal ring-2 ring-teal/30" : "border-line hover:border-line-strong"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${name} view ${i + 1}`} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

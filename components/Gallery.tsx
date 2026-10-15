import React from "react";
import Image from "next/image";
import { Sparkles, Camera } from "lucide-react";

export function Gallery() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
      title: "Private Styling Stations",
      subtitle: "Bespoke Italian leather chairs & vanity mirrors",
      span: "col-span-1 md:col-span-2 row-span-2",
      height: "h-96 md:h-full min-h-[380px]",
    },
    {
      src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=800&auto=format&fit=crop",
      title: "Bridal Artistry Studio",
      subtitle: "High definition airbrush and heritage veil draping",
      span: "col-span-1",
      height: "h-64",
    },
    {
      src: "https://images.unsplash.com/photo-1519014816548-bf785179c2ff?q=80&w=800&auto=format&fit=crop",
      title: "Aroma Spa Pedicure Lounge",
      subtitle: "Warm botanical herbal baths & reflexology",
      span: "col-span-1",
      height: "h-64",
    },
    {
      src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
      title: "Holistic Scalp Therapy",
      subtitle: "Deep argan steam ritual & kansa marma massage",
      span: "col-span-1 md:col-span-2",
      height: "h-72",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#ab7f37]">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Tour</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
            The DEMO Atelier Experience
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base">
            Take a glimpse into our tranquil urban retreat, where architectural balance and soothing sensory comforts converge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {images.map((item, idx) => (
            <div
              key={idx}
              className={`group relative rounded-3xl overflow-hidden shadow-md ${item.span} ${item.height}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-6 left-6 right-6 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#dfc484] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3" />
                  Atelier Showcase
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">{item.title}</h3>
                <p className="text-zinc-300 text-xs sm:text-sm mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

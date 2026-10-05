import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import type { GalleryItem } from "@/content/siteContent";
import { easeLuxe, Eyebrow, Photo, Reveal } from "./primitives";

const ALL = "Усі";
const PAGE = 24;

export function PortfolioGrid() {
  const { content } = useSiteContent();
  const items = content.portfolio.items.filter((item) => item.imageUrl);
  const [category, setCategory] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE);

  const categories = useMemo(() => [ALL, ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))], [items]);
  const filtered = category === ALL ? items : items.filter((item) => item.category === category);
  // Фото багато (200+) — показуємо порціями, щоб сторінка не тягнула все одразу
  const visible = filtered.slice(0, limit);

  return (
    <section className="bg-ivory pb-24 md:pb-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:mb-14 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Категорії портфоліо">
            {categories.map((name) => {
              const count = name === ALL ? items.length : items.filter((item) => item.category === name).length;
              const active = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(name);
                    setLimit(PAGE);
                  }}
                  className={`eyebrow shrink-0 rounded-full border px-5 py-3 transition-colors duration-300 ${active ? "border-gold/60 bg-gold/15 text-gold-soft" : "border-ink/15 text-stone hover:border-ink/50 hover:text-ink"}`}
                >
                  {name} <span className="ml-1 opacity-50">{count}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div key={category} className="columns-2 gap-3 md:columns-3 md:gap-6">
            {visible.map((item, index) => (
              <motion.button
                type="button"
                key={item.id || item.imageUrl}
                onClick={() => setOpenIndex(index)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (index % PAGE < 6 ? index % PAGE : 6) * 0.06, ease: easeLuxe }}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-[1.25rem] border border-cream/10 bg-sand text-left shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:mb-6"
              >
                <Photo src={item.imageUrl} alt={item.altText || item.title} className="block h-auto w-full transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:p-6">
                  <span className="eyebrow block text-[0.58rem] text-gold-soft">{item.category}</span>
                  <span className="font-display mt-1 block text-xl md:text-2xl">{item.title}</span>
                </span>
              </motion.button>
            ))}
        </div>

        {filtered.length > visible.length && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="eyebrow text-stone">
              {visible.length} з {filtered.length}
            </p>
            <button
              type="button"
              onClick={() => setLimit((value) => value + PAGE)}
              className="eyebrow rounded-full border border-ink/80 px-8 py-4 text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-night"
            >
              Показати ще
            </button>
          </div>
        )}

        {filtered.length === 0 && <p className="py-20 text-center text-stone">У цій категорії поки немає фото.</p>}
      </div>

      <Lightbox items={filtered} index={openIndex} onChange={setOpenIndex} />
    </section>
  );
}

function Lightbox({ items, index, onChange }: { items: GalleryItem[]; index: number | null; onChange: (index: number | null) => void }) {
  const item = index !== null ? items[index] : null;
  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      onChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close, index, step]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-night/97 text-cream backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={close}
        >
          <div className="flex items-center justify-between px-5 py-5 md:px-10" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow text-cream/60">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button type="button" onClick={close} className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-night" aria-label="Закрити">
              <X className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
            <AnimatePresence mode="wait">
              <motion.img
                key={item.imageUrl}
                src={item.imageUrl}
                alt={item.altText || item.title}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: easeLuxe }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  if (info.offset.x > 60) step(-1);
                }}
                onClick={(event) => event.stopPropagation()}
                className="max-h-full max-w-full cursor-grab select-none object-contain active:cursor-grabbing"
                draggable={false}
              />
            </AnimatePresence>

            {items.length > 1 && (
              <>
                <button type="button" onClick={(event) => { event.stopPropagation(); step(-1); }} className="absolute left-4 hidden h-14 w-14 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-night md:flex" aria-label="Попереднє фото">
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.25} />
                </button>
                <button type="button" onClick={(event) => { event.stopPropagation(); step(1); }} className="absolute right-4 hidden h-14 w-14 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-cream hover:text-night md:flex" aria-label="Наступне фото">
                  <ArrowRight className="h-5 w-5" strokeWidth={1.25} />
                </button>
              </>
            )}
          </div>

          <div className="px-5 py-6 text-center md:px-10" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow text-gold-soft">{item.category}</p>
            <p className="font-display mt-2 text-2xl md:text-3xl">{item.title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Reels() {
  const { content } = useSiteContent();
  const reels = content.reels;
  if (reels.items.length === 0) return null;

  return (
    <section className="bg-night py-24 text-cream md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow tone="light">{reels.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2.6rem, 7vw, 5.75rem)" }}>
                {reels.titleLine1} <em className="italic text-gold-soft">{reels.titleAccent}</em>
              </h2>
            </Reveal>
          </div>
          {reels.moreUrl && (
            <Reveal delay={0.12}>
              <a href={reels.moreUrl} target="_blank" rel="noreferrer" className="eyebrow group inline-flex items-center gap-3 rounded-full border border-cream/30 px-7 py-4 transition-colors duration-300 hover:bg-cream hover:text-night">
                {reels.moreLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </a>
            </Reveal>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:gap-6 md:px-10 [&::-webkit-scrollbar]:hidden">
        {reels.items.map((reel, index) => (
          <motion.a
            key={reel.id || index}
            href={reel.url || reels.moreUrl || undefined}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: index * 0.1, ease: easeLuxe }}
            className="group relative aspect-[9/16] w-[72vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-cream/5 md:w-[300px]"
          >
            <Photo src={reel.imageUrl} alt={reel.altText || reel.title} className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-100" />
            <span className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-night/20" />
            <span className="eyebrow absolute right-4 top-4 rounded-full bg-night/40 px-3 py-2 text-[0.6rem] backdrop-blur-md">{reel.duration}</span>
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-cream/10 backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
              <Play className="ml-0.5 h-5 w-5" strokeWidth={1.5} fill="currentColor" />
            </span>
            <span className="font-display absolute inset-x-0 bottom-0 p-6 text-2xl md:text-3xl">{reel.title}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

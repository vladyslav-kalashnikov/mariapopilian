import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Crown } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { easeLuxe, responsiveSrc } from "./primitives";

export function Hero({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { content, photos } = useSiteContent();
  const hero = content.hero;
  const photo = photos["home.hero"];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: easeLuxe },
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory">
      <div className="mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-24 md:px-10 lg:grid-cols-12 lg:gap-6 lg:pt-28">
        <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-6">
          <motion.p {...fadeUp(0.3)} className="eyebrow inline-flex items-center gap-3 rounded-full border border-gold/30 bg-paper/70 px-4 py-2.5 text-gold">
            <Crown className="h-3.5 w-3.5" strokeWidth={1.5} />
            {hero.badge}
          </motion.p>

          <h1 className="display mt-8 text-ink" style={{ fontSize: "clamp(4.2rem, 10.5vw, 10.5rem)" }}>
            <motion.span {...fadeUp(0.4)} className="block">
              {hero.firstName}
            </motion.span>
            <motion.span {...fadeUp(0.52)} className="block italic text-gold lg:pl-[0.6em]">
              {hero.lastName}
            </motion.span>
          </h1>

          <motion.p {...fadeUp(0.66)} className="eyebrow mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-stone">
            {hero.roles.map((role, index) => (
              <span key={role} className="flex items-center gap-4">
                {index > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-gold" />}
                {role}
              </span>
            ))}
          </motion.p>

          <motion.div {...fadeUp(0.78)} className="mt-10 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate("portfolio")}
              className="eyebrow group inline-flex items-center gap-4 rounded-full bg-gold px-8 py-5 text-night transition-colors duration-300 hover:bg-gold-soft"
            >
              {hero.ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => onNavigate("about")} className="eyebrow link-underline pb-1 text-ink">
              Про Марію
            </button>
          </motion.div>

          {hero.highlights.length > 0 && (
            <motion.dl {...fadeUp(0.9)} className="mt-14 grid grid-cols-1 gap-6 border-t border-ink/10 pt-8 sm:grid-cols-3">
              {hero.highlights.map((item) => (
                <div key={item.label}>
                  <dt className="eyebrow text-gold">{item.label}</dt>
                  <dd className="mt-2 font-display text-lg leading-snug text-ink">{item.value}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[min(100%,calc(56svh*0.75))] p-3 md:p-4 lg:order-2 lg:max-w-[min(100%,calc(80svh*0.75))] lg:col-span-5 xl:col-span-6">
          {/* Рамка концентрична до арки: фото з відступом p-3/p-4 всередині */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-t-full border border-gold/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.9 }}
          />
          <motion.div
            className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-sand"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.5, ease: easeLuxe }}
          >
            <motion.img
              {...responsiveSrc(photo?.imageUrl, "(min-width: 1024px) 45vw, 90vw")}
              alt={photo?.altText ?? `${hero.firstName} ${hero.lastName}`}
              loading="eager"
              {...{ fetchpriority: "high" }}
              style={{ y: imageY }}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 2.2, ease: easeLuxe }}
              className="h-full w-full object-cover object-[50%_30%]"
            />
          </motion.div>
          <p className="eyebrow absolute -left-6 bottom-10 hidden origin-bottom-left -rotate-90 text-stone xl:block">
            Portfolio — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const line = items.filter(Boolean);
  if (line.length === 0) return null;
  const sequence = [...line, ...line, ...line];

  return (
    <div className="overflow-hidden border-y border-gold/20 bg-night py-5 text-cream md:py-7" aria-hidden>
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {sequence.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex items-center">
                <span className={`font-display px-8 text-3xl md:text-5xl ${index % 2 ? "italic text-gold-soft" : ""}`}>{item}</span>
                <span className="text-gold-soft">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

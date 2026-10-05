import { useEffect, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { valuePath } from "@/app/lib/routes";
import { easeLuxe, Eyebrow, Photo, Reveal } from "./primitives";

/** Окрема сторінка цінності: /values/<slug> */
export function ValuePage({ slug, onNavigate }: { slug: string; onNavigate: (page: string) => void }) {
  const { content } = useSiteContent();
  const values = content.personalBrand.values.filter((value) => value.slug);
  const index = values.findIndex((value) => value.slug === slug);
  const value = values[index];

  useEffect(() => {
    document.title = value ? `${value.title} — Марія Попілян` : "Сторінку не знайдено — Марія Попілян";
  }, [value]);

  const go = (event: MouseEvent, path: string) => {
    event.preventDefault();
    onNavigate(path);
  };

  if (!value) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 pb-36 pt-48 md:px-10">
        <p className="display text-5xl text-ink">Сторінку не знайдено</p>
        <a href="/about" onClick={(event) => go(event, "about")} className="eyebrow link-underline mt-10 inline-block pb-1 text-ink">
          До сторінки «Про Марію»
        </a>
      </section>
    );
  }

  const prev = values[(index - 1 + values.length) % values.length];
  const next = values[(index + 1) % values.length];

  return (
    <article className="bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 pb-20 pt-32 md:px-10 md:pt-44 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col justify-center lg:col-span-6">
          <Reveal>
            <a href="/about" onClick={(event) => go(event, "about")} className="eyebrow group inline-flex items-center gap-3 text-stone hover:text-ink">
              <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.5} />
              {content.personalBrand.eyebrow}
            </a>
          </Reveal>
          <Reveal delay={0.06}>
            <Eyebrow className="mt-12">
              {value.num} / {String(values.length).padStart(2, "0")}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="display mt-6 italic text-ink" style={{ fontSize: "clamp(3.4rem, 9vw, 8rem)" }}>
              {value.title}
            </h1>
          </Reveal>
          {value.lead && (
            <Reveal delay={0.18}>
              <p className="font-display mt-8 max-w-xl text-2xl leading-snug text-stone md:text-[1.75rem]">{value.lead}</p>
            </Reveal>
          )}
        </div>

        {value.imageUrl && (
          <motion.div
            className="relative mx-auto w-full max-w-[520px] p-3 md:p-4 lg:col-span-5 lg:col-start-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeLuxe }}
          >
            <div aria-hidden className="absolute inset-0 rounded-t-full border border-gold/40" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-sand">
              <Photo src={value.imageUrl} alt={`Марія Попілян — ${value.title.toLowerCase()}`} eager className="h-full w-full object-cover object-center" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="mx-auto max-w-[760px] px-5 pb-24 md:pb-32">
        <div className="space-y-7 text-[1.0625rem] leading-[1.9] text-ink/80 md:text-lg">
          {(value.body?.filter((paragraph) => paragraph.trim()) ?? [value.description]).map((paragraph, i) => (
            <Reveal key={i} delay={0.04}>
              <p className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.85] first-letter:text-gold" : ""}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        {value.quote && (
          <Reveal>
            <figure className="my-16 border-l border-gold pl-8 md:pl-10">
              <blockquote className="font-display text-[clamp(1.6rem,3vw,2.3rem)] italic leading-snug text-ink">“{value.quote}”</blockquote>
              {value.quoteSource && <figcaption className="eyebrow mt-6 text-gold">— {value.quoteSource}</figcaption>}
            </figure>
          </Reveal>
        )}
      </div>

      <nav className="grid grid-cols-2 border-t border-ink/10" aria-label="Інші цінності">
        {[
          { item: prev, label: "Попередня", align: "items-start text-left", icon: <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> },
          { item: next, label: "Наступна", align: "items-end text-right border-l border-ink/10", icon: <ArrowRight className="h-4 w-4" strokeWidth={1.5} /> },
        ].map(({ item, label, align, icon }) => (
          <a
            key={label}
            href={valuePath(item.slug!)}
            onClick={(event) => go(event, valuePath(item.slug!))}
            className={`group flex flex-col gap-3 px-5 py-12 transition-colors duration-500 hover:bg-night md:px-10 md:py-16 ${align}`}
          >
            <span className="eyebrow inline-flex items-center gap-3 text-stone group-hover:text-gold-soft">
              {label === "Попередня" && icon}
              {label}
              {label === "Наступна" && icon}
            </span>
            <span className="font-display text-3xl text-ink transition-colors duration-500 group-hover:italic group-hover:text-cream md:text-5xl">{item.title}</span>
          </a>
        ))}
      </nav>
    </article>
  );
}

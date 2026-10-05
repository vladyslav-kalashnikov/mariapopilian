import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Plus } from "lucide-react";

import { valuePath } from "@/app/lib/routes";
import { useSiteContent } from "@/app/content/SiteContentProvider";
import { easeLuxe, Eyebrow, Photo, Reveal, SectionTitle } from "./primitives";

export function Values({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { content } = useSiteContent();
  const brand = content.personalBrand;

  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <Eyebrow>{brand.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionTitle line={brand.titleMain} accent={brand.titleAccent} className="mt-6 max-w-4xl text-ink" />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 border-l border-t border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {brand.values.map((value, index) => {
            const href = value.slug ? valuePath(value.slug) : undefined;
            return (
              <motion.a
                key={value.num + value.title}
                href={href}
                onClick={(event) => {
                  if (!href) return;
                  event.preventDefault();
                  onNavigate(href);
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: index * 0.08, ease: easeLuxe }}
                className={`group relative flex min-h-[340px] flex-col justify-between overflow-hidden border-b border-r border-ink/10 p-8 transition-colors duration-500 hover:bg-night md:p-10 ${href ? "cursor-pointer" : ""}`}
              >
                {value.imageUrl && (
                  <Photo
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    src={value.imageUrl}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-30"
                  />
                )}
                <span className="eyebrow relative text-gold transition-colors duration-500 group-hover:text-gold-soft">{value.num}</span>
                <div className="relative">
                  <h3 className="font-display text-3xl text-ink transition-colors duration-500 group-hover:italic group-hover:text-cream md:text-4xl">{value.title}</h3>
                  <p className="mt-4 leading-relaxed text-stone transition-colors duration-500 group-hover:text-cream/75">{value.description}</p>
                  {href && (
                    <span className="eyebrow mt-8 inline-flex items-center gap-3 text-ink transition-colors duration-500 group-hover:text-gold-soft">
                      Читати
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                    </span>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Timeline() {
  const { content } = useSiteContent();
  const career = content.careerTimeline;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-night py-24 text-cream md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow tone="light">{career.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)" }}>
                {career.titleLine1} <em className="italic text-gold-soft">{career.titleAccent}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-sm leading-relaxed text-cream/60">{career.description}</p>
            </Reveal>
            {career.highlights.length > 0 && (
              <Reveal delay={0.24}>
                <dl className="mt-10 flex gap-10">
                  {career.highlights.map((item) => (
                    <div key={item.label}>
                      <dd className="font-display text-5xl text-gold-soft">{item.value}</dd>
                      <dt className="eyebrow mt-2 text-[0.6rem] text-cream/50">{item.label}</dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </div>

        <ol className="border-t border-cream/15 lg:col-span-7 lg:col-start-6">
          {career.achievements.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.li
                key={item.year + item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: index * 0.05, ease: easeLuxe }}
                className="border-b border-cream/15"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="group grid w-full grid-cols-[4.5rem_1fr_auto] items-baseline gap-4 py-8 text-left md:grid-cols-[7rem_1fr_auto]"
                >
                  <span className="font-display text-2xl italic text-gold-soft md:text-3xl">{item.year}</span>
                  <span>
                    <span className="font-display block text-2xl md:text-4xl">{item.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-cream/55 md:text-base">{item.description}</span>
                  </span>
                  <Plus className={`h-5 w-5 self-center text-gold-soft transition-transform duration-500 ${isOpen ? "rotate-45" : "group-hover:rotate-90"}`} strokeWidth={1.25} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && item.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: easeLuxe }}
                      className="overflow-hidden"
                    >
                      <p className="pb-10 pr-6 leading-[1.85] sm:pl-[5.5rem] text-cream/70 md:pl-[8rem]">{item.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {career.quote && (
        <Reveal className="mx-auto mt-24 max-w-4xl px-5 text-center md:mt-32">
          <blockquote className="font-display text-[clamp(1.6rem,3vw,2.5rem)] italic leading-snug text-cream/90">“{career.quote}”</blockquote>
          <p className="eyebrow mt-8 text-gold-soft">— {career.quoteAuthor}</p>
        </Reveal>
      )}
    </section>
  );
}

export function Charity({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { content, photos } = useSiteContent();
  const charity = content.charity;
  const photo = photos["about.charity"];

  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>{charity.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionTitle line={charity.titleLine1} accent={charity.titleAccent} className="mt-6 text-ink" size="clamp(2.6rem, 5vw, 4.5rem)" />
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 space-y-5 leading-[1.85] text-stone">
              {charity.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          {charity.buttonLabel && (
            <Reveal delay={0.24}>
              <button type="button" onClick={() => onNavigate("contact")} className="eyebrow mt-10 rounded-full border border-ink/80 px-7 py-4 text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-night">
                {charity.buttonLabel}
              </button>
            </Reveal>
          )}
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <div className="relative mx-auto max-w-[560px] p-3 md:p-4">
            <div aria-hidden className="absolute inset-0 rounded-t-full border border-gold/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-sand">
              <Photo src={photo?.imageUrl} alt={photo?.altText ?? ""} className="h-full w-full object-cover object-center" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

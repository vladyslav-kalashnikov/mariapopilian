import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import type { GalleryItem } from "@/content/siteContent";
import { easeLuxe, Eyebrow, Photo, Reveal, SectionTitle } from "./primitives";

type NavigateProps = { onNavigate: (page: string) => void };

/** «Хто вона»: портрет + позиціонування + цифри. На головній — зі посиланням на сторінку «Про Марію» */
export function AboutIntro({ onNavigate, compact = false }: Partial<NavigateProps> & { compact?: boolean }) {
  const { content, photos } = useSiteContent();
  const about = content.about;
  const photo = photos["about.identity"];

  return (
    <section className="relative bg-ivory py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-cream/10 bg-sand">
              <Photo src={photo?.imageUrl} alt={photo?.altText ?? "Марія Попілян"} className="h-full w-full object-cover transition-transform duration-[2s] ease-out hover:scale-105" />
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <Reveal>
            <Eyebrow>{about.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display mt-6 text-ink" style={{ fontSize: "clamp(2.8rem, 6vw, 5.25rem)" }}>
              {about.headlineLines.map((line, index) => (
                <span key={line} className={`block ${index % 2 === 1 ? "italic text-gold" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 space-y-5 text-base leading-[1.85] text-stone md:text-[1.0625rem]">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {about.stats.length > 0 && (
            <Reveal delay={0.24}>
              <dl className="mt-12 grid grid-cols-3 border-y border-ink/10">
                {about.stats.map((stat, index) => (
                  <div key={stat.label} className={`py-6 ${index > 0 ? "border-l border-ink/10 pl-5 md:pl-8" : ""}`}>
                    <dd className="font-display text-4xl text-ink md:text-5xl">{stat.value}</dd>
                    <dt className="eyebrow mt-3 text-[0.6rem] text-stone">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {!compact && onNavigate && (
            <Reveal delay={0.3}>
              <button type="button" onClick={() => onNavigate("about")} className="eyebrow group mt-10 inline-flex items-center gap-4 text-ink">
                <span className="link-underline pb-1">Більше про Марію</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
              </button>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

/** Добірка з портфоліо на головній: асиметрична редакційна сітка */
export function FeaturedWork({ onNavigate }: NavigateProps) {
  const { content } = useSiteContent();
  // Перше фото портфоліо вже стоїть у hero — тут показуємо наступні
  const items = content.portfolio.items.filter((item) => item.imageUrl).slice(1, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <Eyebrow>Портфоліо</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <SectionTitle line={content.portfolio.titleLine1} accent={content.portfolio.titleAccent} className="mt-6 text-ink" />
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <button type="button" onClick={() => onNavigate("portfolio")} className="eyebrow group inline-flex items-center gap-4 rounded-full border border-ink/80 px-7 py-4 text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-night">
              Усі роботи
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
          <FeaturedCard item={items[0]} index={0} onNavigate={onNavigate} className="aspect-[4/5]" />
          {items.length > 1 && (
            <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-6">
              {items.slice(1, 5).map((item, index) => (
                <FeaturedCard key={item.id || index} item={item} index={index + 1} onNavigate={onNavigate} className="aspect-[4/5] md:aspect-auto" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item, index, onNavigate, className }: NavigateProps & { item: GalleryItem; index: number; className: string }) {
  return (
    <motion.button
      type="button"
      onClick={() => onNavigate("portfolio")}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay: (index % 3) * 0.1, ease: easeLuxe }}
      className={`group relative overflow-hidden rounded-[1.35rem] border border-cream/10 bg-sand text-left shadow-[0_30px_80px_rgba(0,0,0,0.35)] ${className}`}
    >
      <Photo src={item.imageUrl} alt={item.altText || item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" />
      <span className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-cream md:p-6">
        <span>
          <span className="eyebrow block text-[0.58rem] text-gold-soft">{item.category}</span>
          <span className={`font-display mt-1 block ${index === 0 ? "text-2xl md:text-4xl" : "text-lg md:text-2xl"}`}>{item.title}</span>
        </span>
        <ArrowUpRight className="hidden h-5 w-5 shrink-0 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block" strokeWidth={1.25} />
      </span>
    </motion.button>
  );
}

/** Напрямки співпраці — типографічний список з розкриттям опису */
export function Services() {
  const { content } = useSiteContent();
  const services = content.services;
  const [active, setActive] = useState(0);

  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <Eyebrow>{services.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <SectionTitle line={services.titleLine1} accent={services.titleAccent} className="mt-6 text-ink" size="clamp(2.6rem, 5vw, 4.5rem)" />
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-sm leading-relaxed text-stone">{services.description}</p>
            </Reveal>
          </div>
        </div>

        <ul className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {services.items.map((item, index) => {
            const isActive = active === index;
            return (
              <motion.li
                key={item.num + item.title}
                className="border-b border-ink/15"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: index * 0.06, ease: easeLuxe }}
              >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    aria-expanded={isActive}
                    className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[5rem_1fr_auto] md:py-9"
                  >
                    <span className="eyebrow text-gold">{item.num}</span>
                    <span className={`font-display text-3xl transition-colors duration-500 md:text-5xl ${isActive ? "italic text-ink" : "text-ink/45 group-hover:text-ink"}`}>{item.title}</span>
                    <span className={`h-px w-10 self-center bg-gold transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0"} origin-left`} aria-hidden />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <p className="overflow-hidden pl-[4rem] pr-4 leading-relaxed text-stone md:max-w-xl md:pl-[6rem]">
                      <span className="block pb-8">{item.desc}</span>
                    </p>
                  </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Цитата на темному тлі з фото */
export function QuoteBand() {
  const { content } = useSiteContent();
  const brand = content.personalBrand;
  const photo = content.portfolio.items.find((item) => item.imageUrl.includes("studio-bw")) ?? content.portfolio.items[3];

  return (
    <section className="relative overflow-hidden bg-night text-cream">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px]">
          {photo && <Photo src={photo.imageUrl} alt={photo.altText} className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" />}
        </div>
        <div className="flex flex-col justify-center px-5 py-20 md:px-16 lg:py-28">
          <Reveal>
            <span className="font-display block text-8xl leading-none text-gold-soft" aria-hidden>
              “
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="font-display -mt-6 text-[clamp(1.8rem,3.4vw,3rem)] italic leading-[1.2]">{brand.quote}</blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="eyebrow mt-10 text-gold-soft">— {brand.quoteAuthor}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ContactCta({ onNavigate }: NavigateProps) {
  const { content } = useSiteContent();
  const contact = content.contact;

  return (
    <section className="bg-sand py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 text-center md:px-10">
        <Reveal>
          <Eyebrow className="justify-center">{contact.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionTitle line={contact.titlePrefix} accent={contact.titleAccent} className="mx-auto mt-8 max-w-5xl text-ink" size="clamp(3rem, 9vw, 8rem)" />
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-lg leading-relaxed text-stone">
            Зйомки, покази, події та амбасадорство — напишіть про ваш проєкт, і Марія відповість особисто.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <button
            type="button"
            onClick={() => onNavigate("contact")}
            className="eyebrow group mt-12 inline-flex items-center gap-4 rounded-full bg-gold px-10 py-5 text-night transition-colors duration-300 hover:bg-gold-soft"
          >
            {contact.form.submitLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

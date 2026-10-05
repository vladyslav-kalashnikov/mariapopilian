import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { easeLuxe, Eyebrow, Photo, Reveal, SectionTitle } from "./primitives";
import { visibleNavLinks } from "./navLinks";
import { normalizePageId, pageToPath } from "@/app/lib/routes";

export function PressList() {
  const { content } = useSiteContent();
  const press = content.press;
  if (press.items.length === 0) return null;

  return (
    <section className="bg-ivory pb-24 md:pb-36">
      <ul className="mx-auto max-w-[1440px] border-t border-ink/15 px-5 md:px-10">
        {press.items.map((item, index) => (
          <motion.li
            key={item.title + index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: index * 0.05, ease: easeLuxe }}
            className="border-b border-ink/15"
          >
            <a href={item.url || undefined} target="_blank" rel="noreferrer" className="group grid grid-cols-[4rem_1fr_auto] items-baseline gap-4 py-8 md:grid-cols-[6rem_14rem_1fr_10rem_auto] md:gap-8 md:py-10">
              <span className="font-display text-xl italic text-gold">{item.year}</span>
              <span className="eyebrow hidden text-ink md:block">{item.magazine}</span>
              <span>
                <span className="eyebrow mb-2 block text-[0.6rem] text-stone md:hidden">{item.magazine}</span>
                <span className="font-display block text-2xl text-ink transition-colors duration-500 group-hover:text-gold md:text-3xl">{item.title}</span>
              </span>
              <span className="eyebrow hidden text-stone md:block">{item.category}</span>
              <ArrowUpRight className="h-5 w-5 text-ink transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.25} />
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function Journal() {
  const { content } = useSiteContent();
  const journal = content.journal;
  if (journal.items.length === 0) return null;

  return (
    <section className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <Eyebrow>{journal.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <SectionTitle line={journal.titlePrefix} accent={journal.titleAccent} className="mt-6 text-ink" />
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {journal.items.map((item, index) => (
            <Reveal key={item.id || index} delay={index * 0.08}>
              <a href={item.href || undefined} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-cream/10 bg-sand">
                  <Photo src={item.imageUrl} alt={item.altText || item.title} className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-6 text-stone">{item.date}</p>
                <h3 className="font-display mt-3 text-2xl leading-snug text-ink transition-colors group-hover:text-gold">{item.title}</h3>
                <span className="eyebrow mt-5 inline-flex items-center gap-3 text-ink">
                  {item.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Сторінка контактів. Бекенду для листів немає — форма відкриває поштовий клієнт з готовим листом */
export function ContactPage() {
  const { content } = useSiteContent();
  const contact = content.contact;
  const [sent, setSent] = useState(false);
  const foundEmail = contact.methods.find((method) => method.href.startsWith("mailto:"))?.href.replace("mailto:", "") ?? "";
  // Заглушка example.com — не справжня пошта: тоді замість форми ведемо в Instagram
  const email = foundEmail.endsWith("example.com") ? "" : foundEmail;
  const instagram = contact.methods.find((method) => method.href.includes("instagram.com"));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("from") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();
    const subject = `Співпраця — ${name || "запит із сайту"}`;
    const body = `${details}\n\n${name}\n${from}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const fieldClass =
    "peer w-full border-0 border-b border-ink/20 bg-transparent pb-3 pt-6 text-lg text-ink outline-none transition-colors placeholder:text-transparent focus:border-ink";
  const labelClass =
    "eyebrow pointer-events-none absolute left-0 top-6 text-stone transition-all duration-300 peer-focus:top-0 peer-focus:text-[0.6rem] peer-focus:text-gold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.6rem]";

  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-5 pb-24 pt-36 md:px-10 md:pb-36 md:pt-48 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>{contact.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionTitle as="h1" line={contact.titlePrefix} accent={contact.titleAccent} className="mt-6 text-ink" size="clamp(3.2rem, 8vw, 7.5rem)" />
          </Reveal>

          <div className="mt-16 border-t border-ink/15">
            {contact.methods.map((method, index) => (
              <Reveal key={method.label} delay={0.12 + index * 0.06}>
                <a href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-baseline justify-between gap-6 border-b border-ink/15 py-6">
                  <span className="eyebrow text-stone">{method.label}</span>
                  <span className="font-display flex items-center gap-3 text-right text-xl text-ink transition-colors group-hover:text-gold md:text-2xl">
                    {method.value}
                    <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.5} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.15}>
          {!email && instagram ? (
            <div className="rounded-[1.75rem] border border-gold/20 bg-night/80 p-8 text-cream backdrop-blur-xl shadow-[0_40px_80px_-40px_rgba(21,18,15,0.45)] md:p-12">
              <p className="eyebrow text-gold-soft">Найшвидше</p>
              <p className="font-display mt-4 text-3xl md:text-4xl">Напишіть у Direct</p>
              <p className="mt-4 leading-relaxed text-cream/65">Зйомки, покази, хореографія чи події — опишіть проєкт у повідомленні, і Марія відповість особисто.</p>
              <a href={instagram.href} target="_blank" rel="noreferrer" className="eyebrow group mt-10 inline-flex w-full items-center justify-center gap-4 rounded-full bg-gold px-8 py-5 text-night transition-colors duration-300 hover:bg-gold-soft">
                {instagram.value}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </a>
            </div>
          ) : (
          <form onSubmit={onSubmit} className="rounded-[1.75rem] border border-cream/10 bg-paper p-8 backdrop-blur-xl shadow-[0_40px_80px_-40px_rgba(21,18,15,0.25)] md:p-12">
            <p className="font-display text-3xl text-ink">Запит на співпрацю</p>
            <p className="mt-3 text-sm leading-relaxed text-stone">Заповніть форму — відкриється лист у вашій пошті з усіма деталями.</p>

            <div className="mt-10 space-y-8">
              <div className="relative">
                <input id="name" name="name" required placeholder=" " className={fieldClass} autoComplete="name" />
                <label htmlFor="name" className={labelClass}>{contact.form.namePlaceholder}</label>
              </div>
              <div className="relative">
                <input id="from" name="from" required placeholder=" " className={fieldClass} autoComplete="email" />
                <label htmlFor="from" className={labelClass}>{contact.form.emailPlaceholder}</label>
              </div>
              <div className="relative">
                <textarea id="details" name="details" required rows={4} placeholder=" " className={`${fieldClass} resize-none`} />
                <label htmlFor="details" className={labelClass}>{contact.form.detailsPlaceholder}</label>
              </div>
            </div>

            <button type="submit" disabled={!email} className="eyebrow group mt-12 inline-flex w-full items-center justify-center gap-4 rounded-full bg-gold px-8 py-5 text-night transition-colors duration-300 hover:bg-gold-soft disabled:opacity-40">
              {contact.form.submitLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
            </button>
            {sent && <p className="mt-5 text-center text-sm text-stone">Дякуємо! Якщо пошта не відкрилась — напишіть напряму: {email}</p>}
          </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { content } = useSiteContent();
  const links = visibleNavLinks(content);

  return (
    <footer className="bg-night text-cream">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10 md:pt-28">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="display text-[clamp(3rem,8vw,6.5rem)]">
              {content.navigation.logoPrimary} <em className="italic text-gold-soft">{content.navigation.logoAccent}</em>
            </p>
            <p className="eyebrow mt-6 text-cream/50">{content.contact.footerRight}</p>
          </div>
          <nav className="md:col-span-3" aria-label="Сторінки">
            <p className="eyebrow mb-6 text-gold-soft">Сторінки</p>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={pageToPath(normalizePageId(link.id))}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(link.id);
                    }}
                    className="link-underline text-cream/80 hover:text-gold-soft"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow mb-6 text-gold-soft">Соцмережі</p>
            <ul className="space-y-3">
              {content.navigation.socialLinks.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-2 text-cream/80 hover:text-gold-soft">
                    {social.label}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 md:flex-row md:items-center md:justify-between">
          <p>{content.footer.copyright}</p>
          <a href="/admin" className="hover:text-cream/70">
            {content.footer.cmsLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}

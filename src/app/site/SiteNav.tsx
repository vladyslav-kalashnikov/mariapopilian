import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useSiteContent } from "@/app/content/SiteContentProvider";
import { easeLuxe } from "./primitives";
import { visibleNavLinks } from "./navLinks";
import { normalizePageId, pageToPath } from "@/app/lib/routes";

export function SiteNav({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
  const { content } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = visibleNavLinks(content);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (page: string) => {
    setOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,padding] duration-500 ${
          scrolled || open ? "bg-night/75 py-3 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl" : "bg-transparent py-5 md:py-7"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              go("home");
            }}
            className="group flex items-baseline gap-2 text-ink"
            aria-label="На головну"
          >
            <span className="font-display text-[1.35rem] leading-none tracking-tight md:text-2xl">{content.navigation.logoPrimary}</span>
            <span className="font-display text-[1.35rem] italic leading-none tracking-tight text-gold md:text-2xl">{content.navigation.logoAccent}</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={pageToPath(normalizePageId(link.id))}
                  onClick={(event) => {
                    event.preventDefault();
                    go(link.id);
                  }}
                  aria-current={currentPage === link.id ? "page" : undefined}
                  className={`eyebrow link-underline pb-1 transition-colors ${currentPage === link.id ? "text-ink [background-size:100%_1px]" : "text-stone hover:text-ink"}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/contact"
            onClick={(event) => {
              event.preventDefault();
              go("contact");
            }}
            className="eyebrow hidden rounded-full border border-ink/80 px-6 py-3 text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-night lg:inline-block"
          >
            {content.footer.ctaLabel}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={open}
          >
            <span className={`absolute h-px w-7 bg-ink transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
            <span className={`absolute h-px w-7 bg-ink transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col justify-between bg-night px-5 pb-10 pt-28 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ul className="space-y-2">
              {links.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index + 0.1, duration: 0.7, ease: easeLuxe }}
                >
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={`display flex w-full items-baseline gap-4 py-2 text-left text-[clamp(2.6rem,12vw,4rem)] ${currentPage === link.id ? "italic text-gold" : "text-ink"}`}
                  >
                    <span className="eyebrow text-stone">0{index + 1}</span>
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/10 pt-6">
              {content.navigation.socialLinks.map((social) => (
                <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className="eyebrow text-stone hover:text-ink">
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
